import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color = '#f8e825' }) => {
  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((index) => (
        <span key={index}>
          {value >= index ? (
            <FaStar style={{ color }} />
          ) : value >= index - 0.5 ? (
            <FaStarHalfAlt style={{ color }} />
          ) : (
            <FaRegStar style={{ color }} />
          )}
        </span>
      ))}
      <span className="ml-2">{text && text}</span>
    </div>
  );
};

export default Rating;