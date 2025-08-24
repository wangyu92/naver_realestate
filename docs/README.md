# 부동산 매물 조회 앱 - 문서

Rails 8.0.2+ 기반의 포괄적인 부동산 매물 조회 시스템을 위한 설계 문서입니다.

## 📚 문서 목록

### 핵심 설계 문서
- **[filters.md](./filters.md)** - 18개 필터 시스템 상세 명세
- **[component-architecture.md](./component-architecture.md)** - 컴포넌트 설계 시스템
- **[location-system.md](./location-system.md)** - 한국 전체 지역 계층 구조
- **[ui-ux-guidelines.md](./ui-ux-guidelines.md)** - UI/UX 디자인 가이드라인
- **[mobile-design.md](./mobile-design.md)** - 모바일 반응형 전략
- **[implementation-strategy.md](./implementation-strategy.md)** - 단계별 구현 로드맵

## 🏗️ 프로젝트 개요

### 기술 스택
- **Backend**: Rails 8.0.2+, PostgreSQL
- **Frontend**: Hotwire (Turbo + Stimulus), Tailwind CSS
- **Database**: PostgreSQL with multi-database setup
- **Deployment**: Kamal (Docker-based)

### 핵심 기능
1. **18개 포괄적 필터 시스템**
2. **한국 전체 지역 계층적 선택**
3. **PC/모바일 반응형 디자인**
4. **실시간 검색 결과**

## 🎯 주요 요구사항

### 지역 선택
- 전국 모든 지역을 동 단위까지 선택 가능
- 다중 지역 동시 선택 (예: 경기도 안산시 상록구 + 경상북도 상주시 낙동면)
- 계층적 선택 인터페이스

### 필터 시스템 (18개)
1. **거래유형**: 매매/전세/월세/단기임대
2. **매물유형**: 18개 타입 다중선택
3. **매매가(보증금)**: 범위 슬라이더
4. **월세**: 범위 슬라이더
5. **관리비**: 범위 슬라이더
6. **공급면적**: 평/㎡ 단위 전환 + 범위
7. **전용면적**: 평/㎡ 단위 전환 + 범위
8. **방개수**: 최소값 또는 범위
9. **욕실수**: 최소값 또는 범위
10. **사용승인년도**: 연도 범위
11. **방향**: 8방위 선택
12. **엘리베이터**: 토글 스위치
13. **세대당 주차대수**: 0-1 비율 슬라이더
14. **사진여부**: 토글 스위치
15. **층**: 현재층/전체층 입력
16. **주구조**: 구조 타입 선택
17. **총세대수**: 최대값 또는 범위

## 🔄 개발 워크플로

### Phase 1: 문서화 및 기초 설정
- [x] 문서 구조 생성
- [ ] 상세 명세 문서 작성
- [ ] 컴포넌트 아키텍처 정의

### Phase 2: 핵심 컴포넌트 개발
- [ ] 필터 컴포넌트 8개 생성
- [ ] 기존 컴포넌트 확장
- [ ] 지역 선택 시스템

### Phase 3: 메인 인터페이스
- [ ] 검색 페이지 구축
- [ ] 필터 통합
- [ ] 결과 표시

### Phase 4: 모바일 최적화
- [ ] 반응형 레이아웃
- [ ] 터치 인터페이스
- [ ] 성능 최적화

## 📋 컴포넌트 인벤토리

### 기존 컴포넌트 (재활용)
- `_button.html.erb` - 버튼 컴포넌트
- `_input_field.html.erb` - 입력 필드
- `_select_field.html.erb` - 드롭다운
- `_badge.html.erb` - 배지/태그
- `_modal.html.erb` - 모달
- `_alert.html.erb` - 알림
- `_navbar.html.erb` - 네비게이션
- `_property_card.html.erb` - 매물 카드
- `_price_display.html.erb` - 가격 표시
- `_image_gallery.html.erb` - 이미지 갤러리
- `_filter_sidebar.html.erb` - 기본 필터 (확장 예정)

### 새로 개발할 컴포넌트
- `_location_hierarchy.html.erb` - 계층적 지역 선택
- `_range_slider.html.erb` - 범위 슬라이더
- `_multi_checkbox.html.erb` - 다중 체크박스
- `_unit_toggle.html.erb` - 단위 전환 토글
- `_floor_selector.html.erb` - 층수 선택
- `_direction_picker.html.erb` - 방향 선택
- `_ratio_slider.html.erb` - 비율 슬라이더
- `_advanced_filter_panel.html.erb` - 통합 필터

## 📱 반응형 브레이크포인트

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px  
- **Desktop**: 1024px+

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: Blue-600 (#2563eb)
- **Secondary**: Gray-600 (#4b5563)
- **Success**: Green-600 (#059669)
- **Warning**: Yellow-600 (#ca8a04)
- **Error**: Red-600 (#dc2626)

### 타이포그래피
- **제목**: font-bold, text-xl~3xl
- **본문**: font-medium, text-sm~base
- **라벨**: font-medium, text-xs~sm

---

📅 **최종 업데이트**: 2024년 현재  
📝 **작성자**: Claude Code SuperClaude  
🔄 **버전**: 1.0.0