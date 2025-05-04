import React, { useEffect, useState } from 'react';
import { getItems, getStaff, addItem, addStaff, InventoryItem, Staff, updateItem, deleteItem, updateStaff, deleteStaff } from '../services/inventoryService';
import { useAuth } from '../contexts/AuthContext';

import { useNavigate } from 'react-router-dom';
import { colors, spacing } from '../styles';

const Inventory: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add Item modal
  const [showAddItem, setShowAddItem] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [itemCat, setItemCat] = useState('');
  const [itemLoading, setItemLoading] = useState(false);

  // Add Staff modal
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('HOUSEKEEPER');
  const [staffOnDuty, setStaffOnDuty] = useState(true);
  const [staffLoading, setStaffLoading] = useState(false);

  // Edit and delete states
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [confirmDeleteItemId, setConfirmDeleteItemId] = useState<number | null>(null);
  const [editStaffId, setEditStaffId] = useState<number | null>(null);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [confirmDeleteStaffId, setConfirmDeleteStaffId] = useState<number | null>(null);

  const userRole = user?.role;

  useEffect(() => {
    setLoading(true);
    Promise.all([getItems(), getStaff()])
      .then(([items, staff]) => {
        setItems(items);
        setStaff(staff);
        setError('');
      })
      .catch(() => setError('Failed to load inventory or staff'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setItemLoading(true);
    setSuccess('');
    setError('');
    try {
      if (!token || !userRole) throw new Error('Not authorized');
      const newItem = await addItem({ name: itemName, quantity: itemQty, category: itemCat }, token, userRole);
      setItems([...items, newItem]);
      setSuccess('Item added successfully!');
      setItemName(''); setItemQty(1); setItemCat('');
      setShowAddItem(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add item');
    } finally {
      setItemLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffLoading(true);
    setSuccess('');
    setError('');
    try {
      if (!token || !userRole) throw new Error('Not authorized');
      const newStaff = await addStaff({ name: staffName, role: staffRole, onDuty: staffOnDuty }, token, userRole);
      setStaff([...staff, newStaff]);
      setSuccess('Staff added successfully!');
      setStaffName(''); setStaffRole('HOUSEKEEPER'); setStaffOnDuty(true);
      setShowAddStaff(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add staff');
    } finally {
      setStaffLoading(false);
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditItemId(item.id!);
    setEditItem({ ...item });
  };

  const handleUpdateItem = async () => {
    if (editItemId == null || !editItem || !token || !userRole) return;
    try {
      const updated = await updateItem(editItemId, editItem, token, userRole);
      setItems(items.map(i => i.id === updated.id ? updated : i));
      setEditItemId(null);
      setEditItem(null);
      setSuccess('Item updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update item');
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!token || !userRole) return;
    try {
      await deleteItem(id, token, userRole);
      setItems(items.filter(i => i.id !== id));
      setConfirmDeleteItemId(null);
      setSuccess('Item deleted successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleEditStaff = (staff: Staff) => {
    setEditStaffId(staff.id!);
    setEditStaff({ ...staff });
  };

  const handleUpdateStaff = async () => {
    if (editStaffId == null || !editStaff || !token || !userRole) return;
    try {
      const updated = await updateStaff(editStaffId, editStaff, token, userRole);
      setStaff(staff.map(s => s.id === updated.id ? updated : s));
      setEditStaffId(null);
      setEditStaff(null);
      setSuccess('Staff updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update staff');
    }
  };

  const handleDeleteStaff = async (id: number) => {
    if (!token || !userRole) return;
    try {
      await deleteStaff(id, token, userRole);
      setStaff(staff.filter(s => s.id !== id));
      setConfirmDeleteStaffId(null);
      setSuccess('Staff deleted successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete staff');
    }
  };

  // Styles
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: `linear-gradient(140deg, ${colors.background} 0%, ${colors.backgroundAlt} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.md,
    },
    container: {
      width: '1000px',
      maxWidth: '95%',
      background: colors.white,
      borderRadius: '1rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
      padding: spacing.xl,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
      borderBottom: `1px solid ${colors.border}`,
      paddingBottom: spacing.lg,
    },
    title: {
      color: colors.primary,
      fontWeight: 700,
      fontSize: '1.75rem',
      margin: 0,
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs,
      padding: `${spacing.sm} ${spacing.md}`,
      background: colors.white,
      color: colors.primary,
      border: `1px solid ${colors.primary}`,
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    contentWrapper: {
      display: 'flex',
      gap: spacing.xl,
    },
    column: {
      flex: 1,
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    sectionTitle: {
      color: colors.primary,
      fontSize: '1.25rem',
      fontWeight: 600,
      margin: 0,
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs,
      padding: `${spacing.xs} ${spacing.md}`,
      background: colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.75rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    card: {
      background: colors.white,
      borderRadius: '0.75rem',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      padding: spacing.md,
      marginBottom: spacing.md,
      border: `1px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.md,
    },
    cardIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: `${colors.primaryLight}20`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.primary,
      fontSize: '1.25rem',
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      fontWeight: 600,
      fontSize: '1rem',
      marginBottom: '0.25rem',
      color: colors.textPrimary,
      display: 'flex',
      alignItems: 'center',
    },
    cardSubtitle: {
      fontSize: '0.875rem',
      color: colors.textSecondary,
    },
    badge: (color: string) => ({
      display: 'inline-block',
      background: color,
      color: colors.white,
      borderRadius: '9999px',
      padding: `${spacing.xs} ${spacing.sm}`,
      fontSize: '0.625rem',
      fontWeight: 600,
      marginLeft: spacing.sm,
      textTransform: 'uppercase' as 'uppercase',
      letterSpacing: '0.025em',
    }),
    form: {
      background: colors.backgroundAlt,
      borderRadius: '0.75rem',
      padding: spacing.lg,
      marginTop: spacing.md,
    },
    formTitle: {
      fontSize: '1rem',
      fontWeight: 600,
      color: colors.primary,
      marginTop: 0,
      marginBottom: spacing.md,
    },
    formField: {
      marginBottom: spacing.md,
    },
    input: {
      width: '100%',
      padding: spacing.md,
      borderRadius: '0.5rem',
      border: `1px solid ${colors.border}`,
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'border-color 0.2s ease',
    },
    select: {
      width: '100%',
      padding: spacing.md,
      borderRadius: '0.5rem',
      border: `1px solid ${colors.border}`,
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'border-color 0.2s ease',
      appearance: 'none' as 'none',
      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 0.7rem top 50%',
      backgroundSize: '0.7rem auto',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    checkbox: {
      marginRight: spacing.xs,
    },
    submitButton: {
      width: '100%',
      padding: spacing.md,
      background: colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    errorMessage: {
      color: colors.error,
      fontSize: '0.875rem',
      marginBottom: spacing.md,
      textAlign: 'center' as 'center',
    },
    successMessage: {
      color: colors.success,
      fontSize: '0.875rem',
      marginBottom: spacing.md,
      textAlign: 'center' as 'center',
    },
    emptyState: {
      color: colors.textSecondary,
      fontSize: '0.875rem',
      fontStyle: 'italic',
      marginBottom: spacing.md,
    },
    loadingState: {
      textAlign: 'center' as 'center',
      padding: spacing.xl,
      color: colors.primary,
    },
    confirmDialog: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    confirmBox: {
      background: colors.white,
      padding: spacing.md,
      borderRadius: '0.5rem',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      maxWidth: '300px',
      textAlign: 'center' as 'center',
    },
    confirmBtn: {
      background: colors.error,
      color: colors.white,
      border: 'none',
      borderRadius: '0.5rem',
      padding: spacing.md,
      marginTop: spacing.md,
      cursor: 'pointer',
    },
    cancelConfirmBtn: {
      background: colors.textSecondary,
      color: colors.white,
      border: 'none',
      borderRadius: '0.5rem',
      padding: spacing.md,
      marginTop: spacing.md,
      marginLeft: spacing.sm,
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Inventory Management</h1>
          <button 
            onClick={() => navigate('/dashboard')} 
            style={styles.backButton}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div style={styles.loadingState}>
            <div className="spinner" style={{borderTopColor: colors.primary}}></div>
            <p>Loading inventory data...</p>
          </div>
        ) : error ? (
          <div style={styles.errorMessage}>{error}</div>
        ) : (
          <>
            {success && <div style={styles.successMessage}>{success}</div>}
            <div style={styles.contentWrapper}>
              {/* Items List */}
              <div style={styles.column}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Items</h2>
                  {(userRole === 'MANAGER' || userRole === 'OWNER') && (
                    <button onClick={() => setShowAddItem(v => !v)} style={styles.addButton}>
                      {showAddItem ? 'Cancel' : '+ Add Item'}
                    </button>
                  )}
                </div>
                <div>
                  {items.length === 0 && (
                    <div style={styles.emptyState}>No items found.</div>
                  )}
                  {items.map(item => (
                    <div key={item.id} style={styles.card}>
                      <div style={styles.cardIcon}>📦</div>
                      <div style={styles.cardContent}>
                        {editItemId === item.id ? (
                          <>
                            <input
                              style={styles.input}
                              value={editItem?.name || ''}
                              onChange={e => setEditItem(edit => ({ ...edit!, name: e.target.value }))}
                            />
                            <input
                              style={styles.input}
                              type="number"
                              value={editItem?.quantity || 0}
                              onChange={e => setEditItem(edit => ({ ...edit!, quantity: Number(e.target.value) }))}
                            />
                            <input
                              style={styles.input}
                              value={editItem?.category || ''}
                              onChange={e => setEditItem(edit => ({ ...edit!, category: e.target.value }))}
                            />
                            <button style={styles.addButton} onClick={handleUpdateItem}>Save</button>
                            <button style={styles.addButton} onClick={() => { setEditItemId(null); setEditItem(null); }}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <div style={styles.cardTitle}>
                              {item.name}
                              <span style={styles.badge(colors.primary)}>{item.category}</span>
                            </div>
                            <div style={styles.cardSubtitle}>Quantity: <strong>{item.quantity}</strong></div>
                          </>
                        )}
                      </div>
                      {(userRole === 'OWNER' || userRole === 'MANAGER') && editItemId !== item.id && (
                        <>
                          <button style={styles.addButton} onClick={() => handleEditItem(item)}>Edit</button>
                          <button style={{ ...styles.addButton, background: colors.error }} onClick={() => setConfirmDeleteItemId(item.id!)}>Delete</button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                {showAddItem && (
                  <form onSubmit={handleAddItem} style={styles.form}>
                    <h4 style={styles.formTitle}>Add New Item</h4>
                    <div style={styles.formField}>
                      <input 
                        value={itemName} 
                        onChange={e => setItemName(e.target.value)} 
                        required 
                        placeholder="Item Name" 
                        style={styles.input} 
                      />
                    </div>
                    <div style={styles.formField}>
                      <input 
                        type="number" 
                        value={itemQty} 
                        min={1} 
                        onChange={e => setItemQty(Number(e.target.value))} 
                        required 
                        placeholder="Quantity" 
                        style={styles.input} 
                      />
                    </div>
                    <div style={styles.formField}>
                      <input 
                        value={itemCat} 
                        onChange={e => setItemCat(e.target.value)} 
                        required 
                        placeholder="Category" 
                        style={styles.input} 
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={itemLoading} 
                      style={styles.submitButton}
                    >
                      {itemLoading ? <span className="spinner"></span> : 'Add Item'}
                    </button>
                  </form>
                )}
                {confirmDeleteItemId !== null && (
                  <div style={styles.confirmDialog}>
                    <div style={styles.confirmBox}>
                      <h3>Confirm Delete</h3>
                      <p>Are you sure you want to delete item ID {confirmDeleteItemId}?</p>
                      <button style={styles.confirmBtn} onClick={() => handleDeleteItem(confirmDeleteItemId!)}>Delete</button>
                      <button style={styles.cancelConfirmBtn} onClick={() => setConfirmDeleteItemId(null)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Staff List */}
              <div style={styles.column}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Staff</h2>
                  {userRole === 'OWNER' && (
                    <button onClick={() => setShowAddStaff(v => !v)} style={styles.addButton}>
                      {showAddStaff ? 'Cancel' : '+ Add Staff'}
                    </button>
                  )}
                </div>
                <div>
                  {staff.length === 0 && (
                    <div style={styles.emptyState}>No staff found.</div>
                  )}
                  {staff.map(s => (
                    <div key={s.id} style={styles.card}>
                      <div style={styles.cardIcon}>🧑‍💼</div>
                      <div style={styles.cardContent}>
                        {editStaffId === s.id ? (
                          <>
                            <input
                              style={styles.input}
                              value={editStaff?.name || ''}
                              onChange={e => setEditStaff(edit => ({ ...edit!, name: e.target.value }))}
                            />
                            <select
                              style={styles.select}
                              value={editStaff?.role || ''}
                              onChange={e => setEditStaff(edit => ({ ...edit!, role: e.target.value }))}
                            >
                              <option value="HOUSEKEEPER">HOUSEKEEPER</option>
                              <option value="CHEF">CHEF</option>
                              <option value="WAITSTAFF">WAITSTAFF</option>
                            </select>
                            <label>
                              <input
                                type="checkbox"
                                checked={editStaff?.onDuty || false}
                                onChange={e => setEditStaff(edit => ({ ...edit!, onDuty: e.target.checked }))}
                              />
                              On Duty
                            </label>
                            <button style={styles.addButton} onClick={handleUpdateStaff}>Save</button>
                            <button style={styles.addButton} onClick={() => { setEditStaffId(null); setEditStaff(null); }}>Cancel</button>
                          </>
                        ) : (
                          <div style={styles.cardTitle}>
                            {s.name}
                            <span style={styles.badge(colors.info)}>{s.role}</span>
                            <span style={styles.badge(s.onDuty ? colors.success : colors.textSecondary)}>
                              {s.onDuty ? 'On Duty' : 'Off Duty'}
                            </span>
                          </div>
                        )}
                      </div>
                      {userRole === 'OWNER' && editStaffId !== s.id && (
                        <>
                          <button style={styles.addButton} onClick={() => handleEditStaff(s)}>Edit</button>
                          <button style={{ ...styles.addButton, background: colors.error }} onClick={() => setConfirmDeleteStaffId(s.id!)}>Delete</button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                {showAddStaff && (
                  <form onSubmit={handleAddStaff} style={styles.form}>
                    <h4 style={styles.formTitle}>Add New Staff Member</h4>
                    <div style={styles.formField}>
                      <input 
                        value={staffName} 
                        onChange={e => setStaffName(e.target.value)} 
                        required 
                        placeholder="Staff Name" 
                        style={styles.input} 
                      />
                    </div>
                    <div style={styles.formField}>
                      <select 
                        value={staffRole} 
                        onChange={e => setStaffRole(e.target.value)} 
                        style={styles.select}
                      >
                        <option value="HOUSEKEEPER">HOUSEKEEPER</option>
                        <option value="CHEF">CHEF</option>
                        <option value="WAITSTAFF">WAITSTAFF</option>
                      </select>
                    </div>
                    <div style={styles.checkboxContainer}>
                      <input 
                        type="checkbox" 
                        checked={staffOnDuty} 
                        onChange={e => setStaffOnDuty(e.target.checked)}
                        style={styles.checkbox}
                        id="onDutyCheckbox"
                      />
                      <label htmlFor="onDutyCheckbox">On Duty</label>
                    </div>
                    <button 
                      type="submit" 
                      disabled={staffLoading} 
                      style={styles.submitButton}
                    >
                      {staffLoading ? <span className="spinner"></span> : 'Add Staff'}
                    </button>
                  </form>
                )}
                {confirmDeleteStaffId !== null && (
                  <div style={styles.confirmDialog}>
                    <div style={styles.confirmBox}>
                      <h3>Confirm Delete</h3>
                      <p>Are you sure you want to delete staff ID {confirmDeleteStaffId}?</p>
                      <button style={styles.confirmBtn} onClick={() => handleDeleteStaff(confirmDeleteStaffId!)}>Delete</button>
                      <button style={styles.cancelConfirmBtn} onClick={() => setConfirmDeleteStaffId(null)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Inventory; 