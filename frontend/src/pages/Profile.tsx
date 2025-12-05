//Profile.tsx
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import SessionManager from '@/components/Auth/SessionManager';
import { COLORS } from '@/utils/constants';

const Profile: React.FC = () => {
  const { user, sessions, loadSessions, revokeSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSession(sessionId);
      setMessage({ type: 'success', text: 'Session revoked successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to revoke session' });
    }
  };

  const handleRefreshSessions = async () => {
    try {
      setIsLoading(true);
      await loadSessions();
      setMessage({ type: 'success', text: 'Sessions refreshed' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to refresh sessions' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account and active sessions</p>
      </div>

      {message && (
        <div className={`message message-${message.type}`}>
          <span>{message.type === 'success' ? '✓' : '⚠'}</span>
          {message.text}
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      <div className="profile-content">
        <div className="profile-section">
          <div className="profile-header">
            <h2>Account Information</h2>
          </div>
          
          <div className="profile-details">
            <div className="detail-group">
              <div className="detail">
                <label>Name</label>
                <div className="value">{user?.nama}</div>
              </div>
              
              <div className="detail">
                <label>Email</label>
                <div className="value">{user?.email}</div>
              </div>
              
              <div className="detail">
                <label>Role</label>
                <div className="value role-badge">
                  <span className={`role-icon ${user?.role === 'mine_planner' ? 'mine' : 'shipping'}`}>
                    {user?.role === 'mine_planner' ? '⛏️' : '🚢'}
                  </span>
                  {user?.role === 'mine_planner' ? 'Mine Planner' : 'Shipping Planner'}
                </div>
              </div>
              
              {user?.no_telp && (
                <div className="detail">
                  <label>Phone Number</label>
                  <div className="value">{user.no_telp}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h2>Active Sessions</h2>
            <button 
              className="refresh-btn"
              onClick={handleRefreshSessions}
              disabled={isLoading}
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          <SessionManager
            sessions={sessions}
            onRevoke={handleRevokeSession}
          />
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .page-header {
          margin-bottom: 32px;
        }
        
        .page-header h1 {
          margin: 0 0 8px 0;
          color: ${COLORS.text};
          font-size: 28px;
          font-weight: 700;
        }
        
        .page-header p {
          margin: 0;
          color: ${COLORS.textLight};
          font-size: 16px;
        }
        
        .message {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .message-success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: ${COLORS.success};
        }
        
        .message-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: ${COLORS.error};
        }
        
        .message button {
          margin-left: auto;
          background: none;
          border: none;
          color: inherit;
          font-size: 18px;
          cursor: pointer;
        }
        
        .profile-content {
          display: grid;
          gap: 32px;
        }
        
        .profile-section {
          background: ${COLORS.background};
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          padding: 24px;
        }
        
        .profile-header,
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .profile-header h2,
        .section-header h2 {
          margin: 0;
          color: ${COLORS.text};
          font-size: 18px;
          font-weight: 600;
        }
        
        .refresh-btn {
          padding: 6px 12px;
          background: ${COLORS.backgroundSecondary};
          color: ${COLORS.text};
          border: 1px solid ${COLORS.border};
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .refresh-btn:hover:not(:disabled) {
          background: ${COLORS.background};
          border-color: ${COLORS.primary};
          color: ${COLORS.primary};
        }
        
        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .profile-details {
          display: grid;
          gap: 20px;
        }
        
        .detail-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .detail {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .detail label {
          font-size: 12px;
          color: ${COLORS.textLight};
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail .value {
          font-size: 16px;
          color: ${COLORS.text};
          font-weight: 500;
        }
        
        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: rgba(106, 63, 181, 0.1);
          border: 1px solid rgba(106, 63, 181, 0.2);
          border-radius: 20px;
          width: fit-content;
        }
        
        .role-icon {
          font-size: 16px;
        }
        
        .role-icon.mine {
          color: ${COLORS.primary};
        }
        
        .role-icon.shipping {
          color: ${COLORS.secondary};
        }
        
        @media (max-width: 768px) {
          .profile-page {
            padding: 16px;
          }
          
          .profile-section {
            padding: 16px;
          }
          
          .detail-group {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;