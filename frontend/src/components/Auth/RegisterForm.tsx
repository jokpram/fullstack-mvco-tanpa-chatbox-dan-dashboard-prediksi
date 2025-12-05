//RegisterForm.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RegisterCredentials } from '../../types';
import { COLORS, ICONS } from '../../utils/constants';

interface RegisterFormProps {
  type: 'mine' | 'shipping';
  onSubmit: (data: RegisterCredentials) => Promise<void>;
  isLoading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ type, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<RegisterCredentials>({
    nama: '',
    email: '',
    password: '',
    no_telp: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const roleName = type === 'mine' ? 'Mine Planner' : 'Shipping Planner';
  const RoleIcon = type === 'mine' ? ICONS.MINE_PLANNER : ICONS.SHIPPING_PLANNER;

  return (
    <div className="register-form">
      <div className="form-header">
        <RoleIcon size={32} />
        <h2>Register as {roleName}</h2>
        <p>Create your account to get started</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nama">
              <ICONS.USER size={14} /> Full Name *
            </label>
            <input
              id="nama"
              name="nama"
              type="text"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <ICONS.CONTACT.EMAIL size={14} /> Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="no_telp">
              <ICONS.CONTACT.PHONE size={14} /> Phone Number
            </label>
            <input
              id="no_telp"
              name="no_telp"
              type="tel"
              value={formData.no_telp}
              onChange={handleChange}
              placeholder="Enter your phone number"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <ICONS.SECURITY size={14} /> Password *
            </label>
            <div className="password-input">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
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
            <label htmlFor="confirmPassword">
              <ICONS.SECURITY size={14} /> Confirm Password *
            </label>
            <div className="password-input">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                disabled={isLoading}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? <ICONS.VISIBILITY.HIDE size={16} /> : <ICONS.VISIBILITY.SHOW size={16} />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="form-error">
            <ICONS.ERROR size={16} />
            {error}
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Creating Account...
            </>
          ) : (
            `Register as ${roleName}`
          )}
        </button>
      </form>

      <div className="form-footer">
        <p>
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </div>

      <style jsx>{`
        .register-form {
          max-width: 600px;
          margin: 0 auto;
          background: ${COLORS.background};
          border-radius: 12px;
          padding: 32px;
          border: 1px solid ${COLORS.border};
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .form-header {
          text-align: center;
          margin-bottom: 32px;
        }
        
        .form-header svg {
          margin-bottom: 16px;
          color: ${COLORS.primary};
        }
        
        .form-header h2 {
          margin: 0 0 8px 0;
          color: ${COLORS.text};
          font-size: 24px;
          font-weight: 700;
        }
        
        .form-header p {
          margin: 0;
          color: ${COLORS.textLight};
          font-size: 14px;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }
        
        .form-group {
          margin-bottom: 16px;
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
          padding: 10px 12px;
          border: 1px solid ${COLORS.border};
          border-radius: 6px;
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
        
        .form-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: ${COLORS.error};
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .submit-btn {
          width: 100%;
          padding: 12px;
          background: ${COLORS.primary};
          color: white;
          border: none;
          border-radius: 6px;
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
        
        .form-footer {
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid ${COLORS.border};
        }
        
        .form-footer p {
          margin: 0;
          color: ${COLORS.textLight};
          font-size: 14px;
        }
        
        .form-footer a {
          color: ${COLORS.primary};
          text-decoration: none;
          font-weight: 500;
        }
        
        .form-footer a:hover {
          text-decoration: underline;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 640px) {
          .register-form {
            padding: 24px 16px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterForm;