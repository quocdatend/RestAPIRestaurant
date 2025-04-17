import React from 'react';

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const colorClasses = {
  primary: 'border-blue-600',
  white: 'border-white',
  gray: 'border-gray-600'
};

const Spinner = {
  Base: ({ size = 'md', color = 'primary', className = '' }) => {
    return (
      <div className="relative flex justify-center items-center">
        <div
          className={`
            animate-spin rounded-full
            border-2 border-t-transparent
            ${sizeClasses[size] || sizeClasses.md}
            ${colorClasses[color] || colorClasses.primary}
            ${className}
          `}
        />
      </div>
    );
  },

  FullPage: () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Spinner.Base size="xl" color="white" />
      </div>
    );
  },

  Container: ({ loading, children }) => {
    if (!loading) return children;

    return (
      <div className="relative min-h-[100px]">
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <Spinner.Base />
        </div>
        <div className="opacity-50">{children}</div>
      </div>
    );
  },

  Text: ({ text = 'Đang tải...' }) => {
    return (
      <div className="flex items-center gap-2">
        <Spinner.Base size="sm" />
        <span className="text-gray-600">{text}</span>
      </div>
    );
  },

  Button: ({ 
    loading, 
    children, 
    disabled, 
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
            <Spinner.Base size="sm" color="white" />
          </span>
        )}
        <span className={loading ? 'opacity-0' : ''}>
          {children}
        </span>
      </button>
    );
  }
};

export default Spinner;