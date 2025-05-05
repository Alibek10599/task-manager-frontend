import React, { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnClickOutside?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnClickOutside = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto'; // Enable background scrolling
    };
  }, [isOpen, onClose]);

  // Handle click outside to close modal
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      closeOnClickOutside &&
      modalRef.current &&
      !modalRef.current.contains(e.target as Node)
    ) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
        {/* Background overlay */}
        <div
          className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75'
          onClick={handleOutsideClick}
        ></div>

        {/* Modal panel */}
        <div className='flex items-center justify-center min-h-screen'>
          <div
            ref={modalRef}
            className={`inline-block w-full ${sizeClasses[size]} overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl`}
          >
            {/* Header */}
            {title && (
              <div className='px-6 py-4 border-b dark:border-gray-700'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
                  {title}
                </h3>
              </div>
            )}

            {/* Body */}
            <div className='px-6 py-4'>{children}</div>

            {/* Footer */}
            {footer && (
              <div className='px-6 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700'>
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
