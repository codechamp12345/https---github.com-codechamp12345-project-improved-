import React, { useState } from 'react';

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
            {isCompleting ? 'Claiming Points...' : `Claim ${task?.points} Points`}
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskPopup; 