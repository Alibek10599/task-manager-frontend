import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  footer?: ReactNode;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = '',
  footer,
  noPadding = false,
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      {(title || subtitle) && (
        <div
          className={`px-6 py-4 border-b dark:border-gray-700 ${headerClassName}`}
        >
          {title && (
            <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className={`${noPadding ? '' : 'p-6'} ${bodyClassName}`}>
        {children}
      </div>

      {footer && (
        <div
          className={`px-6 py-4 border-t dark:border-gray-700 ${footerClassName}`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
