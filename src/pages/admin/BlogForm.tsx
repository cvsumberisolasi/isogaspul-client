// ============================================
// Blog Form (Create/Edit) — ISOGASPUL
// ============================================

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type { Blog } from '../../types';
import { uploadImage, fileToBase64 } from '../../utils/imageUpload';
import { createBlog, updateBlog } from '../../api/adminApi';

export default function BlogForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Blog>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: '',
    author_name: '',
    is_published: false,
    is_featured: false,
  });

  useEffect(() => {
    if (isEdit) {
      loadBlog();
    }
  }, [id]);

  const loadBlog = async () => {
    // TODO: Load blog from API
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleContentChange = (value: string) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const generateSlug = () => {
    const slug = formData.title?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Show preview immediately
      const preview = await fileToBase64(file);
      setFormData(prev => ({ ...prev, image_url: preview }));

      // Upload to storage
      const result = await uploadImage(file, 'products', 'blog-images');
      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, image_url: result.url }));
      } else {
        console.error('Upload failed:', result.error);
        alert(`Failed to upload image: ${result.error}`);
        setFormData(prev => ({ ...prev, image_url: '' }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
      setFormData(prev => ({ ...prev, image_url: '' }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const blogData: Partial<Blog> = {
        ...formData,
        published_at: formData.is_published ? new Date().toISOString() : null,
      };
      
      if (isEdit && id) {
        await updateBlog(id, blogData);
        alert('Blog post updated successfully!');
      } else {
        await createBlog(blogData);
        alert('Blog post created successfully!');
      }
      
      navigate('/admin/blogs');
    } catch (error) {
      console.error('Failed to save blog:', error);
      alert(`Failed to save blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <button onClick={() => navigate('/admin/blogs')} className="admin-btn admin-btn-sm admin-btn-secondary" style={{ marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} />
            Back to Blog
          </button>
          <h1 className="admin-page-title">{isEdit ? 'Edit Blog Post' : 'New Blog Post'}</h1>
          <p className="admin-page-subtitle">Fill in the blog post details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          {/* Main Content */}
          <div>
            {/* Basic Info */}
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: '1.5rem' }}>Basic Information</h3>
              
              <div className="admin-form-group">
                <label className="admin-label admin-label-required">Title</label>
                <input
                  type="text"
                  name="title"
                  className="admin-input"
                  value={formData.title}
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
                <label className="admin-label">Excerpt</label>
                <textarea
                  name="excerpt"
                  className="admin-textarea"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Brief summary of the blog post"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label admin-label-required">Content</label>
                <div style={{ background: 'white', borderRadius: '0.5rem' }}>
                  <ReactQuill
                    theme="snow"
                    value={formData.content || ''}
                    onChange={handleContentChange}
                    modules={quillModules}
                    style={{ minHeight: '300px' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Status */}
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: '1.5rem' }}>Publish</h3>
              
              <div className="admin-form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleCheckboxChange}
                  />
                  <span className="admin-label" style={{ marginBottom: 0 }}>Published</span>
                </label>
              </div>

              <div className="admin-form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleCheckboxChange}
                  />
                  <span className="admin-label" style={{ marginBottom: 0 }}>Featured</span>
                </label>
              </div>
            </div>

            {/* Featured Image */}
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: '1.5rem' }}>Featured Image</h3>
              
              {formData.image_url ? (
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <img
                    src={formData.image_url}
                    alt="Featured"
                    style={{ width: '100%', borderRadius: '0.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '0.25rem', padding: '0.5rem', cursor: 'pointer', color: 'white' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : null}

              <label className="admin-btn admin-btn-secondary" style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}>
                <Upload size={20} />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Metadata */}
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: '1.5rem' }}>Metadata</h3>
              
              <div className="admin-form-group">
                <label className="admin-label">Category</label>
                <input
                  type="text"
                  name="category"
                  className="admin-input"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Tutorial, News"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Author</label>
                <input
                  type="text"
                  name="author_name"
                  className="admin-input"
                  value={formData.author_name}
                  onChange={handleInputChange}
                  placeholder="Author name"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="admin-card">
              <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%', marginBottom: '0.5rem' }} disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
              </button>
              <button type="button" onClick={() => navigate('/admin/blogs')} className="admin-btn admin-btn-secondary" style={{ width: '100%' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
