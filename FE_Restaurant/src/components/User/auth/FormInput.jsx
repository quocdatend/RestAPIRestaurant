// src/components/User/auth/FormInput.jsx
import React from 'react';

const FormInput = ({ 
  id, 
  name, 
  type = 'text', 
  label, 
  value, 
  onChange, 
  placeholder, 
  error, 
  icon: Icon,
  required = false 
}) => {
  return (
    <div>
      {label && (
        <label 
          htmlFor={id || name} 
          className="block text-sm font-medium text-gray-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={`mt-1 relative rounded-md shadow-sm`}>
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 ${error ? 'text-red-500' : 'text-gray-400'}`} />
          </div>
        )}
        
        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border 
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'} 
            rounded-md shadow-sm focus:outline-none sm:text-sm
          `}
          required={required}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormInput;