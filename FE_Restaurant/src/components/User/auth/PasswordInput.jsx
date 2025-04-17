// src/components/User/auth/PasswordInput.jsx
import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import FormInput from './FormInput';

const PasswordInput = ({ 
  id, 
  name = "password", 
  label = "Mật khẩu", 
  value, 
  onChange, 
  placeholder = "Nhập mật khẩu", 
  error,
  required = true 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="relative">
      <FormInput
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
        icon={FaLock}
        required={required}
      />
      
      <button
        type="button"
        className="absolute inset-y-0 right-0 mt-6 pr-3 flex items-center focus:outline-none"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <FaEyeSlash className="h-5 w-5 text-gray-400" />
        ) : (
          <FaEye className="h-5 w-5 text-gray-400" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;