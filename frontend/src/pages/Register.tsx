//Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '@/components/Auth/RegisterForm';
import { useAuth } from '@/hooks/useAuth';
import { RegisterCredentials } from '@/types';
import { COLORS } from '@/utils/constants';

interface RegisterProps {
  type: 'mine' | 'shipping';
}

const Register: React.FC<RegisterProps> = ({ type }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (data: RegisterCredentials) => {
    try {
      setIsLoading(true);
      await register(data, type);
      
      setSuccessMessage(`Registration successful! Redirecting to login...`);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Join {type === 'mine' ? 'Mine Planner' : 'Shipping Planner'}</h1>
          <p>Create your account to start managing {type === 'mine' ? 'mining orders' : 'shipping schedules'}</p>
        </div>

        {successMessage ? (
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h3>Registration Successful!</h3>
            <p>{successMessage}</p>
            <button onClick={() => navigate('/login')} className="login-btn">
              Go to Login
            </button>
          </div>
        ) : (
          <RegisterForm
            type={type}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}

        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <a href="/login" className="login-link">Sign in here</a>
          </p>
          <p className="help-text">
            Need help? Contact support at support@miningshipping.com
          </p>
        </div>
      </div>

      <style jsx>{`
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, ${COLORS.backgroundSecondary} 0%, #ffffff 100%);
        }
        
        .register-container {
          width: 100%;
          max-width: 640px;
        }
        
        .register-header {
          text-align: center;
          margin-bottom: 32px;
        }
        
        .register-header h1 {
          margin: 0 0 12px 0;
          color: ${COLORS.text};
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .register-header p {
          margin: 0;
          color: ${COLORS.textLight};
          font-size: 16px;
          line-height: 1.5;
        }
        
        .success-message {
          background: ${COLORS.background};
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          padding: 48px 32px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .success-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }
        
        .success-message h3 {
          margin: 0 0 12px 0;
          color: ${COLORS.success};
          font-size: 24px;
          font-weight: 700;
        }
        
        .success-message p {
          margin: 0 0 24px 0;
          color: ${COLORS.textLight};
          font-size: 16px;
          line-height: 1.5;
        }
        
        .login-btn {
          padding: 12px 32px;
          background: ${COLORS.primary};
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .login-btn:hover {
          background: ${COLORS.primaryDark};
        }
        
        .register-footer {
          text-align: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid ${COLORS.border};
        }
        
        .register-footer p {
          margin: 8px 0;
          color: ${COLORS.textLight};
          font-size: 14px;
        }
        
        .login-link {
          color: ${COLORS.primary};
          text-decoration: none;
          font-weight: 500;
        }
        
        .login-link:hover {
          text-decoration: underline;
        }
        
        .help-text {
          font-size: 13px;
          color: ${COLORS.textLight} !important;
        }
        
        @media (max-width: 640px) {
          .register-header h1 {
            font-size: 24px;
          }
          
          .register-header p {
            font-size: 14px;
          }
          
          .success-message {
            padding: 32px 20px;
          }
          
          .success-message h3 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;