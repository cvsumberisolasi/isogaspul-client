// ============================================
// Product Form (Create/Edit) — ISOGASPUL
// ============================================

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus, Trash2 } from 'lucide-react';
import type { Product, TierPricing } from '../../types';
import { uploadImage, fileToBase64 } from '../../utils/imageUpload';
import { getProduct } from '../../api/insforge';
import { createProduct, updateProduct } from '../../api/adminApi';

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    sku: '',
    category_id: '',
    short_description: '',
    description: '',
    price: 0,
    unit: 'roll',
    stock: 0,
    min_order: 1,
    is_active: true,
    is_featured: false,
    image_url: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [tierPrices, setTierPrices] = useState<any[]>([]);

  useEffect(() => {
    if (isEdit) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const product = await getProduct(id);
      if (!product) {
        alert('Product not found');
        navigate('/admin/products');
        return;
      }
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        sku: product.sku || '',
        category_id: (product as any).category_id || '',
        short_description: product.short_description || '',
        description: product.description || '',
        price: product.price || 0,
        unit: product.unit || 'roll',
        stock: product.stock || 0,
        min_order: product.min_order || 1,
        is_active: product.is_active !== false,
        is_featured: product.is_featured === true,
        image_url: product.image_url || '',
      });
      setImages((product as any).images || []);
      setTierPrices((product as any).tier_prices || []);
    } catch (error) {
      console.error('Failed to load product:', error);
      alert('Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setLoading(true);
    try {
      // Upload each file to InsForge Storage
      const uploadPromises = Array.from(files).map(async (file) => {
        // Show preview immediately
        const preview = await fileToBase64(file);
        setImages(prev => [...prev, preview]);

        // Upload to storage
        const result = await uploadImage(file, 'product-images');
        if (result.success && result.url) {
          // Replace preview with actual URL
          setImages(prev => prev.map(img => img === preview ? result.url! : img));
          return result.url;
        } else {
          console.error('Upload failed:', result.error);
          alert(`Failed to upload ${file.name}: ${result.error}`);
          // Remove failed preview
          setImages(prev => prev.filter(img => img !== preview));
          return null;
        }
      });

      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTierPrice = () => {
    setTierPrices(prev => [...prev, { min_quantity: 0, price: 0 }]);
  };

  const updateTierPrice = (index: number, field: 'min_quantity' | 'max_quantity' | 'price' | 'discount_percent', value: number) => {
    setTierPrices(prev => prev.map((tier, i) => 
      i === index ? { ...tier, [field]: value } : tier
    ));
  };

  const removeTierPrice = (index: number) => {
    setTierPrices(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Only send valid product fields based on database schema
      // Validate category_id - must be valid UUID or empty
      const isValidUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      const categoryId = formData.category_id && isValidUUID(formData.category_id) ? formData.category_id : null;
      
      // Auto-generate slug if empty
      const slug = formData.slug || formData.name?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || null;

      const productData = {
        name: formData.name,
        slug,
        sku: formData.sku || null,
        short_description: formData.short_description || null,
        description: formData.description || null,
        price: Number(formData.price) || 0,
        image_url: images[0] || null,
        images: images.length > 0 ? images : null,
        is_featured: formData.is_featured || false,
        is_active: formData.is_active !== false,
        stock: Number(formData.stock) || 0,
        min_order: Number(formData.min_order) || 1,
        unit: formData.unit || 'roll',
        specifications: formData.specifications || {},
        tier_prices: tierPrices.length > 0 ? tierPrices : null,
        category_id: categoryId,
      };
      
      if (isEdit && id) {
        await updateProduct(id, productData);
        alert('Product updated successfully!');
      } else {
        await createProduct(productData);
        alert('Product created successfully!');
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to save product:', error);
      alert(`Failed to save product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <button onClick={() => navigate('/admin/products')} className="admin-btn admin-btn-sm admin-btn-secondary" style={{ marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} />
            Back to Products
          </button>
          <h1 className="admin-page-title">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="admin-page-subtitle">Fill in the product details below</p>
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
                <label className="admin-label admin-label-required">Product Name</label>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    className="admin-input"
                    value={formData.sku}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label admin-label-required">Category</label>
                  <select
                    name="category_id"
                    className="admin-select"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="1">Glasswool</option>
                    <option value="2">Rockwool</option>
                    <option value="3">Ceramic Fiber</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Short Description</label>
                <input
                  type="text"
                  name="short_description"
                  className="admin-input"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  placeholder="Brief product description"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Description</label>
                <textarea
                  name="description"
                  className="admin-textarea"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Detailed product description"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: '1.5rem' }}>Pricing</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label admin-label-required">Price</label>
                  <input
                    type="number"
                    name="price"
                    className="admin-input"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Unit</label>
                  <select
                    name="unit"
                    className="admin-select"
                    value={formData.unit}
                    onChange={handleInputChange}
                  >
                    <option value="roll">Roll</option>
                    <option value="sheet">Sheet</option>
                    <option value="box">Box</option>
                    <option value="meter">Meter</option>
                  </select>
                </div>
              </div>

              {/* Tier Pricing */}
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label className="admin-label" style={{ marginBottom: 0 }}>Tier Pricing</label>
                  <button type="button" onClick={addTierPrice} className="admin-btn admin-btn-sm admin-btn-secondary">
                    <Plus size={16} />
                    Add Tier
                  </button>
                </div>
                {tierPrices.map((tier, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="number"
                      className="admin-input"
                      placeholder="Min Quantity"
                      value={tier.min_quantity}
                      onChange={(e) => updateTierPrice(index, 'min_quantity', parseFloat(e.target.value))}
                    />
                    <input
                      type="number"
                      className="admin-input"
                      placeholder="Price"
                      value={tier.price}
                      onChange={(e) => updateTierPrice(index, 'price', parseFloat(e.target.value))}
                    />
                    <button type="button" onClick={() => removeTierPrice(index)} className="admin-btn admin-btn-icon admin-btn-danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory */}
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: '1.5rem' }}>Inventory</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    className="admin-input"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Minimum Order</label>
                  <input
                    type="number"
                    name="min_order"
                    className="admin-input"
                    value={formData.min_order}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Status */}
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: '1.5rem' }}>Status</h3>
              
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

            {/* Images */}
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: '1.5rem' }}>Product Images</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label className="admin-btn admin-btn-secondary" style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}>
                  <Upload size={20} />
                  Upload Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {images.map((image, index) => (
                  <div key={index} style={{ position: 'relative', paddingTop: '100%', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--admin-border)' }}>
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '0.25rem', padding: '0.25rem', cursor: 'pointer', color: 'white' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="admin-card">
              <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%', marginBottom: '0.5rem' }} disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
              </button>
              <button type="button" onClick={() => navigate('/admin/products')} className="admin-btn admin-btn-secondary" style={{ width: '100%' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
