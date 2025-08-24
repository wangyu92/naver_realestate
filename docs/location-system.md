# 지역 선택 시스템

한국 전체 지역을 동 단위까지 계층적으로 선택할 수 있는 시스템 설계입니다.

## 🗺️ 계층 구조

### 4단계 계층 구조
```
전국 (Korea)
├── 시/도 (Province/City) - 17개
│   ├── 시/군/구 (City/County/District)
│   │   ├── 읍/면/동 (Town/Township/Dong)
│   │   │   └── [선택 가능한 최하위 단위]
```

## 📍 전국 지역 데이터 구조

### 시/도 (17개)
1. **서울특별시** (Seoul)
2. **부산광역시** (Busan)  
3. **대구광역시** (Daegu)
4. **인천광역시** (Incheon)
5. **광주광역시** (Gwangju)
6. **대전광역시** (Daejeon)
7. **울산광역시** (Ulsan)
8. **세종특별자치시** (Sejong)
9. **경기도** (Gyeonggi)
10. **강원도** (Gangwon)
11. **충청북도** (Chungbuk)
12. **충청남도** (Chungnam)  
13. **전라북도** (Jeonbuk)
14. **전라남도** (Jeonnam)
15. **경상북도** (Gyeongbuk)
16. **경상남도** (Gyeongnam)
17. **제주특별자치도** (Jeju)

### 데이터 구조 예시

#### 서울특별시 (25개 구)
```yaml
서울특별시:
  강남구:
    - 역삼동, 삼성동, 논현동, 압구정동, 신사동, 청담동
    - 대치동, 개포동, 도곡동, 수서동, 일원동, 세곡동
  서초구:  
    - 서초동, 잠원동, 반포동, 방배동, 양재동, 내곡동
  송파구:
    - 잠실동, 신천동, 풍납동, 송파동, 석촌동, 삼전동
    - 가락동, 문정동, 장지동, 방이동, 오금동, 거여동, 마천동
  강동구:
    - 명일동, 고덕동, 상일동, 강일동, 둔촌동, 암사동
    - 성내동, 천호동, 길동
  # ... 나머지 21개 구
```

#### 경기도 (주요 시/군)
```yaml
경기도:
  안산시:
    상록구:
      - 사동, 본오동, 부곡동, 월피동, 성포동
      - 팔곡동, 홍곡동, 차곡동, 화정동, 하상동
    단원구:
      - 고잔동, 와동, 원곡동, 신길동, 선부동
  상주시:
    - 낙동면, 청리면, 모서면, 화동면, 화서면
  # ... 나머지 시/군
```

## 🎯 사용자 인터랙션 흐름

### 1. 초기 상태
```
┌─────────────────────────────────────────┐
│ 🔍 지역 선택                              │
├─────────────────────────────────────────┤
│ [           지역을 선택하세요           ]  │
│                                         │
│ 선택된 지역: 없음                        │
└─────────────────────────────────────────┘
```

### 2. 지역 선택 모달 열림
```
┌─────────────────────────────────────────┐
│ 🗺️  지역 선택                     [✕]   │
├─────────────────────────────────────────┤
│ 🔍 [  검색 (예: 강남구, 역삼동)    ]     │
├─────────────────────────────────────────┤
│ ☐ 서울특별시                             │
│ ☐ 부산광역시                             │  
│ ☐ 대구광역시                             │
│ ☐ 인천광역시                             │
│ ☐ 경기도                                │
│ ☐ 강원도                                │
│ ...                                     │
└─────────────────────────────────────────┘
```

### 3. 시/도 선택 후 확장
```
┌─────────────────────────────────────────┐
│ 🗺️  지역 선택                     [✕]   │
├─────────────────────────────────────────┤
│ 🔍 [  검색 (예: 강남구, 역삼동)    ]     │
├─────────────────────────────────────────┤
│ ☑ 서울특별시                        [▼] │
│   ☐ 강남구                              │
│   ☐ 서초구                              │  
│   ☐ 송파구                              │
│   ☐ 강동구                              │
│   ...                                   │
│ ☐ 경기도                           [▶] │
│ ☐ 강원도                           [▶] │
└─────────────────────────────────────────┘
```

### 4. 구/군 선택 후 동 표시
```
┌─────────────────────────────────────────┐
│ 🗺️  지역 선택                     [✕]   │
├─────────────────────────────────────────┤
│ 🔍 [  검색 (예: 강남구, 역삼동)    ]     │
├─────────────────────────────────────────┤
│ ☑ 서울특별시                        [▼] │
│   ☑ 강남구                         [▼] │
│     ☐ 역삼동                            │
│     ☐ 삼성동                            │
│     ☐ 논현동                            │
│     ☐ 압구정동                          │
│     ...                                 │
│   ☐ 서초구                         [▶] │
└─────────────────────────────────────────┘
```

### 5. 동 선택 및 다중 선택
```
┌─────────────────────────────────────────┐
│ 선택된 지역 (3개)                        │
│ [서울 역삼동 ✕] [서울 삼성동 ✕]          │
│ [경기 안산 사동 ✕]                       │
│                                         │
│ [+ 지역 추가]        [선택 완료]         │
└─────────────────────────────────────────┘
```

## 💻 데이터 구조 설계

### JSON 데이터 형태
```json
{
  "regions": [
    {
      "id": "seoul",
      "name": "서울특별시",
      "type": "metropolitan_city",
      "districts": [
        {
          "id": "gangnam",
          "name": "강남구", 
          "type": "district",
          "dongs": [
            { "id": "yeoksam", "name": "역삼동" },
            { "id": "samsung", "name": "삼성동" },
            { "id": "nonhyeon", "name": "논현동" }
          ]
        }
      ]
    },
    {
      "id": "gyeonggi",
      "name": "경기도",
      "type": "province", 
      "cities": [
        {
          "id": "ansan",
          "name": "안산시",
          "type": "city",
          "districts": [
            {
              "id": "sangnok", 
              "name": "상록구",
              "type": "district",
              "dongs": [
                { "id": "sa", "name": "사동" },
                { "id": "bono", "name": "본오동" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Ruby 데이터 구조 (Controller)
```ruby
@locations = [
  {
    region: "서울특별시",
    districts: [
      {
        name: "강남구",
        dongs: ["역삼동", "삼성동", "논현동", "압구정동", "신사동", "청담동", "대치동", "개포동", "도곡동", "수서동", "일원동", "세곡동"]
      },
      {
        name: "서초구", 
        dongs: ["서초동", "잠원동", "반포동", "방배동", "양재동", "내곡동"]
      }
      # ...
    ]
  },
  {
    region: "경기도",
    districts: [
      {
        name: "안산시 상록구",
        dongs: ["사동", "본오동", "부곡동", "월피동", "성포동"]
      }
      # ...
    ]
  }
  # ...
]
```

## 🎨 UI 컴포넌트 설계

### _location_hierarchy.html.erb
```erb
<div class="location-selector" data-controller="location-hierarchy">
  <!-- 검색 헤더 -->
  <div class="search-header">
    <input type="text" placeholder="지역명으로 검색" 
           data-location-hierarchy-target="searchInput">
  </div>
  
  <!-- 계층적 리스트 -->  
  <div class="hierarchy-list" data-location-hierarchy-target="list">
    <% @locations.each do |region| %>
      <div class="region-item" data-region="<%= region[:name] %>">
        <!-- 지역 체크박스 -->
        <label class="region-label">
          <input type="checkbox" data-action="change->location-hierarchy#toggleRegion">
          <%= region[:name] %>
          <span class="expand-icon">▶</span>
        </label>
        
        <!-- 시/군/구 리스트 -->
        <div class="districts-list hidden">
          <% region[:districts].each do |district| %>
            <div class="district-item">
              <label class="district-label">
                <input type="checkbox" data-action="change->location-hierarchy#toggleDistrict">
                <%= district[:name] %>  
                <span class="expand-icon">▶</span>
              </label>
              
              <!-- 동/면 리스트 -->
              <div class="dongs-list hidden">
                <% district[:dongs].each do |dong| %>
                  <label class="dong-label">
                    <input type="checkbox" name="locations[]" 
                           value="<%= "#{region[:name]} #{district[:name]} #{dong}" %>"
                           data-action="change->location-hierarchy#selectDong">
                    <%= dong %>
                  </label>
                <% end %>
              </div>
            </div>
          <% end %>
        </div>
      </div>
    <% end %>
  </div>
  
  <!-- 선택된 지역 표시 -->
  <div class="selected-locations" data-location-hierarchy-target="selectedList">
    <!-- 동적으로 생성 -->
  </div>
  
  <!-- 액션 버튼 -->
  <div class="action-buttons">
    <button type="button" class="btn-reset" data-action="click->location-hierarchy#clearAll">
      전체 해제
    </button>
    <button type="button" class="btn-confirm" data-action="click->location-hierarchy#confirm">
      선택 완료
    </button>
  </div>
</div>
```

## 📱 모바일 최적화

### 터치 인터페이스
- **최소 터치 영역**: 44px × 44px
- **스와이프 제스처**: 좌우 스와이프로 계층 이동
- **길게 누르기**: 빠른 선택/해제

### 모바일 레이아웃
```
┌─────────────────────┐
│ 🗺️ 지역 선택    [✕] │ ← 상단 고정 헤더
├─────────────────────┤  
│ 🔍 [검색        ] │ ← 검색 바
├─────────────────────┤
│                     │
│   계층적 리스트       │ ← 스크롤 영역
│                     │
├─────────────────────┤
│ 선택된 지역 (2개)    │ ← 선택 상태 표시  
│ [서울 역삼] [경기 사동] │
├─────────────────────┤
│ [전체해제] [선택완료] │ ← 하단 고정 버튼
└─────────────────────┘
```

## 🔍 검색 기능

### 검색 알고리즘
1. **한글 검색**: "강남" → 강남구 관련 결과
2. **부분 매칭**: "역삼" → 역삼동 결과  
3. **다중 키워드**: "서울 강남" → 서울 강남구 관련
4. **초성 검색**: "ㄱㄴ" → 강남 관련 결과

### 검색 결과 하이라이팅
```html
<!-- 검색어 "강남" 입력 시 -->
<label class="region-result">
  서울특별시 > <mark>강남</mark>구 > 역삼동
</label>
```

## 🚀 성능 최적화

### 가상 스크롤링
- 대량의 지역 데이터를 효율적으로 렌더링
- 보이는 영역만 DOM에 렌더링

### 지연 로딩
- 사용자가 확장할 때만 하위 데이터 로드
- API 호출 최소화

### 캐싱 전략
```javascript
// 로컬스토리지에 지역 데이터 캐싱
localStorage.setItem('location_data', JSON.stringify(locationData));

// 최근 선택한 지역 저장
localStorage.setItem('recent_locations', JSON.stringify(recentSelections));
```

## 🔄 상태 관리

### 선택 상태 추적
```javascript
// 현재 선택된 지역들
selectedLocations = [
  "서울특별시 강남구 역삼동",
  "서울특별시 강남구 삼성동", 
  "경기도 안산시 상록구 사동"
];

// 확장된 노드들
expandedNodes = [
  "서울특별시",
  "서울특별시_강남구",
  "경기도",
  "경기도_안산시"  
];
```

### URL 동기화
```
/properties?locations[]=서울특별시+강남구+역삼동&locations[]=경기도+안산시+상록구+사동
```

---

📅 **최종 업데이트**: 2024년 현재  
📝 **버전**: 1.0.0