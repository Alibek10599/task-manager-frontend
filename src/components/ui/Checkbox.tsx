import React, { InputHTMLAttributes, forwardRef } from 'react';

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string | React.ReactNode;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className='mb-4'>
        <div className='flex items-center'>
          <input
            ref={ref}
            type='checkbox'
            className={`w-4 h-4 text-primary bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary dark:focus:ring-primary-light ${
              error
                ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400'
                : ''
            } ${className}`}
            {...props}
          />
          {label && (
            <label
              htmlFor={props.id}
              className='ml-2 block text-sm text-gray-700 dark:text-gray-300'
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className='mt-1 text-sm text-red-500 dark:text-red-400'>{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
