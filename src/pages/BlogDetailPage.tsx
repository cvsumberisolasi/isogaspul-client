// ============================================
// Blog Detail Page — ISOGASPUL
// ============================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { getBlog } from '../api/insforge';
import type { Blog } from '../types';
import SEO from '../components/seo/SEO';
import { articleSchema, breadcrumbSchema } from '../lib/schema';
import './BlogDetailPage.css';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getBlog(slug).then((data: Blog | null) => {
        setBlog(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: blog?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link berhasil disalin!');
    }
  };

  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="container">
          <div className="blog-detail-skeleton">
            <div className="skeleton-title" />
            <div className="skeleton-meta" />
            <div className="skeleton-image-lg" />
            <div className="skeleton-body">
              <div className="skeleton-line" style={{ width: '100%' }} />
              <div className="skeleton-line" style={{ width: '95%' }} />
              <div className="skeleton-line" style={{ width: '80%' }} />
              <div className="skeleton-line" style={{ width: '90%' }} />
              <div className="skeleton-line" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-detail-page">
        <div className="container">
          <div className="blog-not-found">
            <h2>Artikel Tidak Ditemukan</h2>
            <p>Artikel yang Anda cari tidak tersedia.</p>
            <Link to="/blog" className="btn-back">← Kembali ke Blog</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={blog.title}
        description={blog.excerpt || blog.title}
        canonical={`https://isogaspul.com/blog/${blog.slug}`}
        ogImage={blog.image_url || undefined}
        ogType="article"
        keywords={`${blog.title.toLowerCase()}, glasswool, fiberglass, insulasi, peredam suara, isogaspul`}
        schema={{
          ...articleSchema({
            title: blog.title,
            description: blog.excerpt || '',
            image: blog.image_url || '/logo-isogaspul.png',
            url: `https://isogaspul.com/blog/${blog.slug}`,
            datePublished: (blog as any).published_at || (blog as any).created_at || new Date().toISOString(),
            author: blog.author || 'Tim Isogaspul',
          }),
          ...breadcrumbSchema([
            { name: 'Home', url: 'https://isogaspul.com' },
            { name: 'Blog', url: 'https://isogaspul.com/blog' },
            { name: blog.title, url: `https://isogaspul.com/blog/${blog.slug}` },
          ]),
        }}
      />
    <div className="blog-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="blog-breadcrumb">
          <Link to="/blog"><ArrowLeft size={16} /> Kembali ke Blog</Link>
        </div>

        {/* Header */}
        <header className="blog-detail-header">
          <h1>{blog.title}</h1>
          <div className="blog-meta">
            <span><Calendar size={16} /> {blog.published_at ? new Date(blog.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
            {blog.author_name && <span><User size={16} /> {blog.author_name}</span>}
            <button onClick={handleShare} className="btn-share"><Share2 size={16} /> Bagikan</button>
          </div>
        </header>

        {/* Featured Image */}
        {blog.image_url && (
          <div className="blog-detail-image">
            <img
              src={blog.image_url}
              alt={blog.title}
              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
            />
          </div>
        )}

        {/* Content */}
        <article className="blog-detail-content">
          <div className="blog-body" dangerouslySetInnerHTML={{ __html: formatContent(blog.content || '') }} />
        </article>

        {/* CTA */}
        <div className="blog-cta">
          <div className="cta-card">
            <h3>Butuh Material Isolasi?</h3>
            <p>Konsultasikan kebutuhan Anda dengan tim kami. Gratis!</p>
            <a href="https://wa.me/6281394373007" target="_blank" rel="noopener noreferrer" className="btn-cta">
              Chat WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function formatContent(content: string): string {
  return content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^---$/gm, '<hr />')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br />')
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      if (cells[0]?.includes('---')) return '';
      return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
    });
}
