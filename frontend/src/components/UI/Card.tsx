//Card.tsx
import React from 'react';
import { COLORS } from '@/utils/constants';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  hoverable = false,
  className = '',
  style,
  ...props
}) => {
  const paddingStyles = {
    none: { padding: 0 },
    small: { padding: '12px' },
    medium: { padding: '16px' },
    large: { padding: '24px' },
  };

  const variantStyles = {
    default: {
      backgroundColor: COLORS.background,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '8px',
    },
    elevated: {
      backgroundColor: COLORS.background,
      border: 'none',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    outlined: {
      backgroundColor: 'transparent',
      border: `1px solid ${COLORS.border}`,
      borderRadius: '8px',
    },
  };

  const hoverStyles = hoverable ? {
    transition: 'all 0.2s',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      transform: 'translateY(-1px)',
    },
  } : {};

  return (
    <div
      className={`ui-card ${className}`}
      style={{
        ...variantStyles[variant],
        ...paddingStyles[padding],
        ...hoverStyles,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`card-header ${className}`} {...props}>
      <div className="card-header-content">
        {title && <h3 className="card-title">{title}</h3>}
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="card-header-action">{action}</div>}
    </div>
  );
};

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  noPadding = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`card-content ${className}`}
      style={noPadding ? { padding: 0 } : {}}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right';
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  align = 'left',
  className = '',
  ...props
}) => {
  const alignStyles = {
    left: { justifyContent: 'flex-start' },
    center: { justifyContent: 'center' },
    right: { justifyContent: 'flex-end' },
  };

  return (
    <div
      className={`card-footer ${className}`}
      style={{ display: 'flex', ...alignStyles[align] }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
export { CardHeader, CardContent, CardFooter };