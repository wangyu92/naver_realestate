class PropertiesController < ApplicationController
  def index
    @filter_params = filter_params
    @properties = filter_properties(sample_properties)
    @filter_options = build_filter_options
    @total_count = @properties.length
    @has_filters = has_filter_params?
    @current_sort = params[:sort] || 'latest'
  end

  private
  
  def filter_params
    params.permit(
      :transaction_type, :sort, :area_unit,
      :has_elevator, :has_photos,
      property_types: [],
      locations: [],
      direction: [],
      sale_price: [:min, :max],
      jeonse_deposit: [:min, :max],
      monthly_rent: [:min, :max],
      maintenance_fee: [:min, :max],
      exclusive_area: [:min, :max],
      supply_area: [:min, :max],
      room_count: [:min, :max],
      bathroom_count: [:min, :max],
      built_year: [:min, :max],
      parking_ratio: [:min, :max],
      floor: [:min, :max],
      household_count: [:min, :max]
    )
  end
  
  def filter_properties(properties)
    filtered = properties.dup
    
    # Transaction type filter
    if @filter_params[:transaction_type].present?
      case @filter_params[:transaction_type]
      when 'sale'
        filtered = filtered.select { |p| p[:transaction_type] == '매매' }
      when 'jeonse'
        filtered = filtered.select { |p| p[:transaction_type] == '전세' }
      when 'monthly'
        filtered = filtered.select { |p| p[:transaction_type] == '월세' }
      end
    end
    
    # Property types filter
    if @filter_params[:property_types].present?
      type_mapping = {
        'apartment' => '아파트',
        'officetel' => '오피스텔',
        'villa' => '빌라',
        'house' => '단독주택',
        'commercial_house' => '상가주택',
        'multi_house' => '다가구주택'
      }
      
      allowed_types = @filter_params[:property_types].map { |t| type_mapping[t] }.compact
      filtered = filtered.select { |p| allowed_types.include?(p[:type]) } if allowed_types.any?
    end
    
    # Price range filters
    filtered = apply_price_range_filter(filtered)
    
    # Area filters
    filtered = apply_area_range_filter(filtered)
    
    # Room count filters
    if @filter_params[:room_count].present?
      min_rooms = range_param(:room_count, :min, 0)
      max_rooms = range_param(:room_count, :max, 999)
      # Since sample data doesn't have room_count, we'll skip this for now
    end
    
    # Built year filter
    if @filter_params[:built_year].present?
      min_year = range_param(:built_year, :min, 1990)
      max_year = range_param(:built_year, :max, 2024)
      filtered = filtered.select do |p|
        p[:year_built] >= min_year && p[:year_built] <= max_year
      end
    end
    
    # Features filters
    if @filter_params[:has_elevator].present?
      filtered = filtered.select { |p| p[:has_elevator] }
    end
    
    # Direction filter
    if @filter_params[:direction].present? && @filter_params[:direction].any?
      filtered = filtered.select do |p|
        @filter_params[:direction].any? { |dir| p[:direction]&.include?(dir) }
      end
    end
    
    # Sort properties
    sort_properties(filtered)
  end
  
  def apply_price_range_filter(properties)
    return properties unless @filter_params[:sale_price] || @filter_params[:jeonse_deposit] || @filter_params[:monthly_rent]
    
    properties.select do |property|
      case property[:transaction_type]
      when '매매'
        if @filter_params[:sale_price].present?
          min_price = range_param(:sale_price, :min, 0) * 10000
          max_price = range_param(:sale_price, :max, Float::INFINITY) * 10000
          property[:price] && property[:price] >= min_price && property[:price] <= max_price
        else
          true
        end
      when '전세'
        if @filter_params[:jeonse_deposit].present?
          min_deposit = range_param(:jeonse_deposit, :min, 0) * 10000
          max_deposit = range_param(:jeonse_deposit, :max, Float::INFINITY) * 10000
          property[:deposit] && property[:deposit] >= min_deposit && property[:deposit] <= max_deposit
        else
          true
        end
      when '월세'
        if @filter_params[:monthly_rent].present?
          min_rent = range_param(:monthly_rent, :min, 0) * 10000
          max_rent = range_param(:monthly_rent, :max, Float::INFINITY) * 10000
          property[:monthly_rent] && property[:monthly_rent] >= min_rent && property[:monthly_rent] <= max_rent
        else
          true
        end
      else
        true
      end
    end
  end
  
  def apply_area_range_filter(properties)
    return properties unless @filter_params[:exclusive_area] || @filter_params[:supply_area]
    
    properties.select do |property|
      exclusive_ok = true
      supply_ok = true
      
      if @filter_params[:exclusive_area].present?
        min_area = range_param(:exclusive_area, :min, 0)
        max_area = range_param(:exclusive_area, :max, Float::INFINITY)
        
        # Convert to pyeong if needed
        area_value = property.dig(:area, :exclusive) || 0
        if @filter_params[:area_unit] == 'pyeong'
          area_value = (area_value / 3.3058).round(1)
        end
        
        exclusive_ok = area_value >= min_area && area_value <= max_area
      end
      
      if @filter_params[:supply_area].present?
        min_area = range_param(:supply_area, :min, 0)
        max_area = range_param(:supply_area, :max, Float::INFINITY)
        
        # Convert to pyeong if needed
        area_value = property.dig(:area, :supply) || 0
        if @filter_params[:area_unit] == 'pyeong'
          area_value = (area_value / 3.3058).round(1)
        end
        
        supply_ok = area_value >= min_area && area_value <= max_area
      end
      
      exclusive_ok && supply_ok
    end
  end
  
  def sort_properties(properties)
    case @current_sort
    when 'price_low'
      properties.sort_by { |p| get_property_price(p) }
    when 'price_high'
      properties.sort_by { |p| get_property_price(p) }.reverse
    when 'area_large'
      properties.sort_by { |p| p.dig(:area, :exclusive) || 0 }.reverse
    when 'area_small'
      properties.sort_by { |p| p.dig(:area, :exclusive) || 0 }
    when 'latest'
    else
      properties.reverse
    end
  end
  
  def get_property_price(property)
    case property[:transaction_type]
    when '매매'
      property[:price] || 0
    when '전세'
      property[:deposit] || 0
    when '월세'
      (property[:deposit] || 0) + (property[:monthly_rent] || 0) * 100 # 월세는 100배하여 정렬에 영향주기
    else
      0
    end
  end
  
  # Helper method to safely extract range values from params
  def range_param(param_name, key, default_value)
    param = @filter_params[param_name] || params[param_name]
    if param.is_a?(Hash) && param[key].present?
      param[key].to_f
    else
      default_value
    end
  end

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