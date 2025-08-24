# UI/UX 디자인 가이드라인

부동산 매물 조회 앱의 사용자 경험 및 인터페이스 디자인 표준입니다.

## 🎯 디자인 원칙

### 1. 사용자 중심 설계 (User-Centered Design)
- **직관성**: 학습 없이도 사용 가능한 인터페이스
- **효율성**: 최소 클릭으로 원하는 결과 도달
- **일관성**: 전체 앱에서 동일한 패턴 사용

### 2. 정보 계층 구조 (Information Hierarchy)
- **중요도 순**: 거래유형 → 지역 → 가격 → 기타 조건
- **시각적 강조**: 중요한 정보일수록 크고 진한 색상
- **그룹핑**: 관련 필터들을 논리적으로 묶어서 표시

### 3. 접근성 우선 (Accessibility First)  
- **WCAG 2.1 AA 준수**: 색각 이상, 시각 장애 고려
- **키보드 내비게이션**: 마우스 없이도 모든 기능 사용 가능
- **명료한 텍스트**: 14px 이상, 충분한 대비율

## 🎨 비주얼 디자인 시스템

### 색상 팔레트

#### Primary Colors (메인 컬러)
```css
--blue-50: #eff6ff;    /* 배경 */
--blue-100: #dbeafe;   /* 호버 배경 */  
--blue-500: #3b82f6;   /* 메인 액션 */
--blue-600: #2563eb;   /* 버튼 */
--blue-700: #1d4ed8;   /* 액티브 */
--blue-900: #1e3a8a;   /* 텍스트 강조 */
```

#### Semantic Colors (의미 컬러)
```css
--green-50: #f0fdf4;   /* 성공 배경 */
--green-600: #16a34a;  /* 성공 텍스트 */
--red-50: #fef2f2;     /* 에러 배경 */ 
--red-600: #dc2626;    /* 에러 텍스트 */
--yellow-50: #fefce8;  /* 경고 배경 */
--yellow-600: #ca8a04; /* 경고 텍스트 */
```

#### Neutral Colors (중성 컬러)
```css
--gray-50: #f9fafb;    /* 페이지 배경 */
--gray-100: #f3f4f6;   /* 카드 배경 */
--gray-300: #d1d5db;   /* 테두리 */
--gray-500: #6b7280;   /* 보조 텍스트 */
--gray-700: #374151;   /* 일반 텍스트 */
--gray-900: #111827;   /* 제목 텍스트 */
```

### 타이포그래피

#### 폰트 패밀리
```css
font-family: 
  'Pretendard', 'Noto Sans KR', 
  -apple-system, BlinkMacSystemFont, 
  system-ui, sans-serif;
```

#### 텍스트 스케일
```css
/* 제목 */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }      /* 24px */
.text-xl  { font-size: 1.25rem; line-height: 1.75rem; }  /* 20px */

/* 본문 */
.text-lg   { font-size: 1.125rem; line-height: 1.75rem; } /* 18px */
.text-base { font-size: 1rem; line-height: 1.5rem; }      /* 16px */
.text-sm   { font-size: 0.875rem; line-height: 1.25rem; } /* 14px */
.text-xs   { font-size: 0.75rem; line-height: 1rem; }     /* 12px */
```

#### 폰트 두께
```css
.font-light    { font-weight: 300; } /* 라벨 */
.font-normal   { font-weight: 400; } /* 본문 */
.font-medium   { font-weight: 500; } /* 강조 텍스트 */
.font-semibold { font-weight: 600; } /* 부제목 */
.font-bold     { font-weight: 700; } /* 제목 */
```

### 간격 시스템 (8px 그리드 기반)

#### 내부 여백 (Padding)
```css
.p-1  { padding: 0.25rem; }  /* 4px */
.p-2  { padding: 0.5rem; }   /* 8px */
.p-3  { padding: 0.75rem; }  /* 12px */
.p-4  { padding: 1rem; }     /* 16px */
.p-6  { padding: 1.5rem; }   /* 24px */
.p-8  { padding: 2rem; }     /* 32px */
```

#### 외부 여백 (Margin)
```css
.mb-2 { margin-bottom: 0.5rem; }  /* 8px */
.mb-4 { margin-bottom: 1rem; }    /* 16px */ 
.mb-6 { margin-bottom: 1.5rem; }  /* 24px */
.mb-8 { margin-bottom: 2rem; }    /* 32px */
```

#### 요소 간격 (Gap)
```css
.gap-2 { gap: 0.5rem; }   /* 8px - 인접 요소 */
.gap-4 { gap: 1rem; }     /* 16px - 관련 요소 */
.gap-6 { gap: 1.5rem; }   /* 24px - 섹션 간 */
```

## 🧩 컴포넌트별 디자인 가이드

### 버튼 (Button)

#### 기본 스타일
```css
/* Primary Button */
.btn-primary {
  background: var(--blue-600);
  color: white;
  border: none;
  border-radius: 0.5rem; /* 8px */
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--blue-700);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}
```

#### 크기 변형
```css
.btn-sm  { padding: 0.5rem 1rem; font-size: 0.875rem; }   /* 작은 버튼 */
.btn-base { padding: 0.75rem 1.5rem; font-size: 1rem; }   /* 기본 버튼 */
.btn-lg  { padding: 1rem 2rem; font-size: 1.125rem; }     /* 큰 버튼 */
```

#### 상태별 스타일
```css
.btn:disabled {
  background: var(--gray-300);
  color: var(--gray-500);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-loading {
  position: relative;
  color: transparent;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

### 입력 필드 (Input Field)

#### 기본 스타일  
```css
.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: var(--blue-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

#### 에러 상태
```css
.input-field.error {
  border-color: var(--red-600);
}

.input-field.error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}
```

### 카드 (Card)

#### 매물 카드 스타일
```css
.property-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s;
}

.property-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}
```

### 필터 패널 (Filter Panel)

#### 섹션 구분
```css
.filter-section {
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-100);
}

.filter-section:last-child {
  border-bottom: none;
}

.filter-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 1rem;
}
```

## 📱 반응형 디자인

### 브레이크포인트
```css
/* Mobile First 접근 */
/* Default: Mobile (< 768px) */

/* Tablet */
@media (min-width: 768px) {
  /* md: 클래스 */
}

/* Desktop */  
@media (min-width: 1024px) {
  /* lg: 클래스 */
}

/* Large Desktop */
@media (min-width: 1280px) {
  /* xl: 클래스 */  
}
```

### 레이아웃 패턴

#### 모바일 (< 768px)
```css
.mobile-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 전체 화면 필터 모달 */
.mobile-filter-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 50;
}
```

#### 태블릿 (768px - 1023px)  
```css
.tablet-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

/* 접이식 사이드바 */
.collapsible-sidebar {
  transform: translateX(-100%);
  transition: transform 0.3s;
}

.collapsible-sidebar.open {
  transform: translateX(0);
}
```

#### 데스크톱 (1024px+)
```css
.desktop-layout {
  display: grid;
  grid-template-columns: 320px 1fr 300px;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* 고정 사이드바 */
.fixed-sidebar {
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}
```

## 🎭 인터랙션 및 애니메이션

### 호버 효과
```css
.interactive:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-out;
}

.card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease-out;
}
```

### 포커스 효과
```css
.focusable:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  border-radius: 0.5rem;
}
```

### 로딩 애니메이션
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading-skeleton {
  background: var(--gray-200);
  border-radius: 0.5rem;
  animation: pulse 2s infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

### 페이드 인/아웃
```css
.fade-enter {
  opacity: 0;
  transform: translateY(1rem);
}

.fade-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease-out;
}

.fade-exit {
  opacity: 1;
}

.fade-exit-active {
  opacity: 0;
  transform: translateY(-1rem);
  transition: all 0.3s ease-in;
}
```

## 🔍 사용성 가이드라인

### 터치 타겟 크기 (모바일)
- **최소 크기**: 44px × 44px (Apple HIG)
- **권장 크기**: 48dp × 48dp (Material Design)
- **간격**: 터치 타겟 간 최소 8px 여백

### 텍스트 가독성
- **최소 크기**: 14px (모바일), 16px (데스크톱)
- **줄 간격**: 1.4 ~ 1.6 배수
- **대비율**: 4.5:1 이상 (WCAG AA)

### 에러 처리
```css
.error-message {
  color: var(--red-600);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-message::before {
  content: '⚠️';
  flex-shrink: 0;
}
```

### 성공 피드백
```css
.success-message {
  background: var(--green-50);
  color: var(--green-800);
  border: 1px solid var(--green-200);
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
}
```

## 🌙 다크 모드 지원 (선택사항)

### CSS 변수 활용
```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #111827;
  --border-color: #e5e7eb;
}

[data-theme="dark"] {
  --bg-primary: #111827;
  --text-primary: #f9fafb;
  --border-color: #374151;
}

.card {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
```

## 📐 그리드 시스템

### 12컬럼 그리드 (데스크톱)
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -0.5rem;
}

.col {
  padding: 0 0.5rem;
}

.col-1  { width: 8.333%; }
.col-2  { width: 16.667%; }
.col-3  { width: 25%; }
.col-4  { width: 33.333%; }
.col-6  { width: 50%; }
.col-12 { width: 100%; }
```

### 매물 카드 레이아웃
```css
/* 모바일: 1열 */
.properties-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

/* 태블릿: 2열 */
@media (min-width: 768px) {
  .properties-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* 데스크톱: 3열 */
@media (min-width: 1024px) {
  .properties-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

## ✅ 접근성 체크리스트

### 키보드 내비게이션
- [ ] Tab 키로 모든 인터랙티브 요소 접근 가능
- [ ] Enter/Space로 버튼 활성화
- [ ] ESC로 모달 닫기
- [ ] 화살표 키로 슬라이더 조작

### 스크린 리더 지원  
- [ ] 모든 이미지에 alt 속성
- [ ] 폼 요소에 적절한 label
- [ ] 페이지 구조에 헤딩 태그 사용
- [ ] 동적 콘텐츠 변경 시 알림

### 색상 및 대비
- [ ] 색상만으로 정보 전달하지 않음
- [ ] 텍스트 대비율 4.5:1 이상
- [ ] 포커스 표시자 명확히 표시

---

📅 **최종 업데이트**: 2024년 현재  
📝 **버전**: 1.0.0