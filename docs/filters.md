# 필터 시스템 상세 명세

부동산 매물 조회 앱의 18개 포괄적 필터 시스템에 대한 상세 명세입니다.

## 📋 필터 개요

총 18개의 필터로 구성되며, 사용자가 원하는 매물을 정확히 찾을 수 있도록 세밀한 조건 설정이 가능합니다.

## 🔍 필터 상세 명세

### 1. 거래유형 (Transaction Type)
- **유형**: Single Select (라디오 버튼)
- **옵션**: 
  - 매매 (sale)
  - 전세 (jeonse)
  - 월세 (monthly)
  - 단기임대 (short_term)
- **기본값**: 선택하지 않음
- **UI 컴포넌트**: `_select_field.html.erb` 또는 커스텀 라디오 그룹

### 2. 매물유형 (Property Type)
- **유형**: Multi Select (체크박스 그룹)
- **옵션 (18개)**:
  1. 아파트 (apartment)
  2. 오피스텔 (officetel)  
  3. 빌라 (villa)
  4. 아파트분양권 (apartment_presale)
  5. 오피스텔분양권 (officetel_presale)
  6. 재건축 (reconstruction)
  7. 전원주택 (country_house)
  8. 단독/다가구 (single_multi_house)
  9. 상가주택 (commercial_house)
  10. 한옥주택 (hanok)
  11. 재개발 (redevelopment)
  12. 원룸 (studio)
  13. 상가 (commercial)
  14. 사무실 (office)
  15. 공장/창고 (factory_warehouse)
  16. 건물 (building)
  17. 토지 (land)
  18. 지식산업센터 (knowledge_industry_center)
- **기본값**: 전체 선택하지 않음
- **UI 컴포넌트**: `_multi_checkbox.html.erb` (신규 개발)

### 3. 매매가/보증금 (Sale Price / Deposit)
- **유형**: Range Slider
- **범위**: 0원 ~ 100억원
- **단위**: 만원, 억원 자동 변환
- **옵션**:
  - 최대 가격만 설정
  - 최소~최대 범위 설정
- **동적 레이블**: 거래유형에 따라 "매매가" 또는 "보증금"으로 변경
- **UI 컴포넌트**: `_range_slider.html.erb` (신규 개발)

### 4. 월세 (Monthly Rent)
- **유형**: Range Slider  
- **범위**: 0원 ~ 1,000만원
- **단위**: 만원
- **표시**: 거래유형이 "월세"일 때만 표시
- **UI 컴포넌트**: `_range_slider.html.erb`

### 5. 관리비 (Management Fee)
- **유형**: Range Slider
- **범위**: 0원 ~ 100만원  
- **단위**: 만원
- **UI 컴포넌트**: `_range_slider.html.erb`

### 6. 공급면적 (Supply Area)
- **유형**: Range Slider + Unit Toggle
- **범위**: 10㎡ ~ 500㎡ (3평 ~ 151평)
- **단위 전환**: 
  - 평 (pyeong) ⟷ ㎡ (square meters)
  - 변환공식: 1평 = 3.3058㎡
- **기본 단위**: 평
- **UI 컴포넌트**: `_range_slider.html.erb` + `_unit_toggle.html.erb`

### 7. 전용면적 (Exclusive Area)  
- **유형**: Range Slider + Unit Toggle
- **범위**: 6㎡ ~ 400㎡ (2평 ~ 121평)
- **단위 전환**: 공급면적과 동일
- **필터링 기준**: 전용면적으로 필터링 (공급면적과 별개)
- **UI 컴포넌트**: `_range_slider.html.erb` + `_unit_toggle.html.erb`

### 8. 방개수 (Number of Rooms)
- **유형**: Multi Select 또는 Range
- **옵션**:
  - 최소 방개수만 설정 (1개 이상, 2개 이상, ...)
  - 정확한 범위 설정 (1~2개, 2~3개, ...)
- **범위**: 0개 ~ 10개+
- **UI 컴포넌트**: `_select_field.html.erb` 또는 커스텀 범위 선택

### 9. 욕실수 (Number of Bathrooms)
- **유형**: Multi Select 또는 Range  
- **옵션**: 방개수와 동일한 방식
- **범위**: 1개 ~ 5개+
- **UI 컴포넌트**: `_select_field.html.erb` 또는 커스텀 범위 선택

### 10. 사용승인년도 (Building Approval Year)
- **유형**: Range Slider 또는 Min Value
- **범위**: 1970년 ~ 현재년도
- **옵션**:
  - 최소 년도만 설정 (2020년 이후 등)
  - 년도 범위 설정 (2015~2020년 등)
- **UI 컴포넌트**: `_range_slider.html.erb` (연도 특화)

### 11. 방향 (Direction)
- **유형**: Single Select (라디오 버튼)
- **옵션 (8개)**:
  - 동 (East)
  - 서 (West)  
  - 남 (South)
  - 북 (North)
  - 남동 (Southeast)
  - 남서 (Southwest)
  - 북동 (Northeast)  
  - 북서 (Northwest)
- **UI 컴포넌트**: `_direction_picker.html.erb` (나침반 스타일)

### 12. 엘리베이터 (Elevator)
- **유형**: Toggle Switch
- **옵션**: 있음 / 상관없음
- **기본값**: 상관없음
- **UI 컴포넌트**: 커스텀 토글 스위치

### 13. 세대당 주차대수 (Parking Ratio per Unit)
- **유형**: Range Slider (비율)
- **범위**: 0.0 ~ 1.0 (0대 ~ 1대 이상)
- **계산**: 주차가능수 ÷ 세대수
- **표시**: 
  - 0.0: 주차 불가능
  - 0.5: 2세대당 1대  
  - 1.0: 세대당 1대 이상
- **UI 컴포넌트**: `_ratio_slider.html.erb` (신규 개발)

### 14. 사진여부 (Photo Availability)
- **유형**: Toggle Switch
- **옵션**: 사진 있는 매물만 / 전체
- **기본값**: 전체
- **UI 컴포넌트**: 커스텀 토글 스위치

### 15. 층 (Floor)
- **유형**: Complex Input (현재층/전체층)
- **입력 형식**: "5/15" (5층 / 총 15층)
- **다중 입력**: 여러 층수 조건 추가 가능
- **예시**:
  - "1/20" (1층, 총 20층 건물)
  - "10-15/30" (10~15층, 총 30층 건물)
- **UI 컴포넌트**: `_floor_selector.html.erb` (신규 개발)

### 16. 주구조 (Building Structure)
- **유형**: Multi Select (드롭다운)
- **옵션**:
  - 철근콘크리트 (RC: Reinforced Concrete)
  - 철골 (Steel Frame)
  - 조적조 (Masonry)
  - 목조 (Wood Frame)
  - 기타 (Other)
- **UI 컴포넌트**: `_select_field.html.erb` (다중선택 확장)

### 17. 총세대수 (Total Units)
- **유형**: Range Slider 또는 Max Value
- **범위**: 1세대 ~ 3,000세대
- **옵션**:
  - 최대 세대수만 설정
  - 범위 설정 (100~500세대 등)
- **카테고리 제안**:
  - 소형 단지: ~50세대
  - 중형 단지: 50~300세대  
  - 대형 단지: 300~1000세대
  - 초대형 단지: 1000세대+
- **UI 컴포넌트**: `_range_slider.html.erb`

## 🎯 필터 상호작용 규칙

### 거래유형 기반 필터 표시
```yaml
매매:
  - 매매가 필터 표시 (보증금 레이블)
  - 월세 필터 숨김

전세:  
  - 보증금 필터 표시
  - 월세 필터 숨김

월세:
  - 보증금 필터 표시  
  - 월세 필터 표시

단기임대:
  - 보증금 필터 표시
  - 월세 필터 표시 (일세/주세 옵션)
```

### 매물유형 기반 필터 조정
```yaml
아파트/오피스텔:
  - 모든 필터 표시
  
토지:
  - 방개수, 욕실수, 층수, 엘리베이터 필터 숨김
  - 건축년도 대신 토지 등록일 표시

상가/사무실:
  - 방개수 대신 공간 구분수
  - 욕실수 유지
```

## 📱 모바일 최적화

### 필터 그룹핑 (모바일)
1. **기본 조건**: 거래유형, 매물유형, 지역
2. **가격 조건**: 매매가/보증금, 월세, 관리비  
3. **면적 조건**: 공급면적, 전용면적
4. **구조 조건**: 방개수, 욕실수, 층수
5. **건물 정보**: 사용승인년도, 방향, 엘리베이터, 주차, 주구조, 세대수
6. **기타**: 사진여부

### 스와이프 네비게이션
모바일에서 필터 그룹 간 좌우 스와이프로 이동 가능

## 🔄 필터 상태 관리

### URL 파라미터 매핑
```
/properties?
  transaction_type=sale&
  property_types[]=apartment&property_types[]=officetel&
  price_min=50000000&price_max=100000000&
  area_unit=pyeong&area_min=20&area_max=40&
  rooms_min=2&
  parking_ratio=0.5&
  has_elevator=true&
  has_photos=true
```

### 로컬스토리지 저장
- 사용자 필터 설정 저장
- 최근 검색 조건 3개까지 저장
- 즐겨찾는 필터 조합 저장

## 🎨 UI/UX 가이드라인

### 필터 시각적 피드백
- **활성화된 필터**: 파란색 배경, 흰색 텍스트
- **적용된 필터 개수**: 배지로 표시
- **필터 초기화**: 빨간색 텍스트 버튼

### 접근성 (Accessibility)
- 모든 필터에 적절한 label
- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 고대비 모드 지원

---

📅 **최종 업데이트**: 2024년 현재  
📝 **버전**: 1.0.0