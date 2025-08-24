class ComponentsController < ApplicationController
  def index
    # Sample data for component showcase
    @sample_properties = [
      {
        id: 1,
        title: "강남 신축 아파트",
        price: 1200000000,
        location: "서울시 강남구",
        type: "아파트",
        rooms: 3,
        bathrooms: 2,
        area: 84,
        status: "available",
        featured: true,
        image_url: "https://picsum.photos/400/300?random=1",
        tags: ["신축", "남향", "주차가능", "엘리베이터"]
      },
      {
        id: 2,
        title: "홍대 오피스텔",
        price: 450000000,
        location: "서울시 마포구 홍대",
        type: "오피스텔",
        rooms: 1,
        bathrooms: 1,
        area: 32,
        status: "pending",
        featured: false,
        image_url: "https://picsum.photos/400/300?random=2",
        tags: ["역세권", "투자용", "관리비저렴"]
      },
      {
        id: 3,
        title: "판교 빌라",
        price: 800000000,
        location: "경기도 성남시 분당구",
        type: "빌라",
        rooms: 4,
        bathrooms: 2,
        area: 112,
        status: "sold",
        featured: false,
        image_url: "https://picsum.photos/400/300?random=3",
        tags: ["단독주택", "정원", "주차2대"]
      }
    ]

    @filter_options = {
      property_types: ["아파트", "오피스텔", "빌라", "단독주택", "상가"],
      price_ranges: [
        { label: "5억 이하", value: "0-500000000" },
        { label: "5억~10억", value: "500000000-1000000000" },
        { label: "10억~15억", value: "1000000000-1500000000" },
        { label: "15억 이상", value: "1500000000-" }
      ],
      locations: ["강남구", "서초구", "송파구", "마포구", "용산구", "성동구"]
    }
  end
end