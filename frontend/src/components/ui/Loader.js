import React from 'react';

const Loader = ({ small, white }) => {
  const size = small ? 'w-5 h-5' : 'w-12 h-12';
  const color = white ? 'border-white' : 'border-primary';
  
  return (
    <div className="flex justify-center items-center">
      <div className={`${size} border-4 ${color} border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
};

export default Loader;