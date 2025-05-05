import React, { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      fullWidth = true,
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      sm: 'py-1.5 text-xs',
      md: 'py-2 text-sm',
      lg: 'py-3 text-base',
    };

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
        <div className='relative'>
          <select
            ref={ref}
            className={`appearance-none rounded-md border ${
              error
                ? 'border-red-500 dark:border-red-400'
                : 'border-gray-300 dark:border-gray-600'
            } pl-3 pr-10 ${
              sizeClasses[size]
            } text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 
            focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              error
                ? 'focus:ring-red-500 dark:focus:ring-red-400'
                : 'focus:ring-primary dark:focus:ring-primary-light'
            } ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300'>
            <svg
              className='h-5 w-5'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
              aria-hidden='true'
            >
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        </div>
        {error && (
          <p className='mt-1 text-sm text-red-500 dark:text-red-400'>{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
