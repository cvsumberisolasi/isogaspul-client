// ============================================
// Categories Admin Page — ISOGASPUL
// ============================================

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import type { Category } from '../../types';
import { getCategories } from '../../api/insforge';
import { createCategory, updateCategory, deleteCategory } from '../../api/adminApi';

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const generateSlug = () => {
    const slug = formData.name?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        alert('Category updated successfully!');
      } else {
        await createCategory(formData);
        alert('Category created successfully!');
      }
      
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '', is_active: true, sort_order: 0 });
      loadCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert(`Failed to save category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData(category);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await deleteCategory(id);
      alert('Category deleted successfully!');
      loadCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert(`Failed to delete category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', is_active: true, sort_order: 0 });
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories</h1>
          <p className="admin-page-subtitle">Manage product categories</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="admin-btn admin-btn-primary">
            <Plus size={20} />
            Add Category
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showForm ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* Categories List */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">All Categories</h3>
          </div>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th style={{ width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="admin-empty-state">
                        <div className="admin-empty-icon">📁</div>
                        <h3 className="admin-empty-title">No categories found</h3>
                        <p className="admin-empty-text">Get started by adding your first category</p>
                        <button onClick={() => setShowForm(true)} className="admin-btn admin-btn-primary">
                          <Plus size={20} />
                          Add Category
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <button className="admin-btn-icon" style={{ cursor: 'grab' }}>
                          <GripVertical size={16} />
                        </button>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{category.name}</div>
                        {category.description && (
                          <div style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>{category.description}</div>
                        )}
                      </td>
                      <td>{category.slug}</td>
                      <td>
                        <span className={category.is_active ? 'admin-badge admin-badge-success' : 'admin-badge admin-badge-error'}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleEdit(category)} className="admin-btn admin-btn-sm admin-btn-icon" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(category.id)} className="admin-btn admin-btn-sm admin-btn-icon" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Form */}
        {showForm && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-label admin-label-required">Name</label>
                <input
                  type="text"
                  name="name"
                  className="admin-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={generateSlug}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label admin-label-required">Slug</label>
                <input
                  type="text"
                  name="slug"
                  className="admin-input"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Description</label>
                <textarea
                  name="description"
                  className="admin-textarea"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Brief category description"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Sort Order</label>
                <input
                  type="number"
                  name="sort_order"
                  className="admin-input"
                  value={formData.sort_order}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>

              <div className="admin-form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleCheckboxChange}
                  />
                  <span className="admin-label" style={{ marginBottom: 0 }}>Active</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>
                  {editingCategory ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={handleCancel} className="admin-btn admin-btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
