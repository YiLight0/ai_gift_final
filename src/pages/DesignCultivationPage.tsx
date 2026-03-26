import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Users, Award, Crown, Star, Zap, Shield, Flame } from 'lucide-react';

const cultivationLevels = [
  {
    id: 'lianqi',
    name: '炼气期',
    icon: '🌱',
    color: 'green',
    description: '初入设计之门，开始学习基础纹样知识',
    requirements: '完成平台注册，获得10次点赞',
    benefits: ['基础纹样素材库', '初级AI工具', '社群交流权限'],
    users: 12580,
    nextLevel: '筑基期',
  },
  {
    id: 'zhuji',
    name: '筑基期',
    icon: '🌿',
    color: 'emerald',
    description: '掌握基本设计技能，能够独立完成简单创作',
    requirements: '发布5件作品，获得100次点赞',
    benefits: ['进阶纹样素材库', '高级AI工具', '作品打赏功能', '线下活动邀请'],
    users: 4567,
    nextLevel: '金丹期',
  },
  {
    id: 'jindan',
    name: '金丹期',
    icon: '🌸',
    color: 'amber',
    description: '设计能力日益精进，开始形成个人风格',
    requirements: '作品累计销售100件，获得500点赞',
    benefits: ['专业纹样素材库', '优先AI渲染', '个人主页定制', '平台分成提升至70%'],
    users: 1234,
    nextLevel: '元婴期',
  },
  {
    id: 'yuanying',
    name: '元婴期',
    icon: '🌺',
    color: 'orange',
    description: '成为平台核心创作者，影响力显著提升',
    requirements: '累计收入10000元，带出10名学徒',
    benefits: ['独家纹样授权', '专属客服支持', '商业合作优先', '分成提升至80%', '年度盛典邀请'],
    users: 456,
    nextLevel: 'huashen',
  },
  {
    id: 'huashen',
    name: '化神期',
    icon: '👑',
    color: 'rose',
    description: '设计界的大师级人物，引领行业潮流',
    requirements: '累计收入100000元，全球粉丝超过10000',
    benefits: ['大师专属标识', '纹样永久版权收益', '分成提升至90%', '品牌联名机会', '国际展览参与', '平台合伙人权益'],
    users: 89,
    nextLevel: null,
  },
];

const featuredMasters = [
  {
    name: '龙阿姨',
    level: '化神期',
    icon: '👑',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    works: 234,
    earnings: 456000,
    followers: 12300,
  },
  {
    name: 'Marco Rossi',
    level: '元婴期',
    icon: '🌺',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    works: 156,
    earnings: 89000,
    followers: 5678,
  },
  {
    name: '李设计师',
    level: '金丹期',
    icon: '🌸',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    works: 89,
    earnings: 45000,
    followers: 3456,
  },
];

const userStats = {
  currentLevel: '筑基期',
  levelIndex: 1,
  totalXp: 2450,
  nextLevelXp: 3000,
  works: 12,
  likes: 345,
  earnings: 1280,
  followers: 89,
};

export default function DesignCultivationPage() {
  const formatNumber = (num: number) => {
    if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const xpProgress = (userStats.totalXp / userStats.nextLevelXp) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <section className="mb-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-8 md:p-12">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">🎭</span>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                设计修仙体系
              </h1>
            </div>
            <p className="text-white/80 text-lg max-w-2xl mb-6">
              从炼气期到化神期，每一次创作都是一次修炼。在这里，你的每一件作品、每一次互动都在积累修为，助你飞升设计之巅。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/creator/creator-1"
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                <Star className="w-5 h-5" />
                查看我的修为
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* User Progress */}
      <section className="mb-10">
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-4xl">
              🌿
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">当前境界：筑基期</h2>
              <p className="text-gray-500">距离金丹期还需 550 修为</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-amber-500 to-rose-500 h-3 rounded-full transition-all"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 bg-amber-50 rounded-2xl">
              <Sparkles className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{userStats.works}</p>
              <p className="text-sm text-gray-500">作品数</p>
            </div>
            <div className="text-center p-4 bg-rose-50 rounded-2xl">
              <Flame className="w-6 h-6 text-rose-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{userStats.likes}</p>
              <p className="text-sm text-gray-500">获赞数</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">¥{userStats.earnings}</p>
              <p className="text-sm text-gray-500">累计收入</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-2xl">
              <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{userStats.followers}</p>
              <p className="text-sm text-gray-500">粉丝数</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cultivation Levels */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Crown className="w-6 h-6 text-amber-500" />
          境界一览
        </h2>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 via-amber-400 to-rose-500 transform -translate-x-1/2 hidden md:block" />

          <div className="space-y-6">
            {cultivationLevels.map((level, index) => (
              <div
                key={level.id}
                className={`relative ${index % 2 === 0 ? 'md:pr-[52%]' : 'md:pl-[52%]'} `}
              >
                <div
                  className={`bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all ${
                    index === userStats.levelIndex ? 'ring-4 ring-amber-400' : ''
                  }`}
                >
                  {index === userStats.levelIndex && (
                    <div className="absolute -top-3 left-4 px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                      当前境界
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                      level.color === 'green' ? 'bg-green-100' :
                      level.color === 'emerald' ? 'bg-emerald-100' :
                      level.color === 'amber' ? 'bg-amber-100' :
                      level.color === 'orange' ? 'bg-orange-100' :
                      'bg-rose-100'
                    }`}>
                      {level.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-800">{level.name}</h3>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {formatNumber(level.users)} 人
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{level.description}</p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">晋升条件</p>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">{level.requirements}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">解锁权益</p>
                          <div className="flex flex-wrap gap-1">
                            {level.benefits.map((benefit, i) => (
                              <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {level.nextLevel && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                          <span>晋升下一境界：</span>
                          <span className="font-medium text-purple-600">{level.nextLevel}</span>
                          <Zap className="w-4 h-4 text-amber-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Masters */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Award className="w-6 h-6 text-rose-500" />
          修仙榜
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredMasters.map((master, index) => (
            <div
              key={master.name}
              className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-4">
                {index === 0 && <span className="absolute -top-2 -right-2 text-2xl">🥇</span>}
                {index === 1 && <span className="absolute -top-2 -right-2 text-2xl">🥈</span>}
                {index === 2 && <span className="absolute -top-2 -right-2 text-2xl">🥉</span>}
                <img src={master.avatar} alt={master.name} className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-100" />
                <div>
                  <h3 className="font-bold text-gray-800">{master.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-xl">{master.icon}</span>
                    <span className="text-amber-600">{master.level}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <p className="font-bold text-gray-800">{master.works}</p>
                  <p className="text-xs text-gray-500">作品</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-xl">
                  <p className="font-bold text-gray-800">{formatNumber(master.followers)}</p>
                  <p className="text-xs text-gray-500">粉丝</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-xl">
                  <p className="font-bold text-gray-800">¥{formatNumber(master.earnings)}</p>
                  <p className="text-xs text-gray-500">收入</p>
                </div>
              </div>
              <Link
                to="/creator/creator-1"
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-sm font-medium rounded-xl hover:shadow-md transition-all"
              >
                <Shield className="w-4 h-4" />
                向他学习
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Summary */}
      <section className="mb-10">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">修仙者专属权益</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="font-semibold mb-2">AI能力解锁</h3>
              <p className="text-gray-400 text-sm">随着境界提升，解锁更强大的AI创作工具</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">分成比例提升</h3>
              <p className="text-gray-400 text-sm">从60%逐步提升至90%，让你的创作更有价值</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">专属社群</h3>
              <p className="text-gray-400 text-sm">每个境界都有专属社群，与同阶创作者交流</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-rose-400" />
              </div>
              <h3 className="font-semibold mb-2">线下活动</h3>
              <p className="text-gray-400 text-sm">高阶修仙者可参与国际展览、大师工坊等活动</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
