module ApplicationHelper
  # Format currency in Korean style (억, 만원)
  def format_currency(amount)
    return '0원' unless amount && amount > 0
    
    if amount >= 100_000_000 # 1억 이상
      eok = amount / 100_000_000
      remainder = amount % 100_000_000
      man = remainder / 10_000
      
      if remainder == 0
        "#{eok.to_i}억원"
      elsif man > 0
        "#{eok.to_i}억 #{man.to_i}만원"
      else
        "#{eok.to_i}억원"
      end
    elsif amount >= 10_000 # 1만 이상
      man = amount / 10_000
      remainder = amount % 10_000
      
      if remainder == 0
        "#{man.to_i}만원"
      else
        "#{man.to_i}만 #{number_with_delimiter(remainder.to_i)}원"
      end
    else
      "#{number_with_delimiter(amount.to_i)}원"
    end
  end
  
  # Format area (square meters to pyeong conversion)
  def format_area(sqm, unit = 'both')
    return '0㎡' unless sqm && sqm > 0
    
    pyeong = (sqm / 3.3058).round(1)
    
    case unit
    when 'sqm'
      "#{sqm}㎡"
    when 'pyeong'
      "#{pyeong}평"
    else # both
      "#{sqm}㎡ (#{pyeong}평)"
    end
  end
  
  # Check if current page matches given path
  def current_page_class(path, classes = 'active')
    current_page?(path) ? classes : ''
  end
  
  # Generate page title
  def page_title(title = nil)
    base_title = "네이버 부동산"
    title ? "#{title} | #{base_title}" : base_title
  end
  
  # Format floor information
  def format_floor(floor_string)
    return floor_string unless floor_string
    
    if floor_string.include?('/')
      current, total = floor_string.split('/')
      "#{current}층/#{total}층"
    else
      "#{floor_string}층"
    end
  end
  
  # Helper method to safely extract range values from params
  def safe_range_param(param_hash, key, default_value)
    if param_hash.is_a?(Hash) && param_hash[key].present?
      if default_value.is_a?(Float)
        param_hash[key].to_f
      else
        param_hash[key].to_i
      end
    else
      default_value
    end
  end
end
