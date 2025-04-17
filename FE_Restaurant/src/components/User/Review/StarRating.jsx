import React from 'react';

const StarRating = ({ rating, onRatingChange, readOnly = false, size = 'default' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-6 h-6',
    large: 'w-8 h-8'
  };
  
  const starClass = sizeClasses[size] || sizeClasses.default;
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={readOnly ? "span" : "button"}
          onClick={() => !readOnly && onRatingChange(star)}
          disabled={readOnly}
          className={`focus:outline-none ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
          aria-label={`${star} sao`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`${starClass} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${!readOnly && 'hover:text-yellow-400'}`}
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" 
            />
          </svg>
        </button>
      ))}
      {!readOnly && <span className="ml-2 text-sm text-gray-600">{rating > 0 ? `${rating}/5` : ''}</span>}
    </div>
  );
};

export default StarRating; 