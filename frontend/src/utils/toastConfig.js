import toast from 'react-hot-toast';

export const toastConfig = {
  position: 'top-center',
  duration: 3000,
  style: {
    padding: '16px',
    color: '#000000',
    borderRadius: '8px',
  },
  success: {
    style: {
      background: '#4CAF50',
    },
  },
  error: {
    style: {
      background: '#f44336',
    },
  },
};

export const showSuccessToast = (message) => {
  toast.success(message, toastConfig);
};

export const showErrorToast = (message) => {
  toast.error(message, toastConfig);
};