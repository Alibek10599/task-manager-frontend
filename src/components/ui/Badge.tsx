import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  // Base classes
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-full';

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-light text-primary-dark',
    secondary: 'bg-secondary-light text-secondary-dark',
    success:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    warning:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };

  // Combine all classes
  const badgeClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return <span className={badgeClasses}>{children}</span>;
};

export default Badge;
