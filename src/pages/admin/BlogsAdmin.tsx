// ============================================
// Blogs Admin Page — ISOGASPUL
// ============================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import type { Blog } from '../../types';
import { getBlogs } from '../../api/insforge';
import { deleteBlog } from '../../api/adminApi';

export default function BlogsAdmin() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await getBlogs({ limit: 100 });
      setBlogs(data);
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      await deleteBlog(id);
      alert('Blog post deleted successfully!');
      loadBlogs();
    } catch (error) {
      console.error('Failed to delete blog:', error);
      alert(`Failed to delete blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && blog.is_published) ||
                         (filterStatus === 'draft' && !blog.is_published);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <h1 className="admin-page-title">Blog Posts</h1>
          <p className="admin-page-subtitle">Manage your blog content</p>
        </div>
        <Link to="/admin/blogs/new" className="admin-btn admin-btn-primary">
          <Plus size={20} />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search blog posts..."
              className="admin-input"
              style={{ paddingLeft: '2.5rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="admin-select"
            style={{ width: '200px' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button className="admin-btn admin-btn-secondary">
            <Filter size={20} />
            More Filters
          </button>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Image</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Published</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBlogs.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="admin-empty-state">
                      <div className="admin-empty-icon">📝</div>
                      <h3 className="admin-empty-title">No blog posts found</h3>
                      <p className="admin-empty-text">Get started by creating your first blog post</p>
                      <Link to="/admin/blogs/new" className="admin-btn admin-btn-primary">
                        <Plus size={20} />
                        New Post
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedBlogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>
                      <img
                        src={blog.image_url || '/placeholder.jpg'}
                        alt={blog.title}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.5rem' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{blog.title}</div>
                      <div style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>{blog.excerpt}</div>
                    </td>
                    <td>{blog.author_name || '-'}</td>
                    <td>
                      {blog.category && (
                        <span className="admin-badge admin-badge-info">{blog.category}</span>
                      )}
                    </td>
                    <td>
                      <span className={blog.is_published ? 'admin-badge admin-badge-success' : 'admin-badge admin-badge-warning'}>
                        {blog.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      {blog.published_at ? new Date(blog.published_at).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/blog/${blog.slug}`} className="admin-btn admin-btn-sm admin-btn-icon" title="View">
                          <Eye size={16} />
                        </Link>
                        <Link to={`/admin/blogs/${blog.id}/edit`} className="admin-btn admin-btn-sm admin-btn-icon" title="Edit">
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="admin-btn admin-btn-sm admin-btn-icon"
                          title="Delete"
                        >
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--admin-border)' }}>
            <div style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBlogs.length)} of {filteredBlogs.length} posts
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="admin-btn admin-btn-sm admin-btn-secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`admin-btn admin-btn-sm ${page === currentPage ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="admin-btn admin-btn-sm admin-btn-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
