import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUser, deleteUserById, User, Role, ROLES } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing } from '../styles';
import { useNavigate } from 'react-router-dom';

const Users: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<Role>('RECEPTIONIST');
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const isOwner = user?.role === 'OWNER';

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getAllUsers(token)
      .then(setUsers)
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, [token]);

  const startEdit = (u: User) => {
    setEditId(u.id);
    setEditEmail(u.email);
    setEditRole(u.role);
    setEditPassword('');
    setError('');
    setSuccess('');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditEmail('');
    setEditRole('RECEPTIONIST');
    setEditPassword('');
  };

  const handleUpdate = async () => {
    if (!token || !isOwner || editId === null) return;
    setError('');
    setSuccess('');
    try {
      const updateData: any = { email: editEmail, role: editRole };
      if (editPassword) updateData.password = editPassword;
      const updated = await updateUser(editId, updateData, token, user.role);
      setUsers(users => users.map(u => u.id === updated.id ? updated : u));
      setSuccess('User updated successfully');
      cancelEdit();
    } catch (e: any) {
      if (e.response && e.response.status === 403) {
        setError('Requires OWNER role to update users.');
      } else {
        setError(e.response?.data?.message || e.message || 'Update failed');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!token || !isOwner) return;
    setError('');
    setSuccess('');
    try {
      await deleteUserById(id, token, user.role);
      setUsers(users => users.filter(u => u.id !== id));
      setSuccess('User deleted successfully');
      setConfirmDeleteId(null);
    } catch (e: any) {
      if (e.response && e.response.status === 403) {
        setError('Requires OWNER role to delete users.');
      } else {
        setError(e.response?.data?.message || e.message || 'Delete failed');
      }
    }
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.backgroundAlt} 0%, ${colors.background} 100%)`,
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      padding: spacing.xl,
    },
    card: {
      width: '100%',
      maxWidth: '900px',
      background: colors.white,
      borderRadius: '1rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
      padding: spacing.xxl,
      marginTop: spacing.xl,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    title: {
      color: colors.primary,
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    backButton: {
      background: colors.white,
      color: colors.primary,
      border: `1px solid ${colors.primary}`,
      borderRadius: '0.5rem',
      padding: `${spacing.sm} ${spacing.lg}`,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as 'collapse',
      marginTop: spacing.lg,
    },
    th: {
      background: colors.backgroundAlt,
      color: colors.primary,
      fontWeight: 600,
      padding: spacing.md,
      borderBottom: `2px solid ${colors.divider}`,
      textAlign: 'left' as 'left',
    },
    td: {
      padding: spacing.md,
      borderBottom: `1px solid ${colors.divider}`,
      fontSize: '1rem',
    },
    badge: (role: Role) => ({
      display: 'inline-block',
      padding: '0.25em 0.75em',
      borderRadius: '1em',
      background: role === 'OWNER' ? colors.primary : role === 'MANAGER' ? colors.secondary : colors.info,
      color: colors.white,
      fontWeight: 600,
      fontSize: '0.85em',
      marginLeft: spacing.sm,
    }),
    actionBtn: {
      marginRight: spacing.sm,
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: 600,
      cursor: 'pointer',
      background: colors.primary,
      color: colors.white,
      transition: 'all 0.2s',
    },
    deleteBtn: {
      background: colors.error,
    },
    saveBtn: {
      background: colors.success,
    },
    cancelBtn: {
      background: colors.warning,
      color: colors.black,
    },
    error: {
      color: colors.error,
      marginBottom: spacing.md,
      textAlign: 'center' as 'center',
    },
    success: {
      color: colors.success,
      marginBottom: spacing.md,
      textAlign: 'center' as 'center',
    },
    spinner: {
      display: 'block',
      margin: '2rem auto',
    },
    confirmDialog: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    confirmBox: {
      background: colors.white,
      borderRadius: '1rem',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      padding: spacing.xxl,
      minWidth: '320px',
      textAlign: 'center' as 'center',
    },
    confirmBtn: {
      marginRight: spacing.md,
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: 600,
      cursor: 'pointer',
      background: colors.error,
      color: colors.white,
      transition: 'all 0.2s',
    },
    cancelConfirmBtn: {
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: 600,
      cursor: 'pointer',
      background: colors.info,
      color: colors.white,
      transition: 'all 0.2s',
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.title}>User Management</span>
          <button style={styles.backButton} onClick={() => navigate('/dashboard')}>
            &larr; Back to Dashboard
          </button>
        </div>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        {loading ? (
          <div style={styles.spinner}><span className="spinner"></span> Loading users...</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Password</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={styles.td}>{u.id}</td>
                  <td style={styles.td}>
                    {editId === u.id ? (
                      <input
                        type="email"
                        value={editEmail}
                        onChange={e => setEditEmail(e.target.value)}
                        style={{...styles.td, border: `1px solid ${colors.divider}`, borderRadius: '0.3em', padding: spacing.xs}}
                      />
                    ) : (
                      u.email
                    )}
                  </td>
                  <td style={styles.td}>
                    {editId === u.id ? (
                      <select
                        value={editRole}
                        onChange={e => setEditRole(e.target.value as Role)}
                        style={{...styles.td, border: `1px solid ${colors.divider}`, borderRadius: '0.3em', padding: spacing.xs}}
                      >
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    ) : (
                      <span style={styles.badge(u.role)}>{u.role}</span>
                    )}
                  </td>
                  {editId === u.id ? (
                    <td style={styles.td}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showEditPassword ? 'text' : 'password'}
                          value={editPassword}
                          onChange={e => setEditPassword(e.target.value)}
                          placeholder="New Password"
                          style={{ width: '100%', border: `1px solid ${colors.divider}`, borderRadius: '0.3em', padding: spacing.xs, paddingRight: 30 }}
                        />
                        <span
                          onClick={() => setShowEditPassword((prev) => !prev)}
                          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: colors.textSecondary }}
                          tabIndex={0}
                          aria-label={showEditPassword ? 'Hide password' : 'Show password'}
                        >
                          {showEditPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 15.11 1 12c.73-1.26 2.1-3.17 4.06-5.06M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .39-.08.76-.22 1.1M6.1 6.1A10.94 10.94 0 0 1 12 5c5 0 9.27 3.89 11 7-1.09 1.88-3.05 4.5-6.1 6.9M1 1l22 22" /></svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
                          )}
                        </span>
                      </div>
                    </td>
                  ) : null}
                  <td style={styles.td}>
                    {isOwner && editId !== u.id && (
                      <>
                        <button style={styles.actionBtn} onClick={() => startEdit(u)}>
                          Edit
                        </button>
                        <button style={{...styles.actionBtn, ...styles.deleteBtn}} onClick={() => setConfirmDeleteId(u.id)}>
                          Delete
                        </button>
                      </>
                    )}
                    {isOwner && editId === u.id && (
                      <>
                        <button style={{...styles.actionBtn, ...styles.saveBtn}} onClick={handleUpdate}>
                          Save
                        </button>
                        <button style={{...styles.actionBtn, ...styles.cancelBtn}} onClick={cancelEdit}>
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {confirmDeleteId !== null && (
        <div style={styles.confirmDialog}>
          <div style={styles.confirmBox}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete user ID {confirmDeleteId}?</p>
            <button style={styles.confirmBtn} onClick={() => handleDelete(confirmDeleteId!)}>Delete</button>
            <button style={styles.cancelConfirmBtn} onClick={() => setConfirmDeleteId(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users; 