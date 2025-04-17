import React from 'react';

// Kích thước spinner
const sizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

// Màu sắc spinner
const colors = {
  primary: 'border-blue-600',
  secondary: 'border-gray-600',
  white: 'border-white',
  success: 'border-green-600',
  danger: 'border-red-600',
  warning: 'border-yellow-600'
};

// Component Spinner cơ bản
export const Spinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}) => {
  return (
    <div className="relative flex justify-center items-center">
      <div
        className={`
          animate-spin rounded-full
          border-2 border-t-transparent
          ${sizes[size]}
          ${colors[color]}
          ${className}
        `}
      />
    </div>
  );
};

// Spinner với overlay toàn màn hình
export const FullPageSpinner = ({ color = 'white' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Spinner size="xl" color={color} />
    </div>
  );
};

// Spinner với container
export const SpinnerContainer = ({ 
  loading, 
  children,
  overlay = true,
  size = 'md',
  color = 'primary'
}) => {
  if (!loading) return children;

  return (
    <div className="relative min-h-[100px]">
      {overlay && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <Spinner size={size} color={color} />
        </div>
      )}
      <div className={overlay ? 'opacity-50' : ''}>
        {children}
      </div>
    </div>
  );
};

// Spinner với text
export const LoadingText = ({ 
  text = 'Đang tải...', 
  size = 'sm',
  color = 'primary'
}) => {
  return (
    <div className="flex items-center gap-2">
      <Spinner size={size} color={color} />
      <span className="text-gray-600">{text}</span>
    </div>
  );
};

// Button với loading state
export const LoadingButton = ({ 
  loading = false,
  disabled = false,
  children,
  spinnerSize = 'sm',
  spinnerColor = 'white',
  className = '',
  ...props 
}) => {
  return (
    <button
      disabled={loading || disabled}
      className={`
        relative inline-flex items-center justify-center
        px-4 py-2 rounded-md
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="absolute left-4">
          <Spinner size={spinnerSize} color={spinnerColor} />
        </span>
      )}
      <span className={loading ? 'opacity-0' : ''}>
        {children}
      </span>
    </button>
  );
};

// Dots loading animation
export const DotsLoader = ({ color = 'primary' }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3].map((dot) => (
        <div
          key={dot}
          className={`
            w-1.5 h-1.5 rounded-full
            animate-bounce
            ${colors[color].replace('border-', 'bg-')}
          `}
          style={{
            animationDelay: `${dot * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

// Progress bar loading
export const LinearProgress = ({ 
  color = 'primary',
  height = 2
}) => {
  return (
    <div 
      className={`w-full overflow-hidden rounded-full`}
      style={{ height: `${height}px` }}
    >
      <div
        className={`
          w-full h-full
          animate-progress-indeterminate
          ${colors[color].replace('border-', 'bg-')}
        `}
      />
    </div>
  );
};