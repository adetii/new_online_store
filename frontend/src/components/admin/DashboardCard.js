import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const DashboardCard = ({ title, value, icon, change, color }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-full ${color} bg-opacity-20`}>
          {React.cloneElement(icon, { className: `h-5 w-5 ${color.replace('bg-', 'text-')}` })}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {isPositive ? (
                <FaArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <FaArrowDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(change)}% {isPositive ? 'increase' : 'decrease'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;