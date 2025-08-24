class PropertiesController < ApplicationController
  def index
    @properties = sample_properties
    @filter_options = build_filter_options
    @total_count = @properties.length
    @has_filters = has_filter_params?
  end

  private

  def sample_properties
    [
      {
        id: 1,
        title: "강남구 역삼동 신축 오피스텔",
        type: "오피스텔",
        transaction_type: "매매",
        price: 850000000,
        area: { exclusive: 84, supply: 102 },
        floor: "15/20",
        direction: "남동향",
        year_built: 2024,
        has_elevator: true,
        parking_ratio: 1.2,
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        address: "서울특별시 강남구 역삼동",
        description: "신축 프리미엄 오피스텔, 지하철역 도보 3분"
      },
      {
        id: 2,
        title: "서초구 반포동 리모델링 아파트",
        type: "아파트", 
        transaction_type: "전세",
        deposit: 500000000,
        area: { exclusive: 132, supply: 155 },
        floor: "12/15",
        direction: "남향",
        year_built: 2019,
        has_elevator: true,
        parking_ratio: 1.5,
        images: [
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        address: "서울특별시 서초구 반포동",
        description: "한강뷰, 리모델링 완료, 초등학교 인근"
      },
      {
        id: 3,
        title: "송파구 잠실동 대단지 아파트",
        type: "아파트",
        transaction_type: "월세", 
        deposit: 100000000,
        monthly_rent: 1800000,
        area: { exclusive: 108, supply: 128 },
        floor: "8/25",
        direction: "동남향",
        year_built: 2021,
        has_elevator: true,
        parking_ratio: 1.0,
        images: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        address: "서울특별시 송파구 잠실동",
        description: "대단지 아파트, 편의시설 우수, 교통 편리"
      },
      {
        id: 4,
        title: "경기도 안산시 상록구 사동 빌라",
        type: "빌라",
        transaction_type: "매매",
        price: 420000000,
        area: { exclusive: 99, supply: 115 },
        floor: "3/4",
        direction: "남향",
        year_built: 2018,
        has_elevator: false,
        parking_ratio: 0.8,
        images: [
          "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        address: "경기도 안산시 상록구 사동",
        description: "조용한 주택가, 넓은 베란다, 주차 가능"
      }
    ]
  end

  def build_filter_options
    {
      transaction_types: [
        { label: '매매', value: 'sale' },
        { label: '전세', value: 'jeonse' },
        { label: '월세', value: 'monthly' }
      ],
      property_types: [
        { label: '아파트', value: 'apartment', count: 1234 },
        { label: '오피스텔', value: 'officetel', count: 567 },
        { label: '빌라/연립', value: 'villa', count: 890 },
        { label: '단독주택', value: 'house', count: 234 },
        { label: '상가주택', value: 'commercial_house', count: 123 },
        { label: '다가구주택', value: 'multi_house', count: 345 }
      ],
      structure_types: [
        { label: '철근콘크리트', value: 'reinforced_concrete' },
        { label: '철골철근콘크리트', value: 'steel_reinforced_concrete' },
        { label: '벽돌구조', value: 'brick' },
        { label: '목구조', value: 'wood' },
        { label: '기타', value: 'other' }
      ],
      room_counts: (1..5).map { |n| { label: "#{n}개", value: n } },
      bathroom_counts: (1..3).map { |n| { label: "#{n}개", value: n } }
    }
  end

  def has_filter_params?
    filter_keys = %w[
      transaction_type property_types locations sale_price jeonse_deposit monthly_rent
      maintenance_fee exclusive_area supply_area room_count bathroom_count built_year
      direction has_elevator parking_ratio has_photos floor structure household_count
    ]
    
    filter_keys.any? { |key| params[key].present? }
  end
end