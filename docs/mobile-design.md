# 모바일 반응형 디자인 가이드

모바일 우선 접근 방식으로 설계된 부동산 매물 조회 앱의 반응형 디자인 전략입니다.

## 📱 모바일 우선 설계 (Mobile First)

### 핵심 원칙
1. **콘텐츠 우선**: 핵심 기능부터 설계
2. **점진적 향상**: 화면 크기에 따라 기능 추가
3. **터치 최적화**: 손가락 조작에 친화적인 UI
4. **성능 최적화**: 모바일 네트워크 환경 고려

## 📏 브레이크포인트 전략

### 디바이스별 브레이크포인트
```css
/* Mobile (기본) - 320px ~ 767px */
@media (max-width: 767px) { }

/* Tablet - 768px ~ 1023px */
@media (min-width: 768px) and (max-width: 1023px) { }

/* Desktop - 1024px ~ 1279px */
@media (min-width: 1024px) and (max-width: 1279px) { }

/* Large Desktop - 1280px+ */
@media (min-width: 1280px) { }
```

### 주요 디바이스 타겟
```yaml
모바일:
  - iPhone SE: 375px
  - iPhone 12/13: 390px
  - iPhone 14 Pro Max: 430px
  - Galaxy S22: 360px

태블릿:
  - iPad Mini: 768px
  - iPad Air: 820px
  - Galaxy Tab S8: 800px

데스크톱:
  - MacBook Air: 1280px
  - 일반 모니터: 1920px
  - 와이드 모니터: 2560px
```

## 🎯 모바일 UI 패턴

### 1. 네비게이션 패턴

#### 햄버거 메뉴 (< 768px)
```html
<nav class="mobile-nav lg:hidden">
  <!-- 헤더 -->
  <div class="nav-header">
    <div class="logo">부동산 매물</div>
    <button class="hamburger-btn" data-action="click->mobile-menu#toggle">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
  
  <!-- 사이드 메뉴 -->
  <div class="mobile-menu hidden" data-mobile-menu-target="menu">
    <a href="#" class="menu-item">홈</a>
    <a href="#" class="menu-item">매물검색</a>
    <a href="#" class="menu-item">관심매물</a>
    <a href="#" class="menu-item">내정보</a>
  </div>
</nav>
```

#### 탭 네비게이션 (768px+)
```html
<nav class="hidden md:flex tab-nav">
  <a href="#" class="tab-item active">매물검색</a>
  <a href="#" class="tab-item">시세정보</a>
  <a href="#" class="tab-item">커뮤니티</a>
</nav>
```

### 2. 필터 UI 패턴

#### 모바일: 바텀 시트 (< 768px)
```html
<div class="bottom-sheet" data-controller="bottom-sheet">
  <!-- 핸들 바 -->
  <div class="bottom-sheet-handle">
    <div class="handle-bar"></div>
  </div>
  
  <!-- 헤더 -->
  <div class="bottom-sheet-header">
    <h3>상세 필터</h3>
    <button class="close-btn">✕</button>
  </div>
  
  <!-- 필터 콘텐츠 -->
  <div class="bottom-sheet-content">
    <!-- 스크롤 가능한 필터 리스트 -->
  </div>
  
  <!-- 고정 액션 바 -->
  <div class="bottom-sheet-actions">
    <button class="btn-reset">초기화</button>
    <button class="btn-apply">적용</button>
  </div>
</div>
```

#### 태블릿: 슬라이드 사이드바 (768px - 1023px)
```html
<div class="tablet-sidebar" data-controller="sidebar">
  <div class="sidebar-overlay" data-action="click->sidebar#close"></div>
  <div class="sidebar-content">
    <!-- 필터 내용 -->
  </div>
</div>
```

#### 데스크톱: 고정 사이드바 (1024px+)
```html
<div class="desktop-sidebar">
  <!-- 항상 표시되는 고정 필터 -->
</div>
```

### 3. 검색 결과 레이아웃

#### 모바일: 단일 컬럼 리스트
```css
.mobile-properties {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-property-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

#### 태블릿: 2컬럼 그리드
```css
@media (min-width: 768px) {
  .tablet-properties {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}
```

#### 데스크톱: 3컬럼 그리드
```css
@media (min-width: 1024px) {
  .desktop-properties {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

## 📐 터치 인터페이스 가이드라인

### 터치 타겟 크기
```css
/* 최소 터치 타겟: 44px × 44px */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

/* 버튼 간격 */
.btn-group {
  display: flex;
  gap: 8px; /* 최소 8px 간격 */
}

/* 큰 터치 영역 */
.large-touch-area {
  padding: 20px;
  margin: 10px 0;
}
```

### 제스처 지원

#### 스와이프 네비게이션
```javascript
// 필터 카테고리 간 스와이프
export default class extends Controller {
  static targets = ["container"]
  
  connect() {
    this.hammer = new Hammer(this.containerTarget);
    this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    this.hammer.on('swipeleft', this.nextCategory.bind(this));
    this.hammer.on('swiperight', this.prevCategory.bind(this));
  }
  
  nextCategory() {
    // 다음 필터 카테고리로 이동
  }
  
  prevCategory() {
    // 이전 필터 카테고리로 이동  
  }
}
```

#### 풀 투 리프레시
```javascript
// 검색 결과 새로고침
export default class extends Controller {
  connect() {
    this.setupPullToRefresh();
  }
  
  setupPullToRefresh() {
    let startY = 0;
    let pullDistance = 0;
    
    this.element.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    });
    
    this.element.addEventListener('touchmove', (e) => {
      if (startY > 0) {
        pullDistance = e.touches[0].clientY - startY;
        if (pullDistance > 0 && pullDistance < 120) {
          // 당기는 애니메이션 표시
          this.showPullIndicator(pullDistance);
        }
      }
    });
    
    this.element.addEventListener('touchend', () => {
      if (pullDistance > 80) {
        this.refreshResults();
      }
      this.hidePullIndicator();
      startY = 0;
      pullDistance = 0;
    });
  }
}
```

## 🎨 모바일 특화 컴포넌트

### 1. 바텀 시트 필터

#### HTML 구조
```html
<div class="bottom-sheet-overlay" data-controller="bottom-sheet">
  <div class="bottom-sheet" data-bottom-sheet-target="sheet">
    <!-- 드래그 핸들 -->
    <div class="drag-handle">
      <div class="handle-bar"></div>
    </div>
    
    <!-- 필터 헤더 -->
    <div class="filter-header">
      <h2>상세 필터</h2>
      <div class="filter-count">3개 조건</div>
    </div>
    
    <!-- 필터 탭 -->
    <div class="filter-tabs" data-controller="tabs">
      <button class="tab active" data-tab="basic">기본</button>
      <button class="tab" data-tab="price">가격</button>
      <button class="tab" data-tab="area">면적</button>
      <button class="tab" data-tab="detail">상세</button>
    </div>
    
    <!-- 필터 콘텐츠 -->
    <div class="filter-content">
      <!-- 동적 필터 내용 -->
    </div>
    
    <!-- 액션 버튼 -->
    <div class="action-bar">
      <button class="btn-outline">초기화</button>
      <button class="btn-primary">매물 보기 (45)</button>
    </div>
  </div>
</div>
```

#### CSS 스타일
```css
.bottom-sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.bottom-sheet-overlay.active {
  opacity: 1;
  visibility: visible;
}

.bottom-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 1rem 1rem 0 0;
  max-height: 90vh;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.bottom-sheet-overlay.active .bottom-sheet {
  transform: translateY(0);
}

.drag-handle {
  display: flex;
  justify-content: center;
  padding: 0.75rem;
  cursor: grab;
}

.handle-bar {
  width: 3rem;
  height: 0.25rem;
  background: #d1d5db;
  border-radius: 0.125rem;
}

.action-bar {
  position: sticky;
  bottom: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
  display: flex;
  gap: 1rem;
}

.action-bar .btn-primary {
  flex: 1;
}
```

### 2. 스와이프 가능한 필터 탭

#### HTML 구조  
```html
<div class="swipe-tabs" data-controller="swipe-tabs">
  <div class="tabs-container" data-swipe-tabs-target="container">
    <div class="tab-content" data-tab="basic">
      <!-- 기본 필터 -->
    </div>
    <div class="tab-content" data-tab="price">
      <!-- 가격 필터 -->
    </div>
    <div class="tab-content" data-tab="area">
      <!-- 면적 필터 -->
    </div>
    <div class="tab-content" data-tab="detail">
      <!-- 상세 필터 -->
    </div>
  </div>
  
  <!-- 탭 인디케이터 -->
  <div class="tab-indicators">
    <div class="indicator active"></div>
    <div class="indicator"></div>
    <div class="indicator"></div>
    <div class="indicator"></div>
  </div>
</div>
```

#### JavaScript 제어
```javascript
export default class extends Controller {
  static targets = ["container", "indicator"]
  
  connect() {
    this.currentIndex = 0;
    this.totalTabs = 4;
    this.setupSwipeGestures();
  }
  
  setupSwipeGestures() {
    let startX = 0;
    let currentX = 0;
    let isMoving = false;
    
    this.containerTarget.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isMoving = true;
    });
    
    this.containerTarget.addEventListener('touchmove', (e) => {
      if (!isMoving) return;
      currentX = e.touches[0].clientX;
      const diffX = currentX - startX;
      
      // 실시간 이동 효과
      this.containerTarget.style.transform = 
        `translateX(${-this.currentIndex * 100 + (diffX / this.containerTarget.offsetWidth) * 100}%)`;
    });
    
    this.containerTarget.addEventListener('touchend', () => {
      if (!isMoving) return;
      
      const diffX = currentX - startX;
      const threshold = 50;
      
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0 && this.currentIndex > 0) {
          this.currentIndex--;
        } else if (diffX < 0 && this.currentIndex < this.totalTabs - 1) {
          this.currentIndex++;
        }
      }
      
      this.updateTabPosition();
      isMoving = false;
    });
  }
  
  updateTabPosition() {
    this.containerTarget.style.transform = 
      `translateX(-${this.currentIndex * 100}%)`;
      
    // 인디케이터 업데이트
    this.indicatorTargets.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
  }
}
```

### 3. 끈적한 액션 바 (Sticky Action Bar)

#### HTML 구조
```html
<div class="sticky-action-bar" data-controller="sticky-bar">
  <!-- 필터 요약 -->
  <div class="filter-summary">
    <span class="filter-count">3개 조건</span>
    <div class="filter-tags">
      <span class="tag">아파트</span>
      <span class="tag">강남구</span>
      <span class="tag">+1</span>
    </div>
  </div>
  
  <!-- 액션 버튼 -->
  <div class="actions">
    <button class="btn-filter" data-action="click->bottom-sheet#open">
      <svg><!-- 필터 아이콘 --></svg>
      필터
    </button>
    <button class="btn-search">
      검색 (45)
    </button>
  </div>
</div>
```

#### CSS 스타일
```css
.sticky-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
  z-index: 40;
  transform: translateY(0);
  transition: transform 0.3s ease;
}

/* 스크롤 시 숨김/표시 */
.sticky-action-bar.hidden {
  transform: translateY(100%);
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;
}

.btn-filter {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.btn-search {
  flex: 2;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
}
```

## 📊 성능 최적화

### 이미지 최적화
```html
<!-- 반응형 이미지 -->
<picture>
  <source media="(max-width: 767px)" srcset="image-mobile.webp">
  <source media="(max-width: 1023px)" srcset="image-tablet.webp">
  <source media="(min-width: 1024px)" srcset="image-desktop.webp">
  <img src="image-mobile.jpg" alt="매물 사진" loading="lazy">
</picture>

<!-- 매물 카드 이미지 -->
<img src="property-thumb.jpg" 
     alt="아파트 외관"
     loading="lazy"
     width="300" 
     height="200"
     style="aspect-ratio: 3/2;">
```

### 가상 스크롤링
```javascript
// 대량의 매물 리스트를 위한 가상 스크롤
export default class extends Controller {
  static values = { 
    itemHeight: Number,
    containerHeight: Number,
    totalItems: Number 
  }
  
  connect() {
    this.visibleStart = 0;
    this.visibleEnd = Math.ceil(this.containerHeightValue / this.itemHeightValue);
    this.setupScrollListener();
    this.renderVisibleItems();
  }
  
  setupScrollListener() {
    this.element.addEventListener('scroll', 
      this.throttle(this.onScroll.bind(this), 16)
    );
  }
  
  onScroll() {
    const scrollTop = this.element.scrollTop;
    const newVisibleStart = Math.floor(scrollTop / this.itemHeightValue);
    const newVisibleEnd = Math.min(
      newVisibleStart + Math.ceil(this.containerHeightValue / this.itemHeightValue),
      this.totalItemsValue
    );
    
    if (newVisibleStart !== this.visibleStart || newVisibleEnd !== this.visibleEnd) {
      this.visibleStart = newVisibleStart;
      this.visibleEnd = newVisibleEnd;
      this.renderVisibleItems();
    }
  }
  
  throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}
```

### 지연 로딩
```javascript
// Intersection Observer로 지연 로딩
export default class extends Controller {
  connect() {
    this.observer = new IntersectionObserver(
      this.onIntersect.bind(this),
      { rootMargin: '50px' }
    );
    
    this.element.querySelectorAll('.lazy-load').forEach(el => {
      this.observer.observe(el);
    });
  }
  
  onIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadContent(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }
  
  loadContent(element) {
    // 실제 컨텐츠 로딩
    if (element.dataset.src) {
      element.src = element.dataset.src;
    }
  }
}
```

## 🔍 테스트 전략

### 기기별 테스트
```yaml
모바일_테스트:
  - iPhone_SE_375px: 최소 지원 화면
  - iPhone_12_390px: 일반적인 모바일
  - iPhone_14_Pro_Max_430px: 큰 모바일
  - Galaxy_S22_360px: 안드로이드 표준

태블릿_테스트:
  - iPad_Mini_768px: 작은 태블릿
  - iPad_Air_820px: 일반 태블릿
  - iPad_Pro_1024px: 큰 태블릿

데스크톱_테스트:
  - MacBook_Air_1280px: 소형 노트북
  - 일반_모니터_1920px: 표준 데스크톱
  - 와이드_모니터_2560px: 대형 모니터
```

### 성능 메트릭
- **첫 콘텐츠풀 페인트 (FCP)**: < 2초
- **최대 콘텐츠풀 페인트 (LCP)**: < 3초  
- **첫 입력 지연 (FID)**: < 100ms
- **누적 레이아웃 이동 (CLS)**: < 0.1

---

📅 **최종 업데이트**: 2024년 현재  
📝 **버전**: 1.0.0