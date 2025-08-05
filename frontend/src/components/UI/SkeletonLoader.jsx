import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Card skeleton for vocabulary/classroom lists
export function CardSkeleton({ count = 1 }) {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="dashboard__list-card">
          <div className="dashboard__list-header">
            <Skeleton height={24} width="60%" />
            <Skeleton height={20} width={20} />
          </div>
          <Skeleton height={16} count={2} style={{ marginBottom: '8px' }} />
          <div className="dashboard__list-footer">
            <div className="dashboard__user">
              <Skeleton circle height={32} width={32} />
              <div>
                <Skeleton height={14} width={80} />
                <Skeleton height={12} width={60} />
              </div>
            </div>
            <Skeleton height={32} width={100} />
          </div>
        </div>
      ))}
    </SkeletonTheme>
  );
}

// Word card skeleton for vocabulary details
export function WordCardSkeleton({ count = 1 }) {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="word-card">
          <Skeleton height={20} width="40%" style={{ marginBottom: '8px' }} />
          <Skeleton height={16} width="80%" style={{ marginBottom: '8px' }} />
          <Skeleton height={14} width="60%" />
        </div>
      ))}
    </SkeletonTheme>
  );
}

// Table row skeleton for classroom data
export function TableRowSkeleton({ count = 5, columns = 4 }) {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      {Array.from({ length: count }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex}>
              <Skeleton height={16} />
            </td>
          ))}
        </tr>
      ))}
    </SkeletonTheme>
  );
}

// Generic content skeleton
export function ContentSkeleton({ lines = 3, height = 16 }) {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <Skeleton height={height} count={lines} style={{ marginBottom: '8px' }} />
    </SkeletonTheme>
  );
}

// Avatar skeleton
export function AvatarSkeleton({ size = 32 }) {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <Skeleton circle height={size} width={size} />
    </SkeletonTheme>
  );
}

// Button skeleton
export function ButtonSkeleton({ width = 100, height = 32 }) {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <Skeleton height={height} width={width} />
    </SkeletonTheme>
  );
}

// Header skeleton for page titles
export function HeaderSkeleton() {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <Skeleton height={32} width="30%" style={{ marginBottom: '16px' }} />
      <Skeleton height={16} width="50%" />
    </SkeletonTheme>
  );
}

// Classroom card skeleton matching .classroom-card styles
export function ClassroomCardSkeleton({ count = 1 }) {
  return (
    <SkeletonTheme baseColor="#f1ede4" highlightColor="#e8ddc7">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="classroom-card"
          style={{
            backgroundColor: '#F9F3E4',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #eee',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div className="info">
            <Skeleton height={14} width="40%" style={{ marginBottom: '0.3rem' }} />
            <Skeleton height={20} width="70%" />
          </div>
        </div>
      ))}
    </SkeletonTheme>
  );
}