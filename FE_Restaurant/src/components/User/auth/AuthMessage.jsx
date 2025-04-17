// src/components/auth/AuthMessage.jsx
import React from 'react';

const AuthMessage = ({ message, type = 'error' }) => {
  if (!message) return null;
  
  return (
    <div className={`mb-4 p-3 rounded-lg ${
      type === 'success'  
        ? 'bg-green-100 text-green-700 border border-green-200' 
        : 'bg-red-100 text-red-700 border border-red-200'
    }`}>
      {message}
    </div>
  );
};

export default AuthMessage;