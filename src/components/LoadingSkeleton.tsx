import type { ReactNode } from 'react';

interface SkeletonProps { count?: number; rows?: number; circle?: boolean; width?: string; height?: string; className?: string; }

export function LoadingSkeleton({ count = 1, rows = 3, circle = false, width, height, className }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={className} style={{ marginBottom: '24px' }}>
          {circle ? (
            <div style={{ width: width || '48px', height: height || '48px', borderRadius: '50%', background: 'linear-gradient(90deg, var(--racing-gray) 25%, var(--racing-gray-light) 50%, var(--racing-gray) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease infinite' }} />
          ) : (
            <>
              {Array.from({ length: rows }).map((_, j) => (
                <div key={j} style={{ width: j === 0 ? (width || '60%') : j === rows - 1 ? '40%' : '100%', height: height || (j === 0 ? '20px' : '14px'), borderRadius: '4px', background: 'linear-gradient(90deg, var(--racing-gray) 25%, var(--racing-gray-light) 50%, var(--racing-gray) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease infinite', marginBottom: '10px', opacity: j === 0 ? 1 : 0.6 }} />
              ))}
            </>
          )}
        </div>
      ))}
    </>
  );
}

export function PageSkeleton(): ReactNode {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--racing-black)', paddingTop: '80px' }}>
      <div className="container" style={{ padding: '40px 20px' }}>
        <LoadingSkeleton rows={1} width="200px" height="28px" />
        <div style={{ height: '24px' }} />
        <LoadingSkeleton count={3} rows={2} />
      </div>
    </div>
  );
}

export function ProductCardSkeleton(): ReactNode {
  return (
    <div style={{ background: 'var(--racing-gray)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--racing-gray-light)' }}>
      <div style={{ width: '100%', height: '200px', background: 'linear-gradient(90deg, var(--racing-gray) 25%, var(--racing-gray-light) 50%, var(--racing-gray) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease infinite' }} />
      <div style={{ padding: '16px' }}>
        <LoadingSkeleton rows={3} />
      </div>
    </div>
  );
}

export function OrderRowSkeleton(): ReactNode {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--racing-gray)', borderRadius: '8px', border: '1px solid var(--racing-gray-light)', marginBottom: '12px' }}>
      <LoadingSkeleton count={1} rows={1} width="50%" />
      <LoadingSkeleton count={1} rows={1} width="30%" />
      <LoadingSkeleton count={1} rows={1} width="20%" />
    </div>
  );
}