import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color = 'text-yellow-500' }) => {
  return (
    <div className="flex items-center">
      <span>
        {value >= 1 ? (
          <FaStar className={color} />
        ) : value >= 0.5 ? (
          <FaStarHalfAlt className={color} />
        ) : (
          <FaRegStar className={color} />
        )}
      </span>
      <span>
        {value >= 2 ? (
          <FaStar className={color} />
        ) : value >= 1.5 ? (
          <FaStarHalfAlt className={color} />
        ) : (
          <FaRegStar className={color} />
        )}
      </span>
      <span>
        {value >= 3 ? (
          <FaStar className={color} />
        ) : value >= 2.5 ? (
          <FaStarHalfAlt className={color} />
        ) : (
          <FaRegStar className={color} />
        )}
      </span>
      <span>
        {value >= 4 ? (
          <FaStar className={color} />
        ) : value >= 3.5 ? (
          <FaStarHalfAlt className={color} />
        ) : (
          <FaRegStar className={color} />
        )}
      </span>
      <span>
        {value >= 5 ? (
          <FaStar className={color} />
        ) : value >= 4.5 ? (
          <FaStarHalfAlt className={color} />
        ) : (
          <FaRegStar className={color} />
        )}
      </span>
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
    </div>
  );
};

export default Rating;