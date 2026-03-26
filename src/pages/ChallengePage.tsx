import { Link } from 'react-router-dom';
import { Sparkles, Trophy, Users, Globe, Clock, ChevronRight, Play } from 'lucide-react';
import { mockChallenge, mockProducts } from '../data/mockData';

export default function ChallengePage() {
  const { tracks, jury, schedule, participants, countries, works } = mockChallenge;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm mb-6">
            <Globe className="w-4 h-4" />
            全球设计挑战赛
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🌍 {mockChallenge.title}
          </h1>
          <p className="text-xl text-white/90 mb-2">{mockChallenge.titleEn}</p>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            {mockChallenge.description}
          </p>

          <div className="flex items-center justify-center gap-8 text-white mb-8">
            <div>
              <div className="text-3xl font-bold">{participants.toLocaleString()}</div>
              <div className="text-sm opacity-80">参与人数</div>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div>
              <div className="text-3xl font-bold">{countries}</div>
              <div className="text-sm opacity-80">国家</div>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div>
              <div className="text-3xl font-bold">{works.toLocaleString()}</div>
              <div className="text-sm opacity-80">作品数</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-white text-amber-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all"
            >
              <Sparkles className="w-5 h-5" />
              立即参与
            </Link>
            <button className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-all">
              <Play className="w-5 h-5" />
              观看宣传片
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Tracks Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            三大赛道
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden group"
              >
                <div className="h-2 bg-gradient-to-r from-amber-500 to-rose-500" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{track.icon}</span>
                    <h3 className="text-xl font-bold text-gray-900">{track.name}</h3>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    {track.participants.toLocaleString()} 人参与
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-500">🥇</span>
                      <div>
                        <div className="text-sm font-medium text-gray-800">金奖</div>
                        <div className="text-xs text-gray-500">{track.rewards.gold}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400">🥈</span>
                      <div>
                        <div className="text-sm font-medium text-gray-800">银奖</div>
                        <div className="text-xs text-gray-500">{track.rewards.silver}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-700">🥉</span>
                      <div>
                        <div className="text-sm font-medium text-gray-800">铜奖</div>
                        <div className="text-xs text-gray-500">{track.rewards.bronze}</div>
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl font-medium group-hover:shadow-lg transition-all">
                    选择赛道
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Schedule Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 赛程安排</h2>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              {schedule.map((item, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-rose-500 rounded-xl flex items-center justify-center text-white font-bold mb-2">
                      {item.date}
                    </div>
                    <div className="text-sm text-gray-600 max-w-[80px]">{item.event}</div>
                  </div>
                  {idx < schedule.length - 1 && (
                    <div className="w-12 md:w-24 h-0.5 bg-gradient-to-r from-amber-500 to-rose-500 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Jury Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🏆 评审团</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jury.map((member, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.title}</p>
                <p className="text-sm text-amber-600">{member.institution}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Works */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">🔥 热门作品</h2>
            <Link to="/" className="flex items-center gap-1 text-amber-600 hover:text-amber-700">
              查看更多 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockProducts.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 truncate text-sm">{product.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-amber-600 font-bold text-sm">¥{product.price}</span>
                    <span className="text-gray-400 text-xs">{product.stats.likes} ❤️</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">准备好展示你的创意了吗？</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            加入我们，用AI重新诠释传统文化的魅力，让你的设计被世界看见。
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-amber-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all"
          >
            <Sparkles className="w-5 h-5" />
            立即报名参赛
          </Link>
        </section>
      </div>
    </div>
  );
}
