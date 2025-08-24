# 구현 전략 로드맵

부동산 매물 조회 앱의 단계별 개발 계획 및 구현 전략입니다.

## 🎯 개발 목표

### 핵심 목표
1. **완전한 필터 시스템**: 18개 필터로 정밀한 매물 검색
2. **직관적인 UX**: 사용자가 쉽게 원하는 매물을 찾을 수 있는 인터페이스
3. **반응형 디자인**: 모든 기기에서 최적의 경험 제공
4. **확장 가능성**: 향후 기능 추가를 고려한 유연한 아키텍처

### 성공 메트릭
- **사용성**: 필터 설정 완료까지 평균 2분 이내
- **성능**: 페이지 로딩 속도 3초 이내
- **접근성**: WCAG 2.1 AA 준수
- **반응성**: 모든 주요 기기에서 정상 작동

## 📅 단계별 개발 계획

### Phase 1: 기반 구축 (1주차)
**목표**: 프로젝트 기반 설정 및 기본 구조 구축

#### 1.1 프로젝트 설정 ✅
- [x] Rails 8.0.2+ 환경 확인
- [x] 문서화 시스템 구축 (`/docs/` 폴더)
- [x] 기존 컴포넌트 분석 및 정리
- [x] 개발 가이드라인 수립

#### 1.2 데이터 모델링
```ruby
# 필터 옵션을 위한 상수 정의
class PropertyFilter
  TRANSACTION_TYPES = %w[sale jeonse monthly short_term].freeze
  
  PROPERTY_TYPES = %w[
    apartment officetel villa apartment_presale officetel_presale
    reconstruction country_house single_multi_house commercial_house
    hanok redevelopment studio commercial office factory_warehouse
    building land knowledge_industry_center
  ].freeze
  
  DIRECTIONS = %w[east west south north southeast southwest northeast northwest].freeze
  
  STRUCTURES = %w[reinforced_concrete steel_frame masonry wood_frame other].freeze
end
```

#### 1.3 PropertiesController 구축
```ruby
class PropertiesController < ApplicationController
  before_action :setup_filter_options
  
  def index
    @properties = Property.all
    @properties = apply_filters(@properties) if has_filters?
    @properties = @properties.page(params[:page])
  end
  
  private
  
  def setup_filter_options
    @filter_options = {
      transaction_types: build_transaction_type_options,
      property_types: PropertyFilter::PROPERTY_TYPES,
      locations: build_location_hierarchy,
      price_ranges: build_price_ranges,
      # ... 기타 필터 옵션들
    }
  end
end
```

### Phase 2: 핵심 컴포넌트 개발 (2-3주차)
**목표**: 18개 필터 시스템 완성

#### 2.1 범용 컴포넌트 개발
- [ ] `_range_slider.html.erb` - 가격/면적/년도 범위
- [ ] `_unit_toggle.html.erb` - 평/㎡ 단위 전환
- [ ] `_ratio_slider.html.erb` - 주차비율 슬라이더

**개발 우선순위**:
1. **범위 슬라이더** (가장 많이 사용됨)
2. **단위 토글** (면적 필터에 필수)
3. **비율 슬라이더** (특수 용도)

#### 2.2 필터별 구현 계획

**1단계: 기본 필터 (4개)**
```erb
<!-- 거래유형 -->
<%= render 'components/select_field',
    label: '거래유형',
    name: 'transaction_type',
    options: @filter_options[:transaction_types] %>

<!-- 매물유형 -->
<%= render 'components/multi_checkbox',
    label: '매물유형',
    name: 'property_types',
    options: @filter_options[:property_types] %>
```

**2단계: 가격 필터 (3개)**
```erb
<!-- 매매가/보증금 -->
<%= render 'components/range_slider',
    label: price_label_for(@transaction_type),
    name: 'price',
    min: 0,
    max: 10_000_000_000,
    format: 'currency' %>
```

**3단계: 면적 필터 (2개)**
```erb
<!-- 공급면적 -->
<div class="area-filter-group">
  <%= render 'components/unit_toggle',
      name: 'area_unit',
      current: 'pyeong' %>
  <%= render 'components/range_slider',
      label: '공급면적',
      name: 'supply_area',
      format: 'area',
      unit_toggle: true %>
</div>
```

#### 2.3 Stimulus 컨트롤러 개발

**range_slider_controller.js**
```javascript
export default class extends Controller {
  static targets = ["slider", "minInput", "maxInput", "display"]
  static values = { 
    min: Number, 
    max: Number, 
    step: Number,
    format: String 
  }
  
  connect() {
    this.initializeSlider();
    this.updateDisplay();
  }
  
  initializeSlider() {
    // 더블 슬라이더 초기화
    this.slider = new DoubleRangeSlider(this.sliderTarget, {
      min: this.minValue,
      max: this.maxValue,
      step: this.stepValue,
      onUpdate: this.handleSliderChange.bind(this)
    });
  }
  
  handleSliderChange(minVal, maxVal) {
    this.minInputTarget.value = minVal;
    this.maxInputTarget.value = maxVal;
    this.updateDisplay();
    this.dispatchFilterChange();
  }
  
  formatValue(value) {
    switch (this.formatValue) {
      case 'currency':
        return this.formatCurrency(value);
      case 'area':
        return this.formatArea(value);
      default:
        return value.toLocaleString();
    }
  }
}
```

### Phase 3: 지역 선택 시스템 (4주차)
**목표**: 계층적 지역 선택 완성

#### 3.1 지역 데이터 구조화
```ruby
# config/location_data.rb
module LocationData
  REGIONS = {
    "서울특별시" => {
      "강남구" => ["역삼동", "삼성동", "논현동", "압구정동", "신사동", "청담동", "대치동", "개포동", "도곡동", "수서동", "일원동", "세곡동"],
      "서초구" => ["서초동", "잠원동", "반포동", "방배동", "양재동", "내곡동"],
      # ... 모든 구/동
    },
    "경기도" => {
      "안산시" => {
        "상록구" => ["사동", "본오동", "부곡동", "월피동", "성포동"],
        "단원구" => ["고잔동", "와동", "원곡동", "신길동", "선부동"]
      }
      # ... 모든 시/군/구/동
    }
    # ... 모든 시/도
  }.freeze
end
```

#### 3.2 계층적 선택 UI
```erb
<!-- _location_hierarchy.html.erb -->
<div class="location-hierarchy" data-controller="location-hierarchy">
  <!-- 검색 박스 -->
  <div class="search-section">
    <%= render 'components/input_field',
        placeholder: '지역명으로 검색',
        data: { 
          location_hierarchy_target: 'searchInput',
          action: 'input->location-hierarchy#search'
        } %>
  </div>
  
  <!-- 계층적 트리 -->
  <div class="hierarchy-tree" data-location-hierarchy-target="tree">
    <% @locations.each do |region_name, districts| %>
      <div class="region-node" data-region="<%= region_name %>">
        <!-- 지역 체크박스 -->
        <label class="region-label">
          <input type="checkbox" 
                 data-action="change->location-hierarchy#toggleRegion"
                 data-region="<%= region_name %>">
          <span><%= region_name %></span>
          <button class="expand-btn" data-action="click->location-hierarchy#toggleExpand">▶</button>
        </label>
        
        <!-- 시/군/구 리스트 -->
        <div class="districts hidden">
          <!-- 동적으로 생성 -->
        </div>
      </div>
    <% end %>
  </div>
  
  <!-- 선택된 지역 표시 -->
  <div class="selected-locations" data-location-hierarchy-target="selected">
    <!-- 동적 태그 -->
  </div>
</div>
```

#### 3.3 검색 및 필터링 로직
```javascript
// location_hierarchy_controller.js
export default class extends Controller {
  search(event) {
    const query = event.target.value.toLowerCase();
    
    if (query.length < 2) {
      this.showAllLocations();
      return;
    }
    
    const matches = this.findMatches(query);
    this.displaySearchResults(matches);
  }
  
  findMatches(query) {
    const results = [];
    
    Object.entries(this.locationData).forEach(([region, districts]) => {
      // 지역명 매치
      if (region.toLowerCase().includes(query)) {
        results.push({ type: 'region', path: region });
      }
      
      // 구/군 매치
      Object.entries(districts).forEach(([district, dongs]) => {
        if (district.toLowerCase().includes(query)) {
          results.push({ type: 'district', path: `${region} > ${district}` });
        }
        
        // 동/면 매치
        dongs.forEach(dong => {
          if (dong.toLowerCase().includes(query)) {
            results.push({ 
              type: 'dong', 
              path: `${region} > ${district} > ${dong}`,
              value: `${region} ${district} ${dong}`
            });
          }
        });
      });
    });
    
    return results;
  }
}
```

### Phase 4: 메인 인터페이스 통합 (5주차)
**목표**: 필터와 검색 결과 통합

#### 4.1 메인 검색 페이지
```erb
<!-- app/views/properties/index.html.erb -->
<div class="search-interface" data-controller="property-search">
  <!-- 데스크톱 레이아웃 -->
  <div class="hidden lg:flex desktop-layout">
    <!-- 필터 사이드바 -->
    <aside class="filter-sidebar">
      <%= render 'components/advanced_filter_panel',
          filters: @filter_options,
          layout: 'sidebar' %>
    </aside>
    
    <!-- 검색 결과 -->
    <main class="search-results">
      <%= render 'properties/results',
          properties: @properties %>
    </main>
  </div>
  
  <!-- 모바일 레이아웃 -->
  <div class="lg:hidden mobile-layout">
    <!-- 끈적한 필터 버튼 -->
    <%= render 'components/sticky_filter_button',
        filter_count: active_filter_count %>
    
    <!-- 검색 결과 -->
    <main class="mobile-results">
      <%= render 'properties/mobile_results',
          properties: @properties %>
    </main>
    
    <!-- 바텀 시트 필터 -->
    <%= render 'components/bottom_sheet_filter',
        filters: @filter_options %>
  </div>
</div>
```

#### 4.2 통합 필터 관리자
```javascript
// property_search_controller.js
export default class extends Controller {
  static targets = ["results", "filterCount", "loadingIndicator"]
  static values = { 
    searchUrl: String,
    currentFilters: Object
  }
  
  connect() {
    this.setupFilterListeners();
    this.debounceSearch = this.debounce(this.performSearch.bind(this), 300);
  }
  
  setupFilterListeners() {
    // 모든 필터 변경 이벤트 수신
    this.element.addEventListener('filter:changed', this.handleFilterChange.bind(this));
    this.element.addEventListener('location:selected', this.handleLocationChange.bind(this));
  }
  
  handleFilterChange(event) {
    const { filterName, value } = event.detail;
    this.currentFiltersValue = {
      ...this.currentFiltersValue,
      [filterName]: value
    };
    
    this.updateFilterCount();
    this.debounceSearch();
  }
  
  async performSearch() {
    this.showLoading();
    
    try {
      const params = new URLSearchParams(this.currentFiltersValue);
      const response = await fetch(`${this.searchUrlValue}?${params}`, {
        headers: {
          'Accept': 'text/html',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      const html = await response.text();
      this.resultsTarget.innerHTML = html;
      
      // URL 업데이트 (히스토리 관리)
      const newUrl = `${window.location.pathname}?${params}`;
      window.history.pushState({}, '', newUrl);
      
    } catch (error) {
      console.error('검색 실패:', error);
      this.showError();
    } finally {
      this.hideLoading();
    }
  }
  
  updateFilterCount() {
    const count = Object.keys(this.currentFiltersValue).length;
    if (this.hasFilterCountTarget) {
      this.filterCountTarget.textContent = count;
    }
  }
}
```

### Phase 5: 모바일 최적화 (6주차)
**목표**: 모바일 사용성 완성

#### 5.1 바텀 시트 구현
```erb
<!-- _bottom_sheet_filter.html.erb -->
<div class="bottom-sheet-overlay" data-controller="bottom-sheet">
  <div class="bottom-sheet" data-bottom-sheet-target="sheet">
    <!-- 드래그 핸들 -->
    <div class="drag-handle">
      <div class="handle-bar"></div>
    </div>
    
    <!-- 필터 네비게이션 -->
    <nav class="filter-nav">
      <div class="nav-tabs" data-controller="swipe-tabs">
        <button class="tab active" data-tab="basic">기본</button>
        <button class="tab" data-tab="price">가격</button>
        <button class="tab" data-tab="area">면적</button>
        <button class="tab" data-tab="detail">상세</button>
      </div>
    </nav>
    
    <!-- 필터 콘텐츠 -->
    <div class="filter-content">
      <!-- 각 탭별 필터들 -->
    </div>
    
    <!-- 액션 바 -->
    <div class="action-bar">
      <button class="btn-reset">초기화</button>
      <button class="btn-apply">
        매물 보기 (<span data-property-search-target="resultCount">0</span>)
      </button>
    </div>
  </div>
</div>
```

#### 5.2 터치 제스처 지원
```javascript
// bottom_sheet_controller.js  
export default class extends Controller {
  static targets = ["sheet", "overlay"]
  
  connect() {
    this.isOpen = false;
    this.startY = 0;
    this.currentY = 0;
    this.isDragging = false;
    
    this.setupDragGestures();
  }
  
  setupDragGestures() {
    const handle = this.sheetTarget.querySelector('.drag-handle');
    
    handle.addEventListener('touchstart', this.handleTouchStart.bind(this));
    handle.addEventListener('touchmove', this.handleTouchMove.bind(this));
    handle.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }
  
  handleTouchStart(e) {
    this.startY = e.touches[0].clientY;
    this.isDragging = true;
  }
  
  handleTouchMove(e) {
    if (!this.isDragging) return;
    
    this.currentY = e.touches[0].clientY;
    const deltaY = this.currentY - this.startY;
    
    if (deltaY > 0) { // 아래로 드래그
      const translateY = Math.min(deltaY, window.innerHeight * 0.9);
      this.sheetTarget.style.transform = `translateY(${translateY}px)`;
    }
  }
  
  handleTouchEnd() {
    if (!this.isDragging) return;
    
    const deltaY = this.currentY - this.startY;
    const threshold = window.innerHeight * 0.3;
    
    if (deltaY > threshold) {
      this.close();
    } else {
      this.sheetTarget.style.transform = 'translateY(0)';
    }
    
    this.isDragging = false;
  }
}
```

### Phase 6: 성능 최적화 및 마무리 (7-8주차)
**목표**: 성능 최적화 및 품질 보증

#### 6.1 성능 최적화
- [ ] 이미지 최적화 및 지연 로딩
- [ ] JavaScript 번들 최적화
- [ ] 데이터베이스 쿼리 최적화
- [ ] 캐싱 전략 구현

#### 6.2 품질 보증
- [ ] 크로스 브라우저 테스팅
- [ ] 접근성 검사
- [ ] 성능 프로파일링
- [ ] 사용성 테스트

## 🛠️ 개발 도구 및 환경

### 필수 개발 도구
```yaml
Backend:
  - Rails: 8.0.2+
  - Ruby: 3.1+
  - PostgreSQL: 14+
  - Redis: 7+ (캐싱용)

Frontend:
  - Stimulus: 3.2+  
  - Tailwind CSS: 3.3+
  - Hotwire Turbo: 7.3+

Development:
  - Docker: 24+ (로컬 개발 환경)
  - Node.js: 18+ (asset 빌드)
  - Yarn: 1.22+ (패키지 관리)

Testing:
  - RSpec: 3.12+ (백엔드 테스트)
  - Capybara: 3.39+ (E2E 테스트)
  - Jest: 29+ (JavaScript 테스트)
```

### 코드 품질 도구
```yaml
Ruby:
  - RuboCop: 코드 스타일 검사
  - Brakeman: 보안 취약점 검사
  - Bundler Audit: gem 보안 검사

JavaScript:
  - ESLint: 코드 품질 검사
  - Prettier: 코드 포맷팅
  - Lighthouse: 성능 측정

CI/CD:
  - GitHub Actions: 자동 빌드/테스트
  - CodeClimate: 코드 품질 모니터링
  - Dependabot: 의존성 업데이트
```

## 📊 진행 상황 추적

### 주간 마일스톤
```yaml
Week_1:
  - ✅ 문서화 시스템 구축
  - ✅ 프로젝트 기반 설정
  - [ ] PropertiesController 구축
  - [ ] 기본 데이터 모델 설정

Week_2:
  - [ ] 범용 컴포넌트 개발 (3개)
  - [ ] 기본 필터 구현 (4개)
  - [ ] 가격 필터 구현 (3개)

Week_3:
  - [ ] 면적 필터 구현 (2개)
  - [ ] 구조 필터 구현 (4개)
  - [ ] 건물 정보 필터 구현 (2개)

Week_4:
  - [ ] 지역 데이터 구조화
  - [ ] 계층적 지역 선택 UI
  - [ ] 검색 및 필터링 로직

Week_5:
  - [ ] 메인 검색 페이지 통합
  - [ ] 필터 상태 관리
  - [ ] 검색 결과 표시

Week_6:
  - [ ] 모바일 바텀 시트 구현
  - [ ] 터치 제스처 지원
  - [ ] 반응형 레이아웃 완성

Week_7-8:
  - [ ] 성능 최적화
  - [ ] 크로스 브라우저 테스팅  
  - [ ] 접근성 검사
  - [ ] 최종 품질 보증
```

### 품질 메트릭 목표
```yaml
성능:
  - First Contentful Paint: < 2초
  - Largest Contentful Paint: < 3초
  - Time to Interactive: < 4초
  - Lighthouse Score: > 90점

접근성:
  - WCAG 2.1 AA 준수: 100%
  - 키보드 내비게이션: 완전 지원
  - 스크린 리더: 완전 호환

호환성:
  - 데스크톱: Chrome, Firefox, Safari, Edge
  - 모바일: iOS Safari, Android Chrome
  - 최소 지원: iOS 12+, Android 8+

코드 품질:
  - 테스트 커버리지: > 85%
  - RuboCop 위반: 0개
  - JavaScript 에러: 0개
```

## 🚀 배포 전략

### 단계별 배포
1. **개발 환경**: 매주 금요일 배포
2. **스테이징**: 주요 기능 완성 시 배포  
3. **프로덕션**: 전체 테스트 완료 후 배포

### 모니터링 설정
- **성능 모니터링**: New Relic / DataDog
- **에러 추적**: Sentry
- **사용자 분석**: Google Analytics 4
- **실시간 모니터링**: Uptime Robot

---

📅 **최종 업데이트**: 2024년 현재  
📝 **버전**: 1.0.0  
🎯 **예상 완료**: 8주 (2개월)