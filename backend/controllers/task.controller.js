import mongoose from "mongoose";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";

// Create a new task
export const createTask = async (req, res) => {
  const { type, action, link, points = 2 } = req.body;

  try {
    // Validate required fields
    if (!type || !action || !link) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: type, action, link'
      });
    }

    // Create the task
    const task = await Task.create({
      type,
      action,
      link,
      points,
      addedBy: req.user._id,
      completions: [],
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message || 'Validation failed'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal Server Error while creating task'
    });
  }
};

// Get all available tasks for a user
export const getAllTasks = async (req, res) => {
  try {
    // Find all active tasks except those created by the current user
    const tasks = await Task.find({ 
      isActive: true,
      addedBy: { $ne: req.user._id }
    })
      .populate('addedBy', 'name')
      .sort({ points: -1, createdAt: -1 }); // Sort by points (descending) and then by creation date

    // Filter out tasks that the user has already completed
    const availableTasks = tasks.filter(task => {
      const hasCompleted = task.completions.some(
        completion => completion.userId.toString() === req.user._id.toString()
      );
      return !hasCompleted;
    });

    // Get user's own tasks
    const ownTasks = await Task.find({ 
      addedBy: req.user._id,
      isActive: true 
    })
      .populate('addedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tasks: availableTasks,
      ownTasks: ownTasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error while fetching tasks'
    });
  }
};

// Complete a task and earn points
export const completeTask = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user._id;

  try {
    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if task is active
    if (!task.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This task is no longer active'
      });
    }

    // Check if user has already completed this task
    const hasCompleted = task.completions.some(
      completion => completion.userId.toString() === userId.toString()
    );

    if (hasCompleted) {
      return res.status(400).json({
        success: false,
        message: 'You have already completed this task'
      });
    }

    // Start a session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update user points and add completion record
      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { points: task.points } },
        { new: true, session }
      );

      // Deduct points from task creator
      await User.findByIdAndUpdate(
        task.addedBy,
        { $inc: { points: -task.points } },
        { session }
      );

      // Add completion record to task
      task.completions.push({
        userId,
        pointsEarned: task.points
      });

      await task.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: 'Task completed successfully',
        updatedPoints: user.points,
        pointsEarned: task.points
      });
    } catch (error) {
      // If anything fails, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing task'
    });
  }
};

// Admin: Delete a task
export const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { isActive: false },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task'
    });
  }
};

// Admin: Get all tasks (including inactive)
export const getAllTasksAdmin = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('addedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks'
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user and tasks
    const [user, tasks] = await Promise.all([
      User.findById(userId).select('points').lean(),
      Task.find().select('_id type action link addedBy completions').lean()
    ]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Transform and separate own tasks and available tasks
    const { ownTasks, availableTasks } = tasks.reduce((acc, task) => {
      const isOwnTask = task.addedBy.toString() === userId.toString();
      const transformedTask = {
        _id: task._id,
        type: task.type,
        action: task.action,
        link: task.link
      };

      if (isOwnTask) {
        acc.ownTasks.push(transformedTask);
      } else {
        acc.availableTasks.push(transformedTask);
      }

      return acc;
    }, { ownTasks: [], availableTasks: [] });

    res.json({
      tasks: availableTasks,
      ownTasks: ownTasks,
      points: user.points
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};
