import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Sparkles, Shield, Gift, Users, TrendingUp, CheckCircle2, ArrowRight, Award, Star, Zap } from 'lucide-react';

type InvitationType = 'gold' | 'silver' | 'bronze';
type Step = 'select' | 'apply' | 'success';

const invitationBenefits = {
  gold: {
    name: '黄金邀请码',
    color: 'amber',
    icon: '🥇',
    benefits: [
      '专属客户经理一对一服务',
      '优先获得平台流量扶持',
      '参与重要商业合作项目',
      '年度颁奖典礼VIP邀请',
      '专属线上直播推广机会',
    ],
    price: '¥9,980',
    priceNote: '原价 ¥19,980，限时优惠',
  },
  silver: {
    name: '白银邀请码',
    color: 'gray',
    icon: '🥈',
    benefits: [
      '专业运营团队支持',
      '每月主题活动推荐',
      '数据分析报告订阅',
      '线上社群资源对接',
      '优先审核权',
    ],
    price: '¥4,980',
    priceNote: '原价 ¥9,980，限时优惠',
  },
  bronze: {
    name: '青铜邀请码',
    color: 'orange',
    icon: '🥉',
    benefits: [
      '基础运营指导',
      '每月2次推广曝光',
      '作品集优化建议',
      '加入创作者社群',
    ],
    price: '¥1,980',
    priceNote: '原价 ¥3,980，限时优惠',
  },
};

const showcaseCreators = [
  {
    name: '陈工艺',
    type: '非遗传承人',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    cover: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    story: '景德镇青花瓷传承人，通过平台将传统技艺与现代设计结合，作品远销海外',
    revenue: '¥120,000+/年',
    products: 45,
  },
  {
    name: '张设计师',
    type: '独立设计师',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    story: '专注于中国传统纹样的现代诠释，作品被多家博物馆收藏',
    revenue: '¥85,000+/年',
    products: 32,
  },
  {
    name: '李刺绣',
    type: '刺绣艺术家',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    cover: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
    story: '苏绣第五代传人，开设线上工坊培训学员超过2000人',
    revenue: '¥200,000+/年',
    products: 78,
  },
];

const testimonials = [
  {
    name: '龙阿姨',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    text: '入驻平台后，我的苗绣作品被更多人认识了。现在每个月收入比以前翻了三倍！',
    level: '化神期',
  },
  {
    name: 'Peter Rossi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    text: 'The platform helped me bridge Eastern and Western design aesthetics. Truly amazing experience!',
    level: '元婴期',
  },
  {
    name: '小林',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    text: '作为一个设计新手，平台的AI工具帮我快速成长，现在已经是金丹期了！',
    level: '金丹期',
  },
];

export default function MasterOnboardingPage() {
  const [selectedType, setSelectedType] = useState<InvitationType>('gold');
  const [step, setStep] = useState<Step>('select');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    profession: '',
    experience: '',
    invitationCode: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setStep('success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-6">
          <Crown className="w-4 h-4" />
          大师邀请制入驻
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          成为<span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">AI的礼物</span>认证大师
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-8">
          我们相信真正的大师需要被看见、被尊重、被赋能。通过黄金、白银、青铜三级邀请制，
          我们为每一位认证大师提供量身定制的成长支持与商业机会。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => document.getElementById('invitation')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            <Sparkles className="w-5 h-5" />
            立即申请入驻
          </button>
          <Link
            to="/challenge"
            className="inline-flex items-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-full font-semibold border border-gray-200 hover:border-amber-300 transition-all"
          >
            了解设计挑战赛
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-amber-500 mb-1">1,280+</p>
            <p className="text-gray-500 text-sm">认证大师</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-rose-500 mb-1">56</p>
            <p className="text-gray-500 text-sm">覆盖国家</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-purple-500 mb-1">¥2.3M</p>
            <p className="text-gray-500 text-sm">累计分成</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-green-500 mb-1">90%</p>
            <p className="text-gray-500 text-sm">最高分成比</p>
          </div>
        </div>
      </section>

      {/* Invitation Tiers */}
      <section id="invitation" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Award className="w-6 h-6 text-amber-500" />
          选择您的入驻方案
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {(Object.keys(invitationBenefits) as InvitationType[]).map((type) => {
            const tier = invitationBenefits[type];
            const isSelected = selectedType === type;
            return (
              <div
                key={type}
                className={`relative bg-white rounded-3xl p-6 shadow-lg transition-all cursor-pointer ${
                  isSelected ? 'ring-4 ring-amber-400 shadow-xl transform -translate-y-2' : 'hover:shadow-xl'
                }`}
                onClick={() => setSelectedType(type)}
              >
                {isSelected && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-white text-sm font-medium rounded-full">
                    已选择
                  </div>
                )}
                <div className="text-center mb-6">
                  <span className="text-5xl mb-3 block">{tier.icon}</span>
                  <h3 className="text-xl font-bold text-gray-800">{tier.name}</h3>
                  <p className="text-3xl font-bold text-amber-600 mt-2">{tier.price}</p>
                  <p className="text-sm text-gray-400">{tier.priceNote}</p>
                </div>
                <div className="space-y-3 mb-6">
                  {tier.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setStep('apply')}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  选择此方案
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Application Form */}
      {step === 'apply' && (
        <section className="mb-12">
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">提交入驻申请</h3>
                <p className="text-gray-500 text-sm">{invitationBenefits[selectedType].name}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名/艺名 *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="请输入您的姓名或艺名"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">手机号 *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="请输入手机号"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="请输入邮箱"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">职业/领域 *</label>
                <select
                  required
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">请选择您的职业领域</option>
                  <option value="feiyi">非遗传承人</option>
                  <option value="designer">独立设计师</option>
                  <option value="artist">艺术家/插画师</option>
                  <option value="museum">博物馆/文化机构</option>
                  <option value="school">设计院校/师生</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邀请码</label>
                <input
                  type="text"
                  value={formData.invitationCode}
                  onChange={(e) => setFormData({ ...formData, invitationCode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="如有邀请码请输入，可享受额外优惠"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">自我介绍/作品简介</label>
                <textarea
                  rows={4}
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  placeholder="请介绍您的背景、擅长领域、代表作品等"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                提交申请
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Success State */}
      {step === 'success' && (
        <section className="mb-12">
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-xl text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">申请已提交！</h3>
            <p className="text-gray-600 mb-6">
              我们将在1-3个工作日内审核您的申请，请保持手机/邮箱畅通。
              审核通过后，专属客服将第一时间与您联系。
            </p>
            <div className="bg-amber-50 rounded-2xl p-6 mb-6">
              <p className="text-amber-800 font-medium mb-2">您的申请信息</p>
              <div className="text-left text-sm text-amber-700 space-y-1">
                <p>姓名：{formData.name}</p>
                <p>手机：{formData.phone}</p>
                <p>邮箱：{formData.email}</p>
                <p>方案：{invitationBenefits[selectedType].icon} {invitationBenefits[selectedType].name}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                返回首页
              </Link>
              <button
                onClick={() => {
                  setStep('select');
                  setFormData({ name: '', phone: '', email: '', profession: '', experience: '', invitationCode: '' });
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
              >
                重新申请
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Creator Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Users className="w-6 h-6 text-rose-500" />
          大师风采
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {showcaseCreators.map((creator) => (
            <div key={creator.name} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <div className="relative h-40">
                <img src={creator.cover} alt="" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-4 -mb-8">
                  <img src={creator.avatar} alt={creator.name} className="w-16 h-16 rounded-full border-4 border-white object-cover" />
                </div>
              </div>
              <div className="p-4 pt-10">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-800">{creator.name}</h3>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">{creator.type}</span>
                </div>
                <p className="text-gray-500 text-sm mb-3">{creator.story}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">作品：{creator.products}</span>
                  <span className="text-green-600 font-medium">{creator.revenue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Gift className="w-6 h-6 text-amber-500" />
          大师说
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-gray-800">{t.name}</h4>
                  <span className="text-sm text-amber-600">{t.level}</span>
                </div>
              </div>
              <p className="text-gray-600 italic">"{t.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Shield className="w-6 h-6 text-purple-500" />
          常见问题
        </h2>
        <div className="space-y-4">
          {[
            {
              q: '入驻需要什么资质？',
              a: '我们欢迎各类设计师、非遗传承人、艺术家入驻。只要您有独特的设计理念或传统文化技艺，都欢迎申请。',
            },
            {
              q: '邀请码费用包含什么？',
              a: '费用包含入驻服务费、平台工具使用权、运营支持等。不同等级享受不同深度的服务支持。',
            },
            {
              q: '分成比例是多少？',
              a: '基础分成60%，随着境界提升（修仙体系）可提升至最高90%。黄金邀请码用户首年享受70%分成。',
            },
            {
              q: '审核需要多久？',
              a: '一般情况下1-3个工作日内完成审核。黄金邀请码用户可享受优先审核通道。',
            },
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                {faq.q}
              </h4>
              <p className="text-gray-600 text-sm pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">准备好开启您的设计之旅了吗？</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            加入我们，成为全球设计文化传承的一份子。让您的作品被世界看见，让传统手艺焕发新生。
          </p>
          <button
            onClick={() => {
              setStep('apply');
              document.getElementById('invitation')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 bg-white text-amber-600 px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            <Sparkles className="w-5 h-5" />
            立即申请入驻
          </button>
        </div>
      </section>
    </div>
  );
}
