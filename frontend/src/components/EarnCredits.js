import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetAllTasksQuery,
  useSubmitTaskMutation,
  useCompleteTaskMutation,
} from "../redux/slices/tasksApiSlice";
import toast from "react-hot-toast";
import { setCredentials } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { CircularProgress, Alert, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const TaskPopup = ({ task, onClose, onConfirm, isCompleting }) => {
  const [hasVisitedLink, setHasVisitedLink] = useState(false);
  const theme = useTheme();
  
  const handleLinkClick = (e) => {
    e.preventDefault();
    window.open(task?.link, '_blank');
    setHasVisitedLink(true);
  };

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className={`${theme.palette.mode === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg p-8 w-full max-w-md relative shadow-2xl ${theme.palette.mode === 'dark' ? 'text-gray-100' : 'text-gray-800'} border ${theme.palette.mode === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${theme.palette.mode === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition duration-200`}
          type="button"
          aria-label="Close task popup"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className={`text-2xl font-bold mb-4 text-center pr-8 border-b pb-3 ${theme.palette.mode === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
          {task?.type} - {task?.action}
        </h3>
        <div className="my-6">
          <p className={`mb-4 text-center text-lg ${theme.palette.mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {hasVisitedLink ? 'Great! Now claim your points!' : 'Click below to visit the link and complete the task:'}
          </p>
          <button
            onClick={handleLinkClick}
            className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 text-lg font-semibold"
            aria-label={`Open task link for ${task?.type} ${task?.action}`}
          >
            {hasVisitedLink ? 'Open Link Again' : 'Open Task Link'}
          </button>
        </div>
        {hasVisitedLink && (
          <button
            onClick={handleConfirm}
            className={`w-full py-3 px-4 rounded-md text-white font-semibold text-lg ${isCompleting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} transition duration-200`}
            disabled={isCompleting}
            type="button"
          >
            {isCompleting ? 'Claiming Points...' : 'Claim Points'}
          </button>
        )}
      </div>
    </div>
  );
};

// Add animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

// Add this helper function before the EarnCredits component
const getPlatformColors = (platform) => {
  switch (platform) {
    case 'YouTube':
      return {
        bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-800 dark:text-red-200',
        badge: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
        hover: 'hover:from-red-100 hover:to-red-200 dark:hover:from-red-800/30 dark:hover:to-red-700/30'
      };
    case 'Instagram':
      return {
        bg: 'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20',
        border: 'border-pink-200 dark:border-pink-800',
        text: 'text-pink-800 dark:text-pink-200',
        badge: 'bg-gradient-to-r from-pink-500 to-pink-600 text-white',
        hover: 'hover:from-pink-100 hover:to-pink-200 dark:hover:from-pink-800/30 dark:hover:to-pink-700/30'
      };
    case 'Facebook':
      return {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-800 dark:text-blue-200',
        badge: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
        hover: 'hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30'
      };
    default:
      return {
        bg: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700',
        border: 'border-gray-200 dark:border-gray-600',
        text: 'text-gray-800 dark:text-gray-200',
        badge: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
        hover: 'hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600'
      };
  }
};

// Simplify the getTaskBadges function to only show points
const getTaskBadges = (task) => {
  return [{
    text: `${task.points} points`,
    className: task.type === 'YouTube' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
              task.type === 'Instagram' ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white' :
              task.type === 'Facebook' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
              'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
  }];
};

const EarnCredits = ({ toggleTheme }) => {
  const [taskForm, setTaskForm] = useState({
    type: '',
    action: '',
    link: '',
    description: '',
    points: 2
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localPoints, setLocalPoints] = useState(0);
  const [showPointsDeducted, setShowPointsDeducted] = useState(false);
  const [pointsDeducted, setPointsDeducted] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for high to low, 'asc' for low to high
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { data: taskData = { tasks: [], points: 0, ownTasks: [] }, isLoading, error, refetch } = useGetAllTasksQuery(undefined, {
    skip: !userInfo,
    refetchOnMountOrArgChange: true
  });
  const [submitTask] = useSubmitTaskMutation();
  const [completeTask, { isLoading: isCompleting }] = useCompleteTaskMutation();

  const theme = useTheme();

  // Handle authentication and navigation
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    // Cleanup function
    return () => {
      setTaskForm({
        type: '',
        action: '',
        link: '',
        description: '',
        points: 2
      });
      setSelectedTask(null);
    };
  }, [userInfo, navigate]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      if (error.status === 401) {
        toast.error('Session expired. Please log in again.');
        navigate('/login');
      } else {
        toast.error(errorMessage);
      }
    }
  }, [error, navigate]);

    // Get available actions based on task type
  const getAvailableActions = (type) => {
    if (!type) return [];

    switch (type) {
      case 'YouTube':
        return ['Like', 'Subscribe'];
      case 'Instagram':
      case 'Facebook':
        return ['Like', 'Follow'];
      default:
        return [];
    }
  };

  // Handle task type change
  const handleTaskTypeChange = (e) => {
    setTaskForm({
      ...taskForm,
      type: e.target.value
    });
  };

  // Handle task action change
  const handleTaskActionChange = (e) => {
    setTaskForm({
      ...taskForm,
      action: e.target.value
    });
  };

  // Handle task link change
  const handleTaskLinkChange = (e) => {
    setTaskForm({
      ...taskForm,
      link: e.target.value
    });
  };

  // Handle task description change
  const handleTaskDescriptionChange = (e) => {
    setTaskForm({
      ...taskForm,
      description: e.target.value
    });
  };

  // Handle points change
  const handlePointsChange = (e) => {
    const value = e.target.value;
    
    // Allow empty value for backspace
    if (value === '') {
      setTaskForm({
        ...taskForm,
        points: ''
      });
      return;
    }

    // Convert to number and validate
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setTaskForm({
        ...taskForm,
        points: Math.max(1, numValue)
      });
    }
  };

  // Validate URL based on platform
  const validateUrl = (type, url) => {
    if (!type || !url) return false;

    const patterns = {
      YouTube: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,
      Instagram: /^https?:\/\/(www\.)?instagram\.com\/.+/,
      Facebook: /^https?:\/\/(www\.)?facebook\.com\/.+/
    };

    return patterns[type]?.test(url) || false;
  };

  // Check if link already exists in tasks
  const isDuplicateLink = (link) => {
    if (!link || !taskData?.tasks) return false;
    
    const normalizedLink = link.toLowerCase().trim()
      .replace(/\/$/, '') // Remove trailing slash
      .replace(/^http:\/\//, 'https://'); // Normalize protocol

    return taskData.tasks.some(task => {
      const taskLink = task.link.toLowerCase().trim()
        .replace(/\/$/, '')
        .replace(/^http:\/\//, 'https://');
      return taskLink === normalizedLink;
    });
  };

  // Effect to handle points synchronization
  useEffect(() => {
    if (!userInfo) return;

    const syncPoints = () => {
      const currentPoints = Number(userInfo.points);
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const storedPoints = Number(storedUser.points);

      // If points are different, use the higher value
      if (!isNaN(currentPoints) && !isNaN(storedPoints) && currentPoints !== storedPoints) {
        const finalPoints = Math.max(currentPoints, storedPoints);
        const updatedInfo = {
          ...userInfo,
          points: finalPoints
        };

        // Update both Redux and localStorage atomically
        dispatch(setCredentials(updatedInfo));
        localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      }
    };

    // Initial sync
    syncPoints();

    // Listen for points updates from other components
    const handlePointsUpdate = (e) => {
      if (e.detail?.timestamp) {
        syncPoints();
      }
    };
    
    window.addEventListener('pointsUpdated', handlePointsUpdate);
    return () => window.removeEventListener('pointsUpdated', handlePointsUpdate);
  }, [userInfo, dispatch]);

  // Listener for points updates from localStorage (assuming this is for real-time updates)
  useEffect(() => {
    if (userInfo?.points !== undefined) {
      setLocalPoints(Number(userInfo.points));
    }
  }, [userInfo?.points]);

  // Handle task submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userInfo) {
      toast.error('Please log in to submit tasks');
      navigate('/login');
      return;
    }

    if (!validateUrl(taskForm.type, taskForm.link)) {
      toast.error('Invalid URL for the selected platform');
      return;
    }

    // Check for duplicate link
    if (isDuplicateLink(taskForm.link)) {
      toast.error('This link has already been added as a task');
      setTaskForm(prev => ({ ...prev, link: '' }));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitTask(taskForm).unwrap();
      if (result.success) {
        toast.success(result.message || 'Task submitted successfully!');
        setTaskForm({
          type: '',
          action: '',
          link: '',
          description: '',
          points: 2
        });
        refetch();
      }
    } catch (err) {
      // Handle specific error cases
      if (err?.data?.message?.includes('already exists')) {
        toast.error('A task with this link already exists');
        setTaskForm(prev => ({ ...prev, link: '' }));
      } else if (err?.status === 401) {
        toast.error('Session expired. Please log in again.');
        navigate('/login');
      } else {
        toast.error(err?.data?.message || 'Failed to submit task. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle task click
  const handleTaskClick = async (task) => {
    if (!userInfo) {
      toast.error("Please login to complete tasks");
      return;
    }

    // Double check that user isn't trying to complete their own task
    if (task.isOwnTask) {
      toast.error("You cannot complete tasks that you created");
      return;
    }

    setSelectedTask(task);
  };

  // Handle task confirmation
  const handleConfirmTask = async () => {
    if (!selectedTask) {
      toast.error("No task selected");
      return;
    }

    try {
      // Multiple validation checks
      if (!userInfo) {
        toast.error("Please login to complete tasks");
        return;
      }

      if (selectedTask.isOwnTask) {
        toast.error("You cannot complete tasks that you created");
        return;
      }

      setIsSubmitting(true);

      // Calculate points for instant update
      const currentBalance = Number(userInfo.points) || 0;
      const pointsToAdd = selectedTask.points || 0; // Use actual task points
      const newBalance = currentBalance + pointsToAdd;

      // Update UI immediately
      const updatedUserInfo = {
        ...userInfo,
        points: newBalance
      };
      dispatch(setCredentials(updatedUserInfo));
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      
      // Update points in UI
      window.dispatchEvent(new CustomEvent('pointsUpdated', {
        detail: { 
          points: newBalance,
          timestamp: Date.now()
        }
      }));

      // Close popup immediately after showing success
      setSelectedTask(null);

      // Make the API call in background
      const result = await completeTask(selectedTask._id).unwrap();
      
      // If server update failed, revert the optimistic update
      if (!result.success) {
        const originalUserInfo = {
          ...userInfo,
          points: currentBalance
        };
        dispatch(setCredentials(originalUserInfo));
        localStorage.setItem('userInfo', JSON.stringify(originalUserInfo));
        
        toast.error('Failed to update points. Please try again.');
        return;
      }

      // Show success message with actual points earned
      toast.success(`Task completed successfully! You earned ${pointsToAdd} points!`);
      
      if (result.pointsDeducted > 0) {
        setPointsDeducted(result.pointsDeducted);
        setCurrentPoints(result.currentPoints);
        setShowPointsDeducted(true);
      }
      
      refetch(); // Refresh tasks list
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || 'Failed to complete task. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle popup close
  const handleClosePopup = () => {
    setSelectedTask(null);
  };

  // Add this memoized sorting function
  const getSortedTasks = React.useMemo(() => {
    if (!taskData?.tasks) return [];
    return [...taskData.tasks].sort((a, b) => 
      sortOrder === 'desc' ? b.points - a.points : a.points - b.points
    );
  }, [taskData?.tasks, sortOrder]);

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-screen ${theme.palette.mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <CircularProgress />
      </div>
    );
  }

  if (error && error.status !== 401) {
    return (
      <div className={`text-center py-8 ${theme.palette.mode === 'dark' ? 'bg-gray-900 text-red-400' : 'bg-gray-50 text-red-500'}`}>
        Error loading tasks.
      </div>
    );
  }

  const availableTasks = taskData?.tasks?.filter(task => !task.isOwnTask) || [];
  const ownTasks = taskData?.ownTasks || [];

  return (
    <div className={`min-h-screen ${theme.palette.mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Points Display */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-2">Your Points Balance</h2>
              <p className="text-white/80 text-sm mb-4">Complete tasks to earn more points!</p>
              <div className="flex items-center justify-center bg-white/10 rounded-lg p-4">
                <CountUp
                  end={userInfo?.points || 0}
                  duration={2}
                  className="text-3xl font-bold text-white"
                />
                <span className="text-white ml-2">Total Points</span>
              </div>
            </div>

            {/* Submit New Task Form */}
            <div className={`mt-6 ${theme.palette.mode === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold ${theme.palette.mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Submit New Task</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.palette.mode === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Platform
                  </label>
                  <select
                    value={taskForm.type}
                    onChange={handleTaskTypeChange}
                    className={`w-full rounded-md ${theme.palette.mode === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                    required
                  >
                    <option value="">Select Platform</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.palette.mode === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Action
                  </label>
                  <select
                    value={taskForm.action}
                    onChange={handleTaskActionChange}
                    className={`w-full rounded-md ${theme.palette.mode === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                    required
                    disabled={!taskForm.type}
                  >
                    <option value="">Select Action</option>
                    {getAvailableActions(taskForm.type).map((action) => (
                      <option key={action} value={action}>
                        {action}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.palette.mode === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Link
                  </label>
                  <input
                    type="url"
                    value={taskForm.link}
                    onChange={handleTaskLinkChange}
                    className={`w-full rounded-md ${theme.palette.mode === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                    placeholder="Enter platform link"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.palette.mode === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Points
                  </label>
                  <input
                    type="number"
                    value={taskForm.points}
                    onChange={handlePointsChange}
                    min="1"
                    className={`w-full rounded-md ${theme.palette.mode === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Task'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Available Tasks */}
          <div className="lg:col-span-2">
            <div className={`${theme.palette.mode === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-semibold ${theme.palette.mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Available Tasks</h3>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className={`rounded-md ${theme.palette.mode === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                >
                  <option value="desc">Highest Points</option>
                  <option value="asc">Lowest Points</option>
                </select>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <CircularProgress />
                </div>
              ) : error ? (
                <Alert severity="error" className="mb-4">
                  {error.data?.message || 'Failed to load tasks'}
                </Alert>
              ) : getSortedTasks.length === 0 ? (
                <p className={`text-center py-8 ${theme.palette.mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No tasks available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getSortedTasks.map((task) => {
                    const colors = getPlatformColors(task.type);
                    return (
                      <div
                        key={task._id}
                        className={`${colors.bg} ${colors.border} ${colors.hover} rounded-lg p-4 border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md`}
                        onClick={() => handleTaskClick(task)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className={`text-sm font-semibold ${colors.text}`}>
                              {task.type} - {task.action}
                            </span>
                            <div className="mt-1">
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colors.badge}`}>
                                {task.points} points
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className={`text-sm ${colors.text} opacity-90`}>
                          {task.description || `${task.action} on ${task.type}`}
                        </p>
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskClick(task);
                            }}
                            className={`px-4 py-1.5 text-xs font-medium rounded-md ${theme.palette.mode === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white/80 hover:bg-white text-gray-800'} shadow-sm transition-all duration-200`}
                          >
                            View Task
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTask && (
        <TaskPopup
          task={selectedTask}
          onClose={handleClosePopup}
          onConfirm={handleConfirmTask}
          isCompleting={isCompleting}
        />
      )}
    </div>
  );
};
export default EarnCredits;
