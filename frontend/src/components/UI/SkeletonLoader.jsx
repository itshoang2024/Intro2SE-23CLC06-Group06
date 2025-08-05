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

// HomePage Carousel Section Skeleton
export function CarouselSectionSkeleton({ title, showTabs = false }) {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <section className="carousel-vocab-section">
        <div className="section-header">
          <h2 style={{ margin: '0 0 1rem 0' }}>
            <Skeleton height={40} width={title ? title.length * 15 : 200} />
          </h2>
          {showTabs && (
            <div className="review-tabs" style={{ display: 'flex', gap: '1rem' }}>
              <Skeleton height={32} width={80} />
              <Skeleton height={32} width={100} />
            </div>
          )}
        </div>
        <div className="carousel-body">
          <div className="carousel-viewport">
            <div className="carousel-slider" style={{ display: 'flex' }}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="carousel-item" style={{ padding: '0 14px' }}>
                  <VocabularyListCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SkeletonTheme>
  );
}

// VocabularyListCard skeleton for HomePage
export function VocabularyListCardSkeleton() {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="vocab-card" style={{
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <Skeleton height={20} width="80%" style={{ marginBottom: '8px' }} />
        <Skeleton height={16} count={2} style={{ marginBottom: '8px' }} />
        
        <div className="vocab-footer" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '16px'
        }}>
          <div className="user-block" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Skeleton circle height={32} width={32} />
            <div>
              <Skeleton height={14} width={80} style={{ marginBottom: '4px' }} />
              <Skeleton height={12} width={60} />
            </div>
          </div>
          <Skeleton height={32} width={80} />
        </div>
      </div>
    </SkeletonTheme>
  );
}

// Search Results Grid Skeleton
export function SearchResultsGridSkeleton({ count = 8 }) {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="search-results-grid">
        {Array.from({ length: count }).map((_, index) => (
          <VocabularyListCardSkeleton key={index} />
        ))}
      </div>
    </SkeletonTheme>
  );
}

// ViewList Page Skeleton
export function ViewListSkeleton() {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <main className="view-list__main">
        {/* Header Section */}
        <div className="view-list__header">
          <div className="view-list__title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Skeleton height={32} width="40%" />
            <div style={{ display: 'flex', gap: '8px' }}>
              <Skeleton height={24} width={24} />
              <Skeleton height={24} width={24} />
            </div>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <Skeleton height={16} count={2} style={{ marginBottom: '8px' }} />
          </div>
          
          <Skeleton height={14} width="25%" style={{ marginBottom: '8px' }} />
          <Skeleton height={14} width="20%" />
        </div>

        {/* Privacy and Review Row */}
        <div className="view-list__privacy-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
          <Skeleton height={18} width="15%" />
          <Skeleton height={36} width={120} />
        </div>

        {/* Description Section */}
        <section className="view-list__description" style={{ marginBottom: '24px' }}>
          <Skeleton height={24} width="15%" style={{ marginBottom: '12px' }} />
          <Skeleton height={16} count={2} />
        </section>

        {/* Search and Controls */}
        <section className="view-list__controls" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <Skeleton height={40} width="60%" />
          <Skeleton height={40} width="15%" />
        </section>

        {/* Words Section */}
        <section className="view-list__words">
          <Skeleton height={24} width="25%" style={{ marginBottom: '16px' }} />
          <WordListSkeleton count={5} />
        </section>
      </main>
    </SkeletonTheme>
  );
}

// Word List Skeleton for ViewList
export function WordListSkeleton({ count = 5 }) {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="view-list__word-list">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="view-list__word-box" style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            backgroundColor: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <Skeleton height={20} width={30} style={{ marginRight: '16px' }} />
            </div>
            
            {/* First row of inputs */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <Skeleton height={36} />
                <Skeleton height={12} width="60%" style={{ marginTop: '4px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <Skeleton height={36} />
                <Skeleton height={12} width="50%" style={{ marginTop: '4px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <Skeleton height={36} />
                <Skeleton height={12} width="55%" style={{ marginTop: '4px' }} />
              </div>
            </div>

            {/* Second row */}
            <div style={{ marginBottom: '16px' }}>
              <Skeleton height={36} />
              <Skeleton height={12} width="40%" style={{ marginTop: '4px' }} />
            </div>

            {/* Statistics */}
            <div style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '6px' }}>
              <Skeleton height={14} width="15%" style={{ marginBottom: '8px' }} />
              <div style={{ display: 'flex', gap: '32px' }}>
                <div>
                  <Skeleton height={12} width={120} style={{ marginBottom: '4px' }} />
                  <Skeleton height={12} width={100} />
                </div>
                <div>
                  <Skeleton height={12} width={130} style={{ marginBottom: '4px' }} />
                  <Skeleton height={12} width={110} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}

// Edit/Create List Form Skeleton
export function ListFormSkeleton({ isEditMode = false }) {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <form className={`${isEditMode ? 'edit-list' : 'create-list'}__form`}>
        <Skeleton height={40} width="20%" style={{ marginBottom: '32px' }} />
        
        {/* Metadata Form Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ marginBottom: '20px' }}>
            <Skeleton height={16} width="10%" style={{ marginBottom: '8px' }} />
            <Skeleton height={40} />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <Skeleton height={16} width="15%" style={{ marginBottom: '8px' }} />
            <Skeleton height={80} />
          </div>
          
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <Skeleton height={16} width="12%" style={{ marginBottom: '8px' }} />
              <Skeleton height={40} />
            </div>
            <div style={{ flex: 1 }}>
              <Skeleton height={16} width="10%" style={{ marginBottom: '8px' }} />
              <Skeleton height={40} />
            </div>
          </div>
        </div>

        {/* Words Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Skeleton height={24} width="15%" />
            <Skeleton height={36} width={120} />
          </div>
          
          <WordFormSkeleton count={3} />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Skeleton height={40} width={80} />
          <Skeleton height={40} width={120} />
        </div>
      </form>
    </SkeletonTheme>
  );
}

// Word Form Skeleton for Edit/Create
export function WordFormSkeleton({ count = 3 }) {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} style={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          backgroundColor: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Skeleton height={16} width={16} />
              <Skeleton height={16} width={80} />
            </div>
            <Skeleton height={24} width={24} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <Skeleton height={16} width="40%" style={{ marginBottom: '8px' }} />
              <Skeleton height={36} />
            </div>
            <div>
              <Skeleton height={16} width="50%" style={{ marginBottom: '8px' }} />
              <Skeleton height={36} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <Skeleton height={16} width="45%" style={{ marginBottom: '8px' }} />
              <Skeleton height={36} />
            </div>
            <div>
              <Skeleton height={16} width="35%" style={{ marginBottom: '8px' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <Skeleton height={36} style={{ flex: 1 }} />
                <Skeleton height={36} width={80} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </SkeletonTheme>
  );
}

// Profile Page Skeleton
export function ProfileSkeleton() {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <form className="profile__content">
        <Skeleton height={32} width="20%" style={{ marginBottom: '32px' }} />
        
        {/* Avatar Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
          <Skeleton circle height={80} width={80} />
          <div>
            <Skeleton height={20} width={150} style={{ marginBottom: '8px' }} />
            <Skeleton height={16} width={200} />
          </div>
        </div>

        {/* Form Fields */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} style={{ marginBottom: '24px' }}>
            <Skeleton height={16} width="25%" style={{ marginBottom: '8px' }} />
            <Skeleton height={40} />
          </div>
        ))}

        {/* Teacher Verification Section */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '24px',
          border: '1px solid #e0e0e0'
        }}>
          <Skeleton height={18} width="30%" style={{ marginBottom: '12px' }} />
          <Skeleton height={14} count={2} style={{ marginBottom: '16px' }} />
          <Skeleton height={36} width={150} />
        </div>

        {/* Action Button */}
        <Skeleton height={44} width={120} />
      </form>
    </SkeletonTheme>
  );
}

// ViewClassroom Page Skeleton
export function ViewClassroomSkeleton() {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="manage-classroom-learner__content">
        {/* Classroom Title Skeleton */}
        <div style={{ marginBottom: '24px' }}>
          <Skeleton height={36} width="40%" style={{ marginBottom: '8px' }} />
          <Skeleton height={16} width="25%" />
        </div>

        {/* Menu Tabs Skeleton */}
        <div className="sub-menu-tabs" style={{ marginBottom: '24px' }}>
          <div className="tab-list" style={{ display: 'flex', gap: '16px' }}>
            <Skeleton height={36} width={100} />
            <Skeleton height={36} width={90} />
            <Skeleton height={36} width={140} />
          </div>
        </div>

        {/* Top Bar Skeleton */}
        <div className="list-topbar" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px' 
        }}>
          <Skeleton height={18} width={120} />
          <Skeleton height={32} width={100} />
        </div>

        {/* Assignment Cards Grid Skeleton */}
        <div className="list-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <ViewClassroomCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
}

// ViewClassroom Assignment Card Skeleton
export function ViewClassroomCardSkeleton() {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="vocab-card" style={{
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Title */}
        <Skeleton height={20} width="75%" style={{ marginBottom: '8px' }} />
        
        {/* Description/Exercise Method */}
        <Skeleton height={16} width="90%" style={{ marginBottom: '4px' }} />
        
        {/* Review Progress */}
        <Skeleton height={14} width="30%" style={{ marginBottom: '4px' }} />
        
        {/* Completion Date */}
        <Skeleton height={14} width="45%" style={{ marginBottom: '4px' }} />
        
        {/* Result/Status */}
        <Skeleton height={14} width="25%" style={{ marginBottom: '16px' }} />
        
        {/* Footer */}
        <div className="vocab-footer" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '16px'
        }}>
          <div className="user-block" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Skeleton circle height={32} width={32} />
            <div>
              <Skeleton height={14} width={100} style={{ marginBottom: '4px' }} />
              <Skeleton height={12} width={50} />
            </div>
          </div>
          <Skeleton height={32} width={80} />
        </div>
      </div>
    </SkeletonTheme>
  );
}

// OverviewList Page Skeleton (SCSS-based)
export function OverviewListSkeleton() {
  return (
    <SkeletonTheme baseColor="#fff6e9" highlightColor="#ffe8d1">
      <main className="overview-list__main">
        {/* Header Section */}
        <div className="overview-list__header">
          {/* Title */}
          <Skeleton height={48} width="45%" className="overview-list__title" style={{ marginBottom: '1rem' }} />
          
          {/* Tags */}
          <div className="overview-list__tags" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <Skeleton height={32} width={80} style={{ borderRadius: '999px' }} />
            <Skeleton height={32} width={100} style={{ borderRadius: '999px' }} />
            <Skeleton height={32} width={90} style={{ borderRadius: '999px' }} />
          </div>
          
          {/* Creator */}
          <Skeleton height={16} width="25%" className="overview-list__creator" style={{ marginLeft: '0.5rem' }} />
        </div>
        
        {/* Line Divider */}
        <div className="overview-list__line" />

        {/* Description Section */}
        <section className="overview-list__description" style={{ marginBottom: '3rem' }}>
          <Skeleton height={24} width="15%" style={{ marginBottom: '1rem' }} />
          <Skeleton height={16} count={3} style={{ marginBottom: '0.5rem' }} />
        </section>

        {/* Sample Section */}
        <section className="overview-list__sample" style={{ marginTop: '2rem', marginBottom: '3rem' }}>
          <Skeleton height={24} width="15%" style={{ marginBottom: '1rem' }} />
          
          {/* Sample Table */}
          <div className="sample-table" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="sample-row" style={{
                display: 'flex',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                {/* Term cell */}
                <div className="sample-cell sample-term" style={{
                  backgroundColor: '#F9DDB2',
                  width: '25%',
                  padding: '0.75rem 1rem',
                  borderRight: '1px solid #D5962C'
                }}>
                  <Skeleton height={16} />
                </div>
                
                {/* Phonetics cell */}
                <div className="sample-cell sample-phonetics" style={{
                  backgroundColor: '#F9DDB2',
                  width: '25%',
                  padding: '0.75rem 1rem',
                  borderRight: '1px solid #D5962C'
                }}>
                  <Skeleton height={16} />
                </div>
                
                {/* Definition cell */}
                <div className="sample-cell sample-definition" style={{
                  backgroundColor: '#fff1df',
                  width: '50%',
                  padding: '0.75rem 1rem'
                }}>
                  <Skeleton height={16} />
                </div>
              </div>
            ))}
          </div>
          
          {/* View Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
            <Skeleton height={44} width={180} style={{ borderRadius: '999px' }} />
          </div>
        </section>

        {/* Statistics Section */}
        <section className="overview-list__statistic" style={{ marginBottom: '3rem' }}>
          <Skeleton height={24} width="15%" style={{ marginBottom: '1rem' }} />
          
          {/* Stat Box */}
          <div className="overview-list__stat-box" style={{
            backgroundColor: '#fff6e9',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="overview-list__stat-item" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: index < 3 ? '1rem' : 0
              }}>
                <Skeleton circle height={20} width={20} />
                <Skeleton height={18} width="60%" />
              </div>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="overview-list__actions" style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            <Skeleton height={44} width={120} style={{ borderRadius: '999px' }} />
            <Skeleton height={44} width={120} style={{ borderRadius: '999px' }} />
          </div>
        </section>
      </main>
    </SkeletonTheme>
  );
}
