//Button.tsx
import React from 'react';
import { COLORS } from '@/utils/constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  disabled,
  className = '',
  style,
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 500,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    border: '1px solid transparent',
    borderRadius: '6px',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
  };

  const variantStyles = {
    primary: {
      backgroundColor: COLORS.primary,
      color: 'white',
      borderColor: COLORS.primary,
    },
    secondary: {
      backgroundColor: COLORS.secondary,
      color: COLORS.text,
      borderColor: COLORS.secondary,
    },
    outline: {
      backgroundColor: 'transparent',
      color: COLORS.primary,
      borderColor: COLORS.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: COLORS.text,
      borderColor: 'transparent',
    },
    danger: {
      backgroundColor: COLORS.error,
      color: 'white',
      borderColor: COLORS.error,
    },
  };

  const sizeStyles = {
    small: {
      padding: '6px 12px',
      fontSize: '12px',
    },
    medium: {
      padding: '8px 16px',
      fontSize: '14px',
    },
    large: {
      padding: '12px 24px',
      fontSize: '16px',
    },
  };

  const hoverStyles = {
    primary: {
      backgroundColor: COLORS.primaryDark,
      borderColor: COLORS.primaryDark,
    },
    secondary: {
      backgroundColor: COLORS.secondaryDark,
      borderColor: COLORS.secondaryDark,
    },
    outline: {
      backgroundColor: COLORS.primary,
      color: 'white',
    },
    ghost: {
      backgroundColor: COLORS.backgroundSecondary,
    },
    danger: {
      backgroundColor: '#dc2626',
      borderColor: '#dc2626',
    },
  };

  return (
    <button
      className={`ui-button ${className}`}
      disabled={disabled || loading}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, hoverStyles[variant]);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, variantStyles[variant]);
        }
      }}
      {...props}
    >
      {loading && (
        <span className="button-loading">
          <svg className="spinner" width="16" height="16" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="15" strokeDashoffset="0">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
            </circle>
          </svg>
        </span>
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="button-icon-left">{icon}</span>
      )}
      <span className="button-content">{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="button-icon-right">{icon}</span>
      )}
    </button>
  );
};

export default Button;