import React, { Suspense } from 'react';

interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}


const LazyLoad: React.FC<LazyLoadProps> = ({ children, fallback }) => (
  <Suspense fallback={fallback || <div>Loading...</div>}>{children}</Suspense>
);

export default LazyLoad;