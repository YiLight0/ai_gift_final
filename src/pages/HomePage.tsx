import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Sparkles, Gift, Video, Grid, LayoutGrid } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import GiftModal from '../components/GiftModal';
import VideoCard from '../components/VideoCard';
import { Product, mockProducts, mockVideos, VideoItem } from '../data/mockData';
import SearchFilter, { FilterState } from '../components/SearchFilter';
import { useCategory } from '../contexts/useCategory';

type ViewMode = 'waterfall' | 'video';
type SectionTab = '热门' | '故宫专区' | '同济专区' | '新品上架' | '大师之作';

// AI Generated Hero Videos Data
const heroVideos = [
  {
    id: 1,
    title: 'AI的礼物',
    subtitle: '创意无界 · 文化传承',
    description: '用AI重新诠释传统文化符号，让东方遇见西方，传统对话未来',
    videoUrl: '/videos/user_video_converted.mp4',
    gradient: 'from-red-600 via-red-500 to-rose-500',
    tags: ['首发', 'AI', '创意']
  },
  {
    id: 2,
    title: '3月24日',
    subtitle: '精彩继续',
    description: '更多创意内容，敬请期待',
    videoUrl: '/videos/video_march24_converted.mp4',
    gradient: 'from-amber-600 via-orange-500 to-yellow-500',
    tags: ['新内容', '创意']
  }
];

export default function HomePage() {
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [giftModalProduct, setGiftModalProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('waterfall');
  const [selectedSection, setSelectedSection] = useState<SectionTab>('热门');
  const [currentHeroVideo, setCurrentHeroVideo] = useState(0);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    categories: [],
    priceRange: [0, 1000],
    locations: [],
    sortBy: 'popular'
  });

  // Video ref and current video state
  const [videoSrc, setVideoSrc] = useState(heroVideos[0].videoUrl);

  // Update video src when currentHeroVideo changes
  useEffect(() => {
    setVideoSrc(heroVideos[currentHeroVideo].videoUrl);
  }, [currentHeroVideo]);

  // Auto-play video when src changes
  useEffect(() => {
    const video = heroVideoRef.current;
    if (video) {
      video.currentTime = 0;
      video.load();
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Autoplay blocked:', err.message);
        });
      }
    }
  }, [videoSrc]);

  // Handle video can play
  const handleVideoCanPlay = () => {
    const video = heroVideoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  };

  // Handle video ended - play next video
  const handleVideoEnded = () => {
    setCurrentHeroVideo((prev) => (prev + 1) % heroVideos.length);
  };

  // Auto-switch hero videos every 8 seconds (fallback)
  useEffect(() => {
    if (heroVideos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroVideo((prev) => (prev + 1) % heroVideos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  const { selectedCategory } = useCategory();

  // Extract unique categories and locations from products
  const categories = useMemo(() => {
    return [...new Set(mockProducts.map(p => p.category))];
  }, []);

  const locations = useMemo(() => {
    return [...new Set(mockProducts.map(p => {
      // Extract province/city from location
      const parts = p.location.split(/[·,\s]/);
      return parts[0] || p.location;
    }))];
  }, []);

  // Filter products based on search filters and selected category and section
  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    // Section filter (Hot Categories tabs)
    if (selectedSection !== '热门') {
      switch (selectedSection) {
        case '故宫专区':
          result = result.filter(p =>
            p.location.includes('故宫') ||
            p.name.includes('故宫') ||
            p.description.includes('故宫') ||
            p.category === '景区'
          );
          break;
        case '同济专区':
          result = result.filter(p =>
            p.location.includes('同济') ||
            p.supplier.name.includes('同济') ||
            p.name.includes('同济') ||
            p.category === '校园'
          );
          break;
        case '新品上架':
          // Sort by newest first (reverse to put newest at front)
          result.sort(() => 0.5 - Math.random());
          break;
        case '大师之作':
          result = result.filter(p =>
            p.supplier.certifications.length > 0 ||
            p.supplier.name.includes('大师') ||
            p.isHot
          );
          break;
      }
    }

    // Selected category filter (from header tabs)
    if (selectedCategory !== '全部') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Keyword search
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword) ||
        p.supplier.name.toLowerCase().includes(keyword) ||
        p.category.toLowerCase().includes(keyword)
      );
    }

    // Category filter from SearchFilter dropdown (additional filter)
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // Price filter
    result = result.filter(p =>
      p.price >= filters.priceRange[0] &&
      (filters.priceRange[1] >= 1000 || p.price <= filters.priceRange[1])
    );

    // Location filter
    if (filters.locations.length > 0) {
      result = result.filter(p => {
        const productLocation = p.location.split(/[·,\s]/)[0];
        return filters.locations.some(loc => productLocation.includes(loc));
      });
    }

    // Sorting (only for non-新品上架 sections)
    if (selectedSection !== '新品上架') {
      switch (filters.sortBy) {
        case 'price-low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          // For demo, reverse order
          result.reverse();
          break;
        case 'popular':
        default:
          result.sort((a, b) => b.stats.likes - a.stats.likes);
          break;
      }
    }

    return result;
  }, [filters, selectedCategory, selectedSection]);

  // Filter videos based on search filters and selected category
  const filteredVideos = useMemo(() => {
    let result = [...mockVideos];

    // Filter by selected category if not "全部"
    if (selectedCategory !== '全部') {
      // Map category to product IDs that match the category
      const categoryProductIds = mockProducts
        .filter(p => p.category === selectedCategory)
        .map(p => p.id);
      result = result.filter(v => categoryProductIds.includes(v.productId));
    }

    // Keyword search
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(v =>
        v.productName.toLowerCase().includes(keyword) ||
        v.masterName.toLowerCase().includes(keyword)
      );
    }

    return result;
  }, [filters, selectedCategory]);

  const handleSearch = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const toggleLike = (productId: string) => {
    setLikedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleVideoLike = (videoId: string) => {
    console.log('Liked video:', videoId);
  };

  const handleVideoShare = (video: VideoItem) => {
    console.log('Share video:', video.id);
  };

  const handleVideoBuy = (video: VideoItem) => {
    window.location.href = `/product/${video.productId}`;
  };

  const handleVideoCoCreate = (video: VideoItem) => {
    window.location.href = `/video-create/${video.id}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* AI Generated Hero Video Banner */}
      <section className="mb-10">
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${heroVideos[currentHeroVideo].gradient} p-6 md:p-10`}>
          {/* Video Background */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <video
              ref={heroVideoRef}
              src={videoSrc}
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnded}
              onCanPlay={handleVideoCanPlay}
              onLoadedData={handleVideoCanPlay}
              className="w-full h-full object-cover opacity-40"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Left Content */}
              <div className="flex-1">
                {/* Tags */}
                <div className="flex gap-2 mb-4">
                  {heroVideos[currentHeroVideo].tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                  {heroVideos[currentHeroVideo].title}
                </h1>
                <p className="text-white/90 text-lg md:text-xl mb-2">
                  {heroVideos[currentHeroVideo].subtitle}
                </p>
                <p className="text-white/70 text-sm md:text-base mb-6 max-w-xl">
                  {heroVideos[currentHeroVideo].description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/challenge"
                    className="inline-flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    立即参与
                  </Link>
                  <Link
                    to="/cultivation"
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 hover:scale-105 transition-all border border-white/30"
                  >
                    <Sparkles className="w-5 h-5" />
                    设计修仙
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mt-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">2,341</p>
                    <p className="text-white/60 text-xs">位创作者</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">56</p>
                    <p className="text-white/60 text-xs">个国家</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">12K+</p>
                    <p className="text-white/60 text-xs">件作品</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Categories */}
      <section className="mb-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedSection('热门')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedSection === '热门'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            🔥 热门
          </button>
          <button
            onClick={() => setSelectedSection('故宫专区')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedSection === '故宫专区'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600'
            }`}
          >
            🏛️ 故宫专区
          </button>
          <button
            onClick={() => setSelectedSection('同济专区')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedSection === '同济专区'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600'
            }`}
          >
            🎓 同济专区
          </button>
          <button
            onClick={() => setSelectedSection('新品上架')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedSection === '新品上架'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600'
            }`}
          >
            ✨ 新品上架
          </button>
          <button
            onClick={() => setSelectedSection('大师之作')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedSection === '大师之作'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600'
            }`}
          >
            💎 大师之作
          </button>
          <Link
            to="/master"
            className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full text-sm font-medium hover:shadow-md transition-all"
          >
            🌟 入驻大师
          </Link>
        </div>
      </section>

      {/* Search & Filter */}
      <SearchFilter
        onSearch={handleSearch}
        categories={categories}
        locations={locations}
        resultCount={filteredProducts.length}
      />

      {/* View Mode Toggle */}
      <section className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedSection !== '热门'
              ? `${selectedSection}`
              : (selectedCategory === '全部'
                ? (viewMode === 'waterfall' ? '发现灵感' : '视频广场')
                : `${selectedCategory}专区`)}
          </h2>
          <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setViewMode('waterfall')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === 'waterfall'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid className="w-4 h-4" />
              瀑布流
            </button>
            <button
              onClick={() => setViewMode('video')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === 'video'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Video className="w-4 h-4" />
              视频流
            </button>
          </div>
        </div>
      </section>

      {/* Content Based on View Mode */}
      {viewMode === 'waterfall' ? (
        /* Waterfall View (Original) */
        <section>
          {/* No Results Message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">未找到匹配的结果</h3>
              <p className="text-gray-500 mb-4">试试调整筛选条件或搜索关键词</p>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.isHot && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-rose-500 text-white text-xs font-medium rounded-full">
                        🔥 爆款
                      </div>
                    )}
                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-red-600 font-bold">¥{product.price}</span>
                      <span className="text-gray-400 text-xs">{product.location}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-500 text-xs">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleLike(product.id);
                        }}
                        className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                          likedProducts.has(product.id) ? 'text-red-500' : ''
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likedProducts.has(product.id) ? 'fill-current' : ''}`} />
                        {formatNumber(product.stats.likes + (likedProducts.has(product.id) ? 1 : 0))}
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {product.stats.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        {product.stats.shares}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Link
                        to={`/cocreate/${product.id}`}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-medium rounded-xl hover:shadow-md transition-all"
                      >
                        <Sparkles className="w-4 h-4" />
                        二创
                      </Link>
                      <button
                        onClick={() => setGiftModalProduct(product)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-rose-100 text-rose-600 text-sm font-medium rounded-xl hover:bg-rose-200 transition-all"
                      >
                        <Gift className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* Video Feed View */
        <section>
          {/* No Results Message */}
          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">未找到匹配的视频</h3>
              <p className="text-gray-500 mb-4">试试调整搜索关键词</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                videoUrl={video.videoUrl}
                coverUrl={video.coverUrl}
                productName={video.productName}
                productPrice={video.productPrice}
                masterName={video.masterName}
                masterTitle={video.masterTitle}
                masterAvatar={video.masterAvatar}
                brokerName={video.brokerName}
                likes={video.likes}
                shares={video.shares}
                coCreationCount={video.coCreationCount}
                bgmName={video.bgmName}
                onLike={() => handleVideoLike(video.id)}
                onShare={() => handleVideoShare(video)}
                onBuy={() => handleVideoBuy(video)}
                onCoCreate={() => handleVideoCoCreate(video)}
              />
            ))}
          </div>

          {/* Create Video Button */}
          <div className="mt-8 text-center">
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 via-red-600 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all">
              <Video className="w-6 h-6" />
              <span className="text-lg">创作你的第一个视频</span>
            </button>
            <p className="mt-3 text-gray-500 text-sm">
              已有 12,345 位创作者生成视频，累计播放 1,234,567 次
            </p>
          </div>
        </section>
      )}

      {/* Loading Indicator */}
      <div className="flex justify-center py-12">
        <div className="flex items-center gap-2 text-gray-500">
          <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          <span>加载更多...</span>
        </div>
      </div>

      {/* Gift Modal */}
      {giftModalProduct && (
        <GiftModal
          product={giftModalProduct}
          isOpen={!!giftModalProduct}
          onClose={() => setGiftModalProduct(null)}
        />
      )}
    </div>
  );
}
