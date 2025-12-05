//SessionManager.tsx
import React, { useState } from 'react';
import { Session } from '../../types';
import { formatDate } from '../../utils/helpers';
import { COLORS, ICONS } from '../../utils/constants';

interface SessionManagerProps {
  sessions: Session[];
  onRevoke: (sessionId: string) => Promise<void>;
}

const SessionManager: React.FC<SessionManagerProps> = ({ sessions, onRevoke }) => {
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const handleRevoke = async (sessionId: string) => {
    try {
      setRevokingId(sessionId);
      await onRevoke(sessionId);
    } finally {
      setRevokingId(null);
    }
  };

  const getBrowserInfo = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return { name: 'Chrome', icon: ICONS.ACTIONS.GLOBE };
    if (userAgent.includes('Firefox')) return { name: 'Firefox', icon: ICONS.ACTIONS.GLOBE };
    if (userAgent.includes('Safari')) return { name: 'Safari', icon: ICONS.ACTIONS.GLOBE };
    if (userAgent.includes('Edge')) return { name: 'Edge', icon: ICONS.ACTIONS.GLOBE };
    return { name: 'Browser', icon: ICONS.ACTIONS.GLOBE };
  };

  return (
    <div className="session-manager">
      <h3>Active Sessions</h3>
      <p className="description">Manage your logged-in sessions across different devices.</p>
      
      {sessions.length === 0 ? (
        <div className="empty">
          <ICONS.INFO size={24} />
          No active sessions
        </div>
      ) : (
        <div className="sessions-list">
          {sessions.map(session => {
            const browser = getBrowserInfo(session.userAgent);
            const isCurrent = session.lastUsedAt && 
              Date.now() - new Date(session.lastUsedAt).getTime() < 5 * 60 * 1000;
            
            return (
              <div key={session.id} className={`session-card ${isCurrent ? 'current' : ''}`}>
                <div className="session-header">
                  <div className="browser-info">
                    <browser.icon className="browser-icon" size={24} />
                    <div>
                      <div className="browser-name">{browser.name}</div>
                      <div className="session-ip">
                        <ICONS.ACTIONS.NETWORK size={12} /> {session.ip}
                      </div>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="current-badge">
                      <ICONS.ACTIONS.SHIELD size={12} /> Current Session
                    </span>
                  )}
                </div>
                
                <div className="session-details">
                  <div className="detail">
                    <span className="label">
                      <ICONS.ACTIONS.TIME size={12} /> Last Active:
                    </span>
                    <span className="value">
                      {session.lastUsedAt 
                        ? formatDate(session.lastUsedAt, 'PPpp')
                        : 'Never'
                      }
                    </span>
                  </div>
                  <div className="detail">
                    <span className="label">
                      <ICONS.SCHEDULE size={12} /> Created:
                    </span>
                    <span className="value">{formatDate(session.createdAt, 'PP')}</span>
                  </div>
                  <div className="detail">
                    <span className="label">
                      <ICONS.ERROR size={12} /> Expires:
                    </span>
                    <span className="value">{formatDate(session.expiresAt, 'PP')}</span>
                  </div>
                </div>
                
                <div className="session-actions">
                  {session.revoked ? (
                    <span className="revoked-badge">
                      <ICONS.CLOSE size={12} /> Revoked
                    </span>
                  ) : !isCurrent && (
                    <button
                      className="revoke-btn"
                      onClick={() => handleRevoke(session.id)}
                      disabled={revokingId === session.id}
                    >
                      {revokingId === session.id ? (
                        <>
                          <span className="spinner"></span>
                          Revoking...
                        </>
                      ) : (
                        <>
                          <ICONS.ACTIONS.DELETE size={12} /> Revoke
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .session-manager {
          background: ${COLORS.background};
          border-radius: 12px;
          padding: 24px;
          border: 1px solid ${COLORS.border};
        }
        
        h3 {
          margin: 0 0 8px 0;
          color: ${COLORS.text};
          font-size: 18px;
          font-weight: 600;
        }
        
        .description {
          margin: 0 0 24px 0;
          color: ${COLORS.textLight};
          font-size: 14px;
        }
        
        .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
          padding: 40px;
          color: ${COLORS.textLight};
          border: 1px dashed ${COLORS.border};
          border-radius: 8px;
        }
        
        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .session-card {
          border: 1px solid ${COLORS.border};
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s;
        }
        
        .session-card.current {
          border-color: ${COLORS.primary};
          background: rgba(106, 63, 181, 0.02);
        }
        
        .session-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        
        .browser-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .browser-icon {
          color: ${COLORS.primary};
        }
        
        .browser-name {
          font-weight: 600;
          color: ${COLORS.text};
          margin-bottom: 4px;
        }
        
        .session-ip {
          display: flex;
          align-items: center;
          gap: 6px;
          color: ${COLORS.textLight};
          font-size: 12px;
          font-family: monospace;
        }
        
        .current-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          background: ${COLORS.primary};
          color: white;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .session-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .detail {
          display: flex;
          flex-direction: column;
        }
        
        .label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: ${COLORS.textLight};
          margin-bottom: 4px;
        }
        
        .value {
          font-size: 14px;
          color: ${COLORS.text};
          font-weight: 500;
        }
        
        .session-actions {
          display: flex;
          justify-content: flex-end;
        }
        
        .revoked-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: ${COLORS.error}20;
          color: ${COLORS.error};
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .revoke-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: transparent;
          color: ${COLORS.error};
          border: 1px solid ${COLORS.error};
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .revoke-btn:hover:not(:disabled) {
          background: ${COLORS.error};
          color: white;
        }
        
        .revoke-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .spinner {
          width: 12px;
          height: 12px;
          border: 2px solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SessionManager;