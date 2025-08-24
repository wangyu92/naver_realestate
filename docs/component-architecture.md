# 컴포넌트 아키텍처

부동산 매물 조회 앱의 컴포넌트 설계 시스템 및 아키텍처 가이드입니다.

## 🏗️ 컴포넌트 계층 구조

### 컴포넌트 분류
```
Components/
├── 🟦 Atoms (원자 컴포넌트)
│   ├── _button.html.erb
│   ├── _input_field.html.erb  
│   ├── _badge.html.erb
│   └── _alert.html.erb
├── 🟩 Molecules (분자 컴포넌트)
│   ├── _range_slider.html.erb
│   ├── _unit_toggle.html.erb
│   ├── _direction_picker.html.erb
│   └── _floor_selector.html.erb
├── 🟨 Organisms (유기체 컴포넌트)  
│   ├── _location_hierarchy.html.erb
│   ├── _multi_checkbox.html.erb
│   ├── _advanced_filter_panel.html.erb
│   └── _property_card.html.erb
└── 🟪 Templates (템플릿)
    ├── properties/index.html.erb
    └── components/index.html.erb
```

## 📦 기존 컴포넌트 분석

### Atoms (원자 컴포넌트) - 재활용

#### _button.html.erb ✅
```erb
<!-- 사용법 -->
<%= render 'components/button', 
    text: '검색', 
    variant: 'primary|secondary|outline|success|danger',
    size: 'sm|base|lg',
    disabled: false,
    loading: false %>
```

**사용 위치**: 필터 적용, 초기화, 검색 버튼

#### _input_field.html.erb ✅  
```erb
<!-- 사용법 -->
<%= render 'components/input_field',
    label: '검색어',
    type: 'text|email|password|search',
    name: 'query',
    placeholder: '지역명으로 검색',
    required: true,
    error: '오류 메시지',
    icon: 'search' %>
```

**사용 위치**: 지역 검색, 가격 직접 입력, 층수 입력

#### _select_field.html.erb ✅
```erb
<!-- 사용법 -->
<%= render 'components/select_field',
    label: '거래유형',
    name: 'transaction_type',
    options: [
      { label: '매매', value: 'sale' },
      { label: '전세', value: 'jeonse' }
    ],
    placeholder: '선택하세요' %>
```

**사용 위치**: 거래유형, 주구조 선택

#### _badge.html.erb ✅
```erb
<!-- 사용법 --> 
<%= render 'components/badge',
    text: '신축',
    variant: 'primary|secondary|success|warning|danger|gray',
    size: 'sm|base' %>
```

**사용 위치**: 선택된 필터 표시, 매물 태그

### Organisms (유기체 컴포넌트) - 확장

#### _property_card.html.erb ✅ (확장 필요)
현재 기본적인 매물 카드가 있으나 새로운 필터 정보 표시 필요

**추가해야 할 정보:**
- 층수 정보 (5/15층)
- 방향 정보 (남동향)  
- 주차 정보 (1.2대/세대)
- 엘리베이터 유무
- 건축년도

#### _filter_sidebar.html.erb ⚠️ (대폭 확장 필요)
현재는 기본적인 필터만 있음. 18개 필터로 확장 필요.

## 🆕 새로 개발할 컴포넌트

### Molecules (분자 컴포넌트)

#### 1. _range_slider.html.erb 🆕
**목적**: 가격, 면적, 년도 범위 선택
```erb
<%= render 'components/range_slider',
    label: '매매가',
    name: 'price',
    min: 0,
    max: 1000000000,
    step: 1000000,
    value_min: 100000000,
    value_max: 500000000,
    unit: '원',
    format: 'currency|area|year',
    show_inputs: true %>
```

**Stimulus Controller**: `range_slider_controller.js`
```javascript  
export default class extends Controller {
  static targets = ["slider", "minInput", "maxInput", "minLabel", "maxLabel"]
  static values = { min: Number, max: Number, step: Number }
  
  connect() { /* 슬라이더 초기화 */ }
  updateValues(event) { /* 값 업데이트 */ }
  formatValue(value) { /* 값 포맷팅 */ }
}
```

#### 2. _unit_toggle.html.erb 🆕  
**목적**: 평/㎡ 단위 전환
```erb
<%= render 'components/unit_toggle',
    current_unit: 'pyeong|sqm',
    name: 'area_unit',
    labels: { pyeong: '평', sqm: '㎡' } %>
```

**변환 로직**: 1평 = 3.3058㎡

#### 3. _direction_picker.html.erb 🆕
**목적**: 8방위 선택 (나침반 스타일)
```erb
<%= render 'components/direction_picker',
    name: 'direction',
    selected: nil,
    style: 'compass|list' %>
```

**UI 디자인**:
```
    N
NW  +  NE
W   +   E  
SW  +  SE
    S
```

#### 4. _floor_selector.html.erb 🆕
**목적**: 현재층/전체층 입력
```erb
<%= render 'components/floor_selector',
    name: 'floors',
    multiple: true,
    placeholder: '예: 5/15, 10-12/20' %>
```

**입력 형식**: 
- 단일: "5/15" (5층, 총 15층)
- 범위: "10-15/20" (10~15층, 총 20층)

#### 5. _ratio_slider.html.erb 🆕
**목적**: 주차비율 슬라이더 (0.0 ~ 1.0)
```erb
<%= render 'components/ratio_slider',
    name: 'parking_ratio',
    min: 0.0,
    max: 1.0, 
    step: 0.1,
    labels: {
      '0.0': '주차불가',
      '0.5': '2세대당 1대',
      '1.0': '세대당 1대 이상'
    } %>
```

### Organisms (유기체 컴포넌트)

#### 1. _location_hierarchy.html.erb 🆕
**목적**: 계층적 지역 선택기
```erb
<%= render 'components/location_hierarchy',
    locations: @locations,
    selected: [],
    multiple: true,
    search: true,
    modal: false %>
```

**주요 기능**:
- 3단계 계층 (시/도 → 구/군 → 동/면)
- 다중 선택 가능
- 실시간 검색
- 체크박스 상태 관리 (전체/부분/없음)

#### 2. _multi_checkbox.html.erb 🆕
**목적**: 매물유형 다중 선택
```erb
<%= render 'components/multi_checkbox',
    label: '매물유형',
    name: 'property_types',
    options: @property_types,
    columns: 3,
    select_all: true %>
```

**레이아웃**: 3컬럼 그리드로 18개 옵션 표시

#### 3. _advanced_filter_panel.html.erb 🆕
**목적**: 18개 필터 통합 패널
```erb
<%= render 'components/advanced_filter_panel',
    filters: @filter_options,
    layout: 'sidebar|modal',
    collapsible: true %>
```

**구조**:
```erb
<div class="filter-panel">
  <!-- 기본 조건 -->
  <section class="filter-section">
    <h3>기본 조건</h3>
    <%= render 'components/select_field' %> <!-- 거래유형 -->
    <%= render 'components/multi_checkbox' %> <!-- 매물유형 -->
  </section>
  
  <!-- 가격 조건 -->  
  <section class="filter-section">
    <h3>가격 조건</h3>
    <%= render 'components/range_slider' %> <!-- 매매가/보증금 -->
    <%= render 'components/range_slider' %> <!-- 월세 -->
  </section>
  
  <!-- 면적 조건 -->
  <section class="filter-section">
    <h3>면적 조건</h3>
    <div class="area-filter">
      <%= render 'components/unit_toggle' %>
      <%= render 'components/range_slider' %> <!-- 공급면적 -->
      <%= render 'components/range_slider' %> <!-- 전용면적 -->
    </div>
  </section>
  
  <!-- 기타 조건들... -->
</div>
```

## 🎨 디자인 시스템

### 색상 팔레트
```css
:root {
  /* Primary Colors */
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  
  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b; 
  --color-error: #ef4444;
  
  /* Neutral Colors */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-500: #6b7280;
  --color-gray-900: #111827;
}
```

### 타이포그래피
```css
/* 텍스트 크기 */
.text-xs { font-size: 0.75rem; }    /* 12px */
.text-sm { font-size: 0.875rem; }   /* 14px */  
.text-base { font-size: 1rem; }     /* 16px */
.text-lg { font-size: 1.125rem; }   /* 18px */
.text-xl { font-size: 1.25rem; }    /* 20px */

/* 폰트 굵기 */
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
```

### 간격 시스템  
```css
/* 패딩/마진 */
.p-2 { padding: 0.5rem; }   /* 8px */
.p-3 { padding: 0.75rem; }  /* 12px */
.p-4 { padding: 1rem; }     /* 16px */
.p-6 { padding: 1.5rem; }   /* 24px */

/* 갭 */
.gap-2 { gap: 0.5rem; }     /* 8px */
.gap-4 { gap: 1rem; }       /* 16px */
.gap-6 { gap: 1.5rem; }     /* 24px */
```

## 🔄 상태 관리 패턴

### Stimulus 값 관리
```javascript
// 필터 상태 중앙 관리
export default class extends Controller {
  static values = {
    filters: Object,           // 모든 필터 상태
    selectedLocations: Array,  // 선택된 지역들
    priceRange: Array         // 가격 범위
  }
  
  // 필터 변경 시 호출
  updateFilter(filterName, value) {
    this.filtersValue = {
      ...this.filtersValue,
      [filterName]: value
    };
    this.applyFilters();
  }
}
```

### 컴포넌트 간 통신
```javascript
// 이벤트 기반 통신
this.dispatch('filterChanged', { 
  detail: { 
    name: 'transaction_type', 
    value: 'sale' 
  } 
});

// 다른 컴포넌트에서 수신
filterChanged(event) {
  const { name, value } = event.detail;
  this.updateRelatedFilters(name, value);
}
```

## 📱 반응형 컴포넌트 패턴

### 브레이크포인트별 클래스
```erb
<div class="
  <!-- Mobile -->
  p-4 text-sm
  <!-- Tablet -->  
  md:p-6 md:text-base
  <!-- Desktop -->
  lg:p-8 lg:text-lg
">
```

### 조건부 렌더링
```erb
<!-- 데스크톱용 -->
<div class="hidden lg:block">
  <%= render 'components/advanced_filter_panel', layout: 'sidebar' %>
</div>

<!-- 모바일용 -->
<div class="lg:hidden">
  <%= render 'components/advanced_filter_panel', layout: 'modal' %>
</div>
```

## 🧪 컴포넌트 테스팅 전략

### Unit Tests (Component)
```ruby
# test/components/range_slider_test.rb
class RangeSliderTest < ViewComponent::TestCase
  test "renders with correct attributes" do
    render_inline RangeSlider.new(
      min: 0, max: 1000000, value_min: 100000
    )
    
    assert_selector 'input[type="range"]'
    assert_selector '.range-values'
  end
end
```

### Integration Tests (Stimulus)
```javascript  
// test/javascript/range_slider_controller.test.js
describe('RangeSliderController', () => {
  test('updates values on slider change', () => {
    // Stimulus controller 테스트
  });
});
```

## 🚀 성능 최적화

### 지연 로딩
```erb
<!-- 초기에는 숨김, 필요시 로드 -->
<div data-controller="lazy-load" 
     data-lazy-load-url="/components/advanced_filters">
  <div class="loading-spinner">로딩 중...</div>
</div>
```

### 메모이제이션
```ruby
# 컴포넌트 캐싱
Rails.cache.fetch("filter_options_#{current_user.id}", expires_in: 1.hour) do
  generate_filter_options
end
```

### 번들 최적화
```javascript
// 필터 관련 JS만 따로 번들링
import('./filters') // 동적 import로 필요시에만 로드
```

## 📋 컴포넌트 체크리스트

### 개발 완료 기준
- [ ] **기능성**: 모든 요구사항 구현
- [ ] **접근성**: WCAG 2.1 AA 준수  
- [ ] **반응형**: 3개 브레이크포인트 지원
- [ ] **성능**: Lighthouse 90+ 스코어
- [ ] **테스팅**: 80%+ 코드 커버리지
- [ ] **문서화**: 사용법 및 예제 완비

### 품질 검증
- [ ] **Cross-browser**: Chrome, Firefox, Safari, Edge
- [ ] **Mobile**: iOS Safari, Android Chrome
- [ ] **Accessibility**: 스크린리더, 키보드 내비게이션
- [ ] **Performance**: 첫 렌더링 3초 이내

---

📅 **최종 업데이트**: 2024년 현재  
📝 **버전**: 1.0.0