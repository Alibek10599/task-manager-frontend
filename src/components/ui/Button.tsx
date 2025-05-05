import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'outline'
    | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium focus:outline-none transition-colors';

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-sm',
    secondary: 'bg-secondary hover:bg-secondary-dark text-white shadow-sm',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-sm',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-gray-900 shadow-sm',
    info: 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm',
    outline:
      'border border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
    text: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
  };

  // Full width class
  const widthClass = fullWidth ? 'w-full' : '';

  // Disabled and loading state
  const disabledClass =
    disabled || loading ? 'opacity-60 cursor-not-allowed' : '';

  // Combine all classes
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`;

  return (
    <button className={buttonClasses} disabled={disabled || loading} {...props}>
      {loading && (
        <svg
          className='animate-spin -ml-1 mr-2 h-4 w-4 text-current'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          ></circle>
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          ></path>
        </svg>
      )}

      {leftIcon && !loading && <span className='mr-2'>{leftIcon}</span>}
      {children}
      {rightIcon && <span className='ml-2'>{rightIcon}</span>}
    </button>
  );
};

export default Button;
