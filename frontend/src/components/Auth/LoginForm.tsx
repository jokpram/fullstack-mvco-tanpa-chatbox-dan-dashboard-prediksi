//LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, ROLES, ICONS } from '../../utils/constants';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'mine_planner' | 'shipping_planner'>(ROLES.MINE_PLANNER);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password, role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              <ICONS.CONTACT.EMAIL size={14} /> Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <ICONS.SECURITY size={14} /> Password
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <ICONS.VISIBILITY.HIDE size={16} /> : <ICONS.VISIBILITY.SHOW size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Role</label>
            <div className="role-buttons">
              <button
                type="button"
                className={`role-btn ${role === ROLES.MINE_PLANNER ? 'active' : ''}`}
                onClick={() => setRole(ROLES.MINE_PLANNER)}
                disabled={isLoading}
              >
                <ICONS.MINE_PLANNER className="role-icon" size={20} />
                <span>Mine Planner</span>
              </button>
              <button
                type="button"
                className={`role-btn ${role === ROLES.SHIPPING_PLANNER ? 'active' : ''}`}
                onClick={() => setRole(ROLES.SHIPPING_PLANNER)}
                disabled={isLoading}
              >
                <ICONS.SHIPPING_PLANNER className="role-icon" size={20} />
                <span>Shipping Planner</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <ICONS.ERROR size={16} />
              {error}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register/mine">Register as Mine Planner</Link>
            {' or '}
            <Link to="/register/shipping">Register as Shipping Planner</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, ${COLORS.backgroundSecondary} 0%, #ffffff 100%);
        }
        
        .login-card {
          width: 100%;
          max-width: 400px;
          background: ${COLORS.background};
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid ${COLORS.border};
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }
        
        .login-header h2 {
          margin: 0 0 8px 0;
          color: ${COLORS.text};
          font-size: 24px;
          font-weight: 700;
        }
        
        .login-header p {
          margin: 0;
          color: ${COLORS.textLight};
          font-size: 14px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: ${COLORS.text};
          font-weight: 500;
          font-size: 14px;
        }
        
        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid ${COLORS.border};
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
          background: ${COLORS.background};
          color: ${COLORS.text};
        }
        
        .form-group input:focus {
          outline: none;
          border-color: ${COLORS.primary};
          box-shadow: 0 0 0 3px rgba(106, 63, 181, 0.1);
        }
        
        .form-group input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .password-input {
          position: relative;
        }
        
        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: ${COLORS.textLight};
          cursor: pointer;
          padding: 4px;
        }
        
        .password-toggle:hover {
          color: ${COLORS.primary};
        }
        
        .password-toggle:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .role-buttons {
          display: flex;
          gap: 12px;
        }
        
        .role-btn {
          flex: 1;
          padding: 16px;
          border: 1px solid ${COLORS.border};
          border-radius: 8px;
          background: ${COLORS.background};
          color: ${COLORS.textLight};
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }
        
        .role-btn:hover:not(:disabled) {
          border-color: ${COLORS.primaryLight};
          color: ${COLORS.primary};
        }
        
        .role-btn.active {
          border-color: ${COLORS.primary};
          background: rgba(106, 63, 181, 0.05);
          color: ${COLORS.primary};
        }
        
        .role-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: ${COLORS.error};
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .submit-btn {
          width: 100%;
          padding: 14px;
          background: ${COLORS.primary};
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .submit-btn:hover:not(:disabled) {
          background: ${COLORS.primaryDark};
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid white;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .login-footer {
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid ${COLORS.border};
        }
        
        .login-footer p {
          margin: 0;
          color: ${COLORS.textLight};
          font-size: 14px;
        }
        
        .login-footer a {
          color: ${COLORS.primary};
          text-decoration: none;
          font-weight: 500;
        }
        
        .login-footer a:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 480px) {
          .login-card {
            padding: 24px;
          }
          
          .role-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;