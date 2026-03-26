import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, UserPlus, Share2, MapPin, Sparkles, Award, TrendingUp } from 'lucide-react';
import { mockCreators, mockProducts } from '../data/mockData';
import { useState } from 'react';

const tabs = ['作品', '故事', '数据', '荣誉', '合作'];

export default function CreatorPage() {
  const { id } = useParams();
  const creator = mockCreators.find(c => c.id === id) || mockCreators[0];
  const [activeTab, setActiveTab] = useState('作品');
  const [isFollowing, setIsFollowing] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const creatorProducts = mockProducts.filter(p => p.supplier.id === 'sup-1');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">
        <img
          src={creator.cover}
          alt=""
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Back Button */}
        <Link to="/" className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{creator.name}</h1>
                <span className="text-2xl">{creator.levelIcon}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{creator.location}</span>
                <span>·</span>
                <span>{creator.country}</span>
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap gap-2 mb-4">
                {creator.certifications.map((cert, idx) => (
                  <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                    {cert}
                  </span>
                ))}
              </div>

              <p className="text-gray-600 text-sm mb-4">{creator.bio}</p>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{creator.stats.works}</div>
                  <div className="text-xs text-gray-500">作品</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{formatNumber(creator.stats.likes)}</div>
                  <div className="text-xs text-gray-500">获赞</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{creator.stats.followers}</div>
                  <div className="text-xs text-gray-500">粉丝</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-amber-600">¥{formatNumber(creator.stats.totalEarnings)}</div>
                  <div className="text-xs text-gray-500">收益</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                    isFollowing
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  {isFollowing ? '已关注' : '关注'}
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:border-amber-500">
                  <MessageCircle className="w-4 h-4" />
                  私信
                </button>
                <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-amber-500">
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Level Badge */}
            {creator.hotRank && (
              <div className="hidden md:block bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl p-4 text-white text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-1" />
                <div className="text-3xl font-bold">#{creator.hotRank}</div>
                <div className="text-xs opacity-80">热度榜</div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === '作品' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {creatorProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-amber-600 font-bold">¥{product.price}</span>
                      <span className="text-gray-400 text-xs">{product.stats.likes} ❤️</span>
                    </div>
                    <Link
                      to={`/cocreate/${product.id}`}
                      className="mt-3 flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-sm rounded-xl"
                    >
                      <Sparkles className="w-4 h-4" />
                      二创
                    </Link>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeTab === '故事' && creator.story && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">创作者故事</h3>
              <div className="space-y-4">
                {creator.story.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-500 to-rose-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {item.year}
                    </div>
                    <div className="flex-1 pb-4 border-l-2 border-gray-200 pl-4">
                      <p className="text-gray-800">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === '荣誉' && creator.badges && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">🏆 成就徽章</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {creator.badges.map((badge) => (
                  <div key={badge.id} className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-100 to-rose-100 rounded-2xl flex items-center justify-center text-3xl mb-2">
                      {badge.icon}
                    </div>
                    <p className="text-sm font-medium text-gray-800">{badge.name}</p>
                    <p className="text-xs text-gray-500">{badge.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === '数据' && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">📊 创作数据</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-amber-600">45,234</div>
                  <div className="text-sm text-gray-500">本月曝光</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600">3,456</div>
                  <div className="text-sm text-gray-500">访客数</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600">7.6%</div>
                  <div className="text-sm text-gray-500">转化率</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">85%</div>
                  <div className="text-sm text-gray-500">升级进度</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === '合作' && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">🤝 合作意向</h3>
              <p className="text-gray-600 mb-4">欢迎品牌合作、联名开发、教学培训等商务合作</p>
              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl font-medium">
                发送合作邀约
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
