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
      <div className="bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-md relative shadow-2xl text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition duration-200"
          type="button"
          aria-label="Close task popup"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-2xl font-bold mb-4 text-center pr-8 border-b pb-3 border-gray-300 dark:border-gray-700">
          {task?.type} - {task?.action}
        </h3>
        <div className="my-6">
          <p className="mb-4 text-center text-lg text-gray-700 dark:text-gray-300">
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error && error.status !== 401) {
    return <div className="text-center py-8 text-red-500 dark:text-red-400">Error loading tasks.</div>;
  }

  const availableTasks = taskData?.tasks?.filter(task => !task.isOwnTask) || [];
  const ownTasks = taskData?.ownTasks || [];

  // Sort tasks by points
  const sortedTasks = [...availableTasks].sort((a, b) => {
    if (sortOrder === 'desc') {
      return b.points - a.points;
    }
    return a.points - b.points;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 font-poppins text-gray-800 dark:text-gray-200 transition-colors duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto">
        {/* Dark mode toggle */}
        <div className="flex justify-end mb-10">
          <IconButton 
            onClick={toggleTheme} 
            color="inherit" 
            aria-label="toggle dark mode"
            className="text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </div>

        {/* Points Balance Section with fade-in */}
        <motion.section 
          className="mb-12 relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl border border-blue-400 dark:border-blue-700"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Neon Border Effect */}
          {/* <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: '0 0 15px #00ffff, 0 0 20px #00ffff, 0 0 25px #00ffff, 0 0 30px #00ffff' }}></div> */}
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Your Points Balance</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Complete tasks to earn more points!</p>
            </div>
            <div className="text-right">
              <div className="text-6xl font-extrabold tracking-tight text-blue-700 dark:text-blue-400">
                {/* Count-up animation */}
                <CountUp 
                  start={0} 
                  end={localPoints}
                  duration={2.5} 
                  separator=","
                  // Optional: useEasing={true} // Add easing for smoother animation
                />
              </div>
              <div className="text-base text-gray-600 dark:text-gray-400 mt-1">Total Points</div>
            </div>
          </div>
        </motion.section>

        {/* Submit New Task Section with fade-in */}
        <motion.section 
          className="mb-12 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl transition duration-300 ease-in-out transform hover:scale-[1.01] border border-gray-300 dark:border-gray-700"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }} // Add delay for staggered effect
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">Submit New Task</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platform</label>
                <div className="relative">
                  <select
                    id="platform"
                    value={taskForm.type}
                    onChange={handleTaskTypeChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 sm:text-sm p-2.5 transition duration-200 ease-in-out focus:scale-[1.01] focus:ring-2 focus:ring-opacity-50"
                    required
                  >
                    <option value="">Select Platform</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="action" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Action</label>
                 <div className="relative">
                  <select
                    id="action"
                    value={taskForm.action}
                    onChange={handleTaskActionChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 sm:text-sm p-2.5 transition duration-200 ease-in-out focus:scale-[1.01] focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={!taskForm.type}
                  >
                    <option value="">Select Action</option>
                    {getAvailableActions(taskForm.type).map(action => (
                      <option key={action} value={action}>{action}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link</label>
                <div className="relative">
                  <input
                    id="link"
                    type="url"
                    value={taskForm.link}
                    onChange={handleTaskLinkChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 sm:text-sm pl-3 pr-10 py-2.5 transition duration-200 ease-in-out focus:scale-[1.01] focus:ring-2 focus:ring-opacity-50"
                    placeholder={`Enter ${taskForm.type || 'platform'} link`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="points" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Points</label>
                <div className="relative">
                  <input
                    id="points"
                    type="number"
                    min="1"
                    value={taskForm.points}
                    onChange={handlePointsChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 sm:text-sm pl-3 pr-10 py-2.5 transition duration-200 ease-in-out focus:scale-[1.01] focus:ring-2 focus:ring-opacity-50"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <TextField
                id="description"
                multiline
                rows={4}
                value={taskForm.description}
                onChange={handleTaskDescriptionChange}
                fullWidth
                required
                placeholder="Describe your task"
                className="mt-1"
                InputProps={{
                   style: {
                    color: theme.palette.mode === 'dark' ? '#E5E7EB' : '#1F2937',
                   }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(156, 163, 175, 0.5)' : 'rgba(209, 213, 219, 1)',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(156, 163, 175, 0.8)' : 'rgba(107, 114, 128, 1)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#60A5FA' : '#3B82F6',
                    },
                  },
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105 focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Task'}
            </button>
          </form>
        </motion.section>

        {/* Available Tasks Section */}
        <motion.section 
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-300 dark:border-gray-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Available Tasks</h2>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by Points:</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 text-sm"
              >
                <option value="desc">High to Low</option>
                <option value="asc">Low to High</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          ) : sortedTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {sortedTasks.map((task) => (
                <div
                  key={task._id}
                  className={`p-6 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl cursor-pointer ${
                    task.action === 'Like' ? 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100' : 
                    task.action === 'Subscribe' ? 'bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100' : 
                    task.action === 'Follow' ? 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100' : 
                    'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{task.type} - {task.action}</h3>
                      <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">Complete this task to earn points.</p>
                    </div>
                    <div className="relative">
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        +{task.points}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleTaskClick(task); }}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-800 text-base"
                  >
                    View Task
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No tasks available</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Be the first to submit a task or check back later!</p>
            </div>
          )}
        </motion.section>

        {/* Task Completion Popup */}
        {selectedTask && (
          <TaskPopup
            task={selectedTask}
            onClose={handleClosePopup}
            onConfirm={handleConfirmTask}
            isCompleting={isCompleting}
          />
        )}

        {/* Points Deducted Dialog */}
        <Dialog 
          open={showPointsDeducted} 
          onClose={handleClosePopup}
          PaperProps={{
            className: 'dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-xl'
          }}
        >
          <DialogTitle className="dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3">Points Deducted</DialogTitle>
          <DialogContent className="py-4">
            <p className="text-lg dark:text-gray-300 mb-2">
              You have been deducted {pointsDeducted} points for completing your own task.
            </p>
            <p className="mt-2 text-base dark:text-gray-300">
              Your current points balance: {currentPoints}
            </p>
          </DialogContent>
          <DialogActions className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <Button onClick={handleClosePopup} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};
export default EarnCredits;
