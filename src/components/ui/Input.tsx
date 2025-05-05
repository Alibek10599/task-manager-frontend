import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={props.id}
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`appearance-none rounded-md border ${
            error
              ? 'border-red-500 dark:border-red-400'
              : 'border-gray-300 dark:border-gray-600'
          } px-3 py-2 text-gray-800 dark:text-gray-200 leading-tight placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            error
              ? 'focus:ring-red-500 dark:focus:ring-red-400'
              : 'focus:ring-primary dark:focus:ring-primary-light'
          } ${fullWidth ? 'w-full' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className='mt-1 text-sm text-red-500 dark:text-red-400'>{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
