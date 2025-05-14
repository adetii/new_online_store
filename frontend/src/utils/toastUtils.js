import toast from 'react-hot-toast';

export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-center',
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-center',
  });
};

export const showInfoToast = (message) => {
  toast(message, {
    duration: 3000,
    position: 'top-center',
  });
};