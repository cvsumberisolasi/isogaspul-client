// ============================================
// Products Admin Page — ISOGASPUL RACING
// ============================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye, Copy, Package, ChevronRight } from 'lucide-react';
import type { Product } from '../../types';
import { getProducts, formatPrice } from '../../api/insforge';
import { deleteProduct } from '../../api/adminApi';

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts({ limit: 100 });
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      alert('✅ Product deleted successfully!');
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert(`❌ Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category_id === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid var(--racing-gray-light)', borderTopColor: 'var(--racing-red)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ color: 'var(--racing-white)', fontSize: '32px', fontWeight: 900, marginBottom: '8px', background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🏁 Products
          </h1>
          <p style={{ color: 'var(--racing-silver)', fontSize: '16px' }}>Manage your product catalog</p>
        </div>
        <Link 
          to="/admin/products/new" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '12px 24px', 
            background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)', 
            border: 'none', 
            borderRadius: '8px', 
            color: 'var(--racing-white)', 
            fontSize: '14px', 
            fontWeight: 700, 
            cursor: 'pointer', 
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
          }}
        >
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      {/* Search & Filters */}
      <div style={{ 
        padding: '24px', 
        background: 'var(--racing-gray)', 
        borderRadius: '12px', 
        marginBottom: '24px',
        border: '1px solid var(--racing-gray-light)'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--racing-silver)' }} />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              style={{ 
                width: '100%', 
                padding: '12px 16px 12px 44px', 
                background: 'var(--racing-black)', 
                border: '1px solid var(--racing-gray-light)', 
                borderRadius: '8px', 
                color: 'var(--racing-white)', 
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--racing-red)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--racing-gray-light)'}
            />
          </div>
          <select
            style={{ 
              width: '200px', 
              padding: '12px 16px', 
              background: 'var(--racing-black)', 
              border: '1px solid var(--racing-gray-light)', 
              borderRadius: '8px', 
              color: 'var(--racing-white)', 
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer'
            }}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="glasswool">Glasswool</option>
            <option value="rockwool">Rockwool</option>
            <option value="insulation">Insulation</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {paginatedProducts.map(product => (
          <div key={product.id} style={{ 
            background: 'var(--racing-gray)', 
            borderRadius: '12px',
            border: '1px solid var(--racing-gray-light)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
            e.currentTarget.style.borderColor = 'var(--racing-red)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'var(--racing-gray-light)';
          }}
          >
            {/* Stock Badge */}
            <div style={{ 
              position: 'absolute', 
              top: '16px', 
              right: '16px', 
              padding: '6px 12px', 
              background: (product.stock || 0) > 10 ? 'var(--racing-green)' : 'var(--racing-red)', 
              borderRadius: '20px', 
              fontSize: '12px', 
              fontWeight: 700, 
              color: 'var(--racing-white)',
              zIndex: 1
            }}>
              Stock: {product.stock || 0}
            </div>

            {/* Product Image */}
            <div style={{ 
              height: '180px', 
              background: 'linear-gradient(135deg, var(--racing-gray) 0%, var(--racing-black) 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Package size={48} style={{ color: 'var(--racing-gray-light)' }} />
              )}
            </div>

            {/* Product Info */}
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ color: 'var(--racing-white)', fontSize: '18px', fontWeight: 700, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {product.name}
                </h3>
                <p style={{ color: 'var(--racing-silver)', fontSize: '12px', marginBottom: '8px' }}>
                  SKU: {product.sku || 'N/A'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ color: 'var(--racing-yellow)', fontSize: '20px', fontWeight: 900 }}>
                  {formatPrice(product.price)}
                </span>
                <span style={{ 
                  padding: '4px 12px', 
                  background: product.is_active ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)', 
                  color: product.is_active ? 'var(--racing-green)' : 'var(--racing-red)', 
                  borderRadius: '20px', 
                  fontSize: '12px', 
                  fontWeight: 600,
                  border: `1px solid ${product.is_active ? 'var(--racing-green)' : 'var(--racing-red)'}`
                }}>
                  {product.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p style={{ color: 'var(--racing-silver)', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px', height: '60px', overflow: 'hidden' }}>
                {product.description?.substring(0, 100) || 'No description'}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--racing-gray-light)', paddingTop: '16px' }}>
                <Link 
                  to={`/admin/products/${product.id}/edit`}
                  style={{ 
                    flex: 1, 
                    padding: '10px', 
                    background: 'var(--racing-black)', 
                    border: '1px solid var(--racing-gray-light)', 
                    borderRadius: '8px', 
                    color: 'var(--racing-silver)', 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    cursor: 'pointer', 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'var(--racing-gray-light)';
                    e.currentTarget.style.color = 'var(--racing-white)';
                    e.currentTarget.style.borderColor = 'var(--racing-silver)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'var(--racing-black)';
                    e.currentTarget.style.color = 'var(--racing-silver)';
                    e.currentTarget.style.borderColor = 'var(--racing-gray-light)';
                  }}
                >
                  <Edit size={14} />
                  Edit
                </Link>
                <Link 
                  to={`/produk/${product.slug || product.id}`}
                  target="_blank"
                  style={{ 
                    flex: 1, 
                    padding: '10px', 
                    background: 'var(--racing-black)', 
                    border: '1px solid var(--racing-gray-light)', 
                    borderRadius: '8px', 
                    color: 'var(--racing-silver)', 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    cursor: 'pointer', 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'var(--racing-gray-light)';
                    e.currentTarget.style.color = 'var(--racing-white)';
                    e.currentTarget.style.borderColor = 'var(--racing-silver)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'var(--racing-black)';
                    e.currentTarget.style.color = 'var(--racing-silver)';
                    e.currentTarget.style.borderColor = 'var(--racing-gray-light)';
                  }}
                >
                  <Eye size={14} />
                  View
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  style={{ 
                    flex: 1, 
                    padding: '10px', 
                    background: 'var(--racing-black)', 
                    border: '1px solid var(--racing-red)', 
                    borderRadius: '8px', 
                    color: 'var(--racing-red)', 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    cursor: 'pointer', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'var(--racing-red)';
                    e.currentTarget.style.color = 'var(--racing-white)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'var(--racing-black)';
                    e.currentTarget.style.color = 'var(--racing-red)';
                  }}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {paginatedProducts.length === 0 && (
        <div style={{ 
          padding: '48px', 
          background: 'var(--racing-gray)', 
          borderRadius: '12px', 
          textAlign: 'center',
          border: '1px solid var(--racing-gray-light)'
        }}>
          <Package size={64} style={{ color: 'var(--racing-gray-light)', marginBottom: '24px' }} />
          <h3 style={{ color: 'var(--racing-white)', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
            No products found
          </h3>
          <p style={{ color: 'var(--racing-silver)', marginBottom: '24px' }}>
            {searchQuery || filterCategory !== 'all' ? 'Try adjusting your search filters' : 'Start by adding your first product'}
          </p>
          <Link 
            to="/admin/products/new" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px 24px', 
              background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)', 
              border: 'none', 
              borderRadius: '8px', 
              color: 'var(--racing-white)', 
              fontSize: '14px', 
              fontWeight: 700, 
              cursor: 'pointer', 
              textDecoration: 'none' 
            }}
          >
            <Plus size={20} />
            Add Your First Product
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '20px',
          background: 'var(--racing-gray)', 
          borderRadius: '12px',
          border: '1px solid var(--racing-gray-light)'
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{ 
              padding: '10px 16px', 
              background: currentPage === 1 ? 'var(--racing-gray-light)' : 'var(--racing-black)', 
              border: '1px solid var(--racing-gray-light)', 
              borderRadius: '8px', 
              color: currentPage === 1 ? 'var(--racing-silver)' : 'var(--racing-white)', 
              fontSize: '14px', 
              fontWeight: 600, 
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
            Previous
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: currentPage === pageNum ? 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)' : 'var(--racing-black)', 
                    border: `1px solid ${currentPage === pageNum ? 'transparent' : 'var(--racing-gray-light)'}`, 
                    borderRadius: '8px', 
                    color: currentPage === pageNum ? 'var(--racing-white)' : 'var(--racing-silver)', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    cursor: 'pointer' 
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{ 
              padding: '10px 16px', 
              background: currentPage === totalPages ? 'var(--racing-gray-light)' : 'var(--racing-black)', 
              border: '1px solid var(--racing-gray-light)', 
              borderRadius: '8px', 
              color: currentPage === totalPages ? 'var(--racing-silver)' : 'var(--racing-white)', 
              fontSize: '14px', 
              fontWeight: 600, 
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Stats */}
      <div style={{ marginTop: '24px' }}>
        <div style={{ 
          padding: '16px', 
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)', 
          borderRadius: '12px',
          border: '1px solid var(--racing-red)'
        }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--racing-silver)', fontSize: '14px', marginBottom: '4px' }}>Total Products</div>
              <div style={{ color: 'var(--racing-white)', fontSize: '24px', fontWeight: 900 }}>{products.length}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--racing-silver)', fontSize: '14px', marginBottom: '4px' }}>Active Products</div>
              <div style={{ color: 'var(--racing-green)', fontSize: '24px', fontWeight: 900 }}>
                {products.filter(p => p.is_active).length}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--racing-silver)', fontSize: '14px', marginBottom: '4px' }}>Low Stock ({'<10'})</div>
              <div style={{ color: 'var(--racing-red)', fontSize: '24px', fontWeight: 900 }}>
                {products.filter(p => (p.stock || 0) < 10).length}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--racing-silver)', fontSize: '14px', marginBottom: '4px' }}>Out of Stock</div>
              <div style={{ color: 'var(--racing-yellow)', fontSize: '24px', fontWeight: 900 }}>
                {products.filter(p => (p.stock || 0) === 0).length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
