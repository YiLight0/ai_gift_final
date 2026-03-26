import { useParams, Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Sparkles, MapPin, Star, Truck, Shield, ArrowLeft } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { useState } from 'react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = mockProducts.find(p => p.id === id) || mockProducts[0];
  const [selectedImage, setSelectedImage] = useState(0);
  const [liked, setLiked] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-6">
        <ArrowLeft className="w-5 h-5" />
        返回
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Image Gallery */}
        <div>
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isHot && (
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-rose-500 text-white text-sm font-medium rounded-full">
                🔥 爆款
              </div>
            )}
          </div>
          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === idx ? 'border-amber-500 shadow-md' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            {product.certifications.map((cert, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                {cert}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-current" />
              非遗认证
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {product.location}
            </span>
            <span className="flex items-center gap-1">
              🏪 {product.supplier.name}
            </span>
          </div>

          <div className="text-4xl font-bold text-amber-600 mb-6">
            ¥{product.price}
            <span className="text-lg text-gray-400 font-normal ml-2">起</span>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                liked
                  ? 'bg-rose-500 text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              {liked ? '已喜欢' : '喜欢'} {product.stats.likes + (liked ? 1 : 0)}
            </button>
            <Link
              to={`/cocreate/${product.id}`}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Sparkles className="w-5 h-5" />
              我要二创
            </Link>
          </div>

          {/* Stats */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">📊 爆款数据</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-rose-500">{product.stats.likes}</div>
                <div className="text-xs text-gray-500">喜欢</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-500">{product.stats.comments}</div>
                <div className="text-xs text-gray-500">评论</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">{product.stats.shares}</div>
                <div className="text-xs text-gray-500">转发</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-500">{product.stats.coCreations}</div>
                <div className="text-xs text-gray-500">二创</div>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="w-5 h-5 text-green-500" />
              <span>48小时内发货 · 顺丰包邮</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-5 h-5 text-blue-500" />
              <span>7天无理由退换 · 品质保障</span>
            </div>
          </div>

          {/* Description */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-800 mb-3">商品描述</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Origin Story */}
          {product.story && (
            <div className="border-t pt-6 mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">🗺️ 传承故事</h3>
              <p className="text-gray-600 leading-relaxed">{product.story}</p>
            </div>
          )}

          {/* Comments Section */}
          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold text-gray-800 mb-4">💬 用户评论</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-800">@小美</span>
                  <span className="text-amber-500 text-sm">⭐⭐⭐⭐⭐</span>
                </div>
                <p className="text-gray-600 text-sm">二创的凤凰款超美！龙阿姨还视频通话教我保养</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-800">@设计师阿杰</span>
                  <span className="text-amber-500 text-sm">⭐⭐⭐⭐⭐</span>
                </div>
                <p className="text-gray-600 text-sm">纹样源文件已开源，致敬传统手艺</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
