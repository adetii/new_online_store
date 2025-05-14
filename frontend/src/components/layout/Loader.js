import React from 'react';

const Loader = ({ small }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-t-4 border-primary border-solid ${
          small ? 'h-5 w-5' : 'h-12 w-12'
        }`}
      ></div>
    </div>
  );
};

export default Loader;