# 네이버 부동산 API 문서

## 개요
네이버 부동산 플랫폼의 비공식 API 문서입니다. 이 API를 통해 매물 목록 조회, 상세 정보 확인, 지역별 부동산 정보 검색이 가능합니다.

## 기본 정보

### Base URL
```
https://new.land.naver.com/api
```

### 인증 (Authentication)
모든 API 요청에는 다음 헤더가 필요합니다:

```python
headers = {
    "authority": "new.land.naver.com",
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US,en;q=0.9,ko;q=0.8",
    "authorization": "Bearer {JWT_TOKEN}",  # JWT 토큰 필요
    "Referer": "https://new.land.naver.com/",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
}
```

> ⚠️ **주의**: JWT 토큰은 주기적으로 갱신이 필요하며, 만료 시 새로운 토큰을 발급받아야 합니다. 

JWT_TOKEN ->
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlJFQUxFU1RBVEUiLCJpYXQiOjE3NDQ4ODE0NTQsImV4cCI6MTc0NDg5MjI1NH0.UO21pr64-BObJDp8YhpiUE4mroAqbZb4VYMuWX_iNHw
```

## API 엔드포인트

### 1. 매물 목록 조회

#### Endpoint
```
GET /articles
```

#### Parameters

| 파라미터 | 타입 | 필수 | 설명 | 예시 |
|---------|------|------|------|------|
| `cortarNo` | string | ✅ | 행정동 코드 | "3011010500" |
| `order` | string | ❌ | 정렬 순서 | "rank" |
| `realEstateType` | string | ❌ | 부동산 유형 | "DDDGG:JWJT:SGJT:HOJT:VL:YR:DSD" |
| `tradeType` | string | ❌ | 거래 유형 | "A1" (매매), "B1" (전세), "B2" (월세), "B3" (월세+단기) |
| `priceMin` | number | ❌ | 최소 가격 (만원) | 0 |
| `priceMax` | number | ❌ | 최대 가격 (만원) | 100000 |
| `rentPriceMin` | number | ❌ | 최소 월세 (만원) | 0 |
| `rentPriceMax` | number | ❌ | 최대 월세 (만원) | 500 |
| `areaMin` | number | ❌ | 최소 면적 (㎡) | 33 |
| `areaMax` | number | ❌ | 최대 면적 (㎡) | 165 |
| `priceType` | string | ❌ | 가격 타입 | "RETAIL" |
| `page` | number | ❌ | 페이지 번호 | 1 |
| `articleState` | string | ❌ | 매물 상태 | "" |

#### 부동산 유형 코드 (realEstateType)
- `DDDGG`: 단독/다가구
- `JWJT`: 주택/주택단지
- `SGJT`: 상가주택
- `HOJT`: 한옥주택
- `VL`: 빌라
- `YR`: 원룸
- `DSD`: 다세대

#### Response
```json
{
  "articleList": [
    {
      "articleNo": "2424959374",
      "articleName": "매물명",
      "realEstateTypeName": "빌라",
      "articleRealEstateTypeName": "빌라(연립/다세대)",
      "tradeTypeName": "월세",
      "dealOrWarrantPrc": "1000",  // 보증금 (만원)
      "rentPrc": 50,  // 월세 (만원)
      "area1": 84.5,  // 공급면적 (㎡)
      "area2": 59.8,  // 전용면적 (㎡)
      "direction": "남향",
      "floorInfo": "2/3층",
      "articleConfirmYmd": "24.12.31",
      "articleFeatureDesc": "깨끗하고 조용한 주택",
      "tagList": ["주차가능", "풀옵션"],
      "realtorName": "○○공인중개사",
      "cpName": "네이버",
      "cpPcArticleUrl": "https://...",
      "latitude": 36.350412,
      "longitude": 127.384548
    }
  ],
  "isMoreData": true,  // 다음 페이지 존재 여부
  "totalCount": 150
}
```

### 2. 매물 상세 정보 조회

#### Endpoint
```
GET /articles/{articleNo}
```

#### Parameters

| 파라미터 | 타입 | 필수 | 설명 | 예시 |
|---------|------|------|------|------|
| `articleNo` | string | ✅ | 매물 번호 | "2424959374" |
| `complexNo` | string | ❌ | 단지 번호 | "" |

#### Response
```json
{
  "articleDetail": {
    "exposureAddress": "대전 동구 가오동",
    "buildingTypeName": "빌라",
    "moveInTypeName": "즉시입주",
    "roomCount": 3,
    "bathroomCount": 2,
    "householdCount": 12,
    "monthlyManagementCost": 50000,
    "detailDescription": "상세 설명...",
    "area2": 59.8  // 전용면적
  },
  "articlePrice": {
    "dealOrWarrantPrc": "1000",
    "rentPrc": 50,
    "allWarrantPrc": "1000",
    "allRentPrc": 50
  },
  "articleRealtor": {
    "realtorName": "○○공인중개사",
    "representativeTelNo": "042-123-4567",
    "cellPhoneNo": "010-1234-5678",
    "address": "대전 동구 ○○로 123"
  },
  "articleBuildingRegister": {
    "platArea": 330.5,  // 대지면적 (㎡)
    "archArea": 198.7,  // 건축면적 (㎡)
    "totArea": 596.1,   // 총건축면적 (㎡)
    "useAprDay": "2015",  // 건축년도
    "grndFlrCnt": 3  // 총층수
  }
}
```

## 행정동 코드 (cortarNo)

대전광역시 주요 지역 코드:

### 동구
- `3011010500`: 가오동
- `3011010600`: 신흥동
- `3011010700`: 판암동
- `3011010800`: 삼정동
- ... (더 많은 코드는 소스코드 참조)

### 중구
- `3014010100`: 은행동
- `3014010200`: 선화동
- `3014010300`: 목동
- ... (더 많은 코드는 소스코드 참조)

### 서구
- `3017010100`: 복수동
- `3017010200`: 변동
- `3017010300`: 도마동
- ... (더 많은 코드는 소스코드 참조)

### 유성구
- `3020010100`: 원내동
- `3020010200`: 교촌동
- `3020010300`: 대정동
- ... (더 많은 코드는 소스코드 참조)

### 대덕구
- `3023010100`: 오정동
- `3023010200`: 대화동
- `3023010300`: 읍내동
- ... (더 많은 코드는 소스코드 참조)

## 사용 예시

### Python을 사용한 매물 조회

```python
import requests
import time

# 헤더 설정
headers = {
    "authority": "new.land.naver.com",
    "accept": "*/*",
    "authorization": "Bearer {YOUR_JWT_TOKEN}",
    "Referer": "https://new.land.naver.com/",
    "user-agent": "Mozilla/5.0..."
}

# 매물 목록 조회
def get_articles(cortar_no, trade_type="B2", page=1):
    url = "https://new.land.naver.com/api/articles"
    
    params = {
        "cortarNo": cortar_no,
        "tradeType": trade_type,  # B2: 월세
        "rentPriceMin": 0,
        "rentPriceMax": 100,
        "areaMin": 33,
        "areaMax": 165,
        "page": page
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None

# 매물 상세 정보 조회
def get_article_detail(article_no):
    url = f"https://new.land.naver.com/api/articles/{article_no}"
    
    params = {
        "complexNo": ""
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None

# 사용 예시
if __name__ == "__main__":
    # 동구 가오동의 월세 매물 조회
    articles = get_articles("3011010500", trade_type="B2")
    
    if articles:
        for article in articles["articleList"][:5]:  # 처음 5개만
            print(f"매물명: {article['articleName']}")
            print(f"가격: 보증금 {article['dealOrWarrantPrc']}만원, 월세 {article['rentPrc']}만원")
            print(f"면적: {article['area2']}㎡")
            print("-" * 50)
            
            # API 부하 방지를 위한 딜레이
            time.sleep(0.5)
            
            # 상세 정보 조회
            detail = get_article_detail(article['articleNo'])
            if detail:
                print(f"상세주소: {detail['articleDetail']['exposureAddress']}")
                print(f"방수: {detail['articleDetail'].get('roomCount', 'N/A')}개")
                print("=" * 50)
```

## 주의사항

1. **토큰 관리**: JWT 토큰은 주기적으로 만료되므로 갱신이 필요합니다.
2. **요청 제한**: 과도한 요청 시 차단될 수 있으므로 적절한 딜레이(0.3~0.5초)를 두고 요청하세요.
3. **데이터 정확성**: 비공식 API이므로 데이터 구조가 변경될 수 있습니다.
4. **개인정보 보호**: 중개사 연락처 등 개인정보를 수집할 때는 관련 법규를 준수하세요.
5. **상업적 이용**: 네이버 부동산 데이터의 상업적 이용 시 네이버 약관을 확인하세요.

## 부동산 조회 앱 구현 가이드

### 필수 기능
1. **지역 선택**: 시/구/동 단위로 지역 선택 UI
2. **필터링**: 가격, 면적, 거래유형별 필터
3. **목록 표시**: 매물 목록을 카드 형태로 표시
4. **상세 보기**: 매물 클릭 시 상세 정보 표시
5. **지도 연동**: 위도/경도를 활용한 지도 표시

### 추천 기술 스택
- **Frontend**: React/Vue.js + 지도 API (카카오맵, 네이버맵)
- **Backend**: Node.js/Python + Redis (캐싱)
- **Database**: MongoDB/PostgreSQL (매물 데이터 저장)

### 구현 시 고려사항
1. 토큰 자동 갱신 로직 구현
2. 데이터 캐싱으로 API 호출 최소화
3. 페이지네이션 구현
4. 에러 핸들링 및 재시도 로직
5. 반응형 디자인 적용