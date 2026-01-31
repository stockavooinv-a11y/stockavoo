const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';

  const variants = {
    primary: 'bg-gradient-to-r from-[#4A1D66] to-[#7C3E8C] text-white hover:opacity-90 focus:ring-[#7C3E8C]',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400',
    outline: 'border-2 border-[#7C3E8C] text-[#7C3E8C] hover:bg-[#7C3E8C] hover:text-white focus:ring-[#7C3E8C]',
    ghost: 'text-[#7C3E8C] hover:bg-[#7C3E8C]/10 focus:ring-[#7C3E8C]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
