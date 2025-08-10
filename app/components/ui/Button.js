import Link from 'next/link';

const Button = ({ 
  children, 
  href, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick,
  type = 'button',
  disabled = false,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  ...props 
}) => {
  const baseClasses = 'btn d-inline-flex align-items-center justify-content-center gap-2';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    dark: 'btn-dark',
    outline: 'btn-outline-primary',
    outlineDark: 'btn-outline-dark',
    light: 'btn-light'
  };
  
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };
  
  const widthClass = fullWidth ? 'w-100' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`.trim();
  
  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <iconify-icon icon={icon} className="fs-6"></iconify-icon>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <iconify-icon icon={icon} className="fs-6"></iconify-icon>
      )}
    </>
  );
  
  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  
  return (
    <button 
      type={type} 
      className={classes} 
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
