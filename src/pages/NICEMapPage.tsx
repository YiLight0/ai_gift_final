import { useState } from 'react';
import {
  Map, MapPin, Filter, List, Globe, Building, Cpu, Palette, Rocket,
  ChevronDown, ChevronUp, Star, Clock, Users, Zap, CheckCircle2,
  Printer, Crosshair, Share2, ExternalLink, GraduationCap
} from 'lucide-react';
import { nicePartners, niceGlobalStats, academicPartners, NICERole, NICEPartner } from '../data/mockData';
import ShareModal from '../components/ShareModal';
import NICEInteractiveMap from '../components/NICEInteractiveMapWrapper';

type ViewMode = 'map' | 'list';
type NICEFilter = 'all' | 'N' | 'I' | 'C' | 'E';
type CapabilityFilter = 'all' | '3d' | 'laser' | 'ai' | 'heritage' | 'bookable';

const roleConfig = {
  N: {
    name: '地点/空间',
    color: '#2DADA8',
    lightColor: '#E6F7F6',
    icon: Building,
    emoji: '🏛️',
    description: '政府/文旅/场馆'
  },
  I: {
    name: '技术/智造',
    color: '#6366F1',
    lightColor: '#EEF2FF',
    icon: Cpu,
    emoji: '⚡',
    description: 'AI大模型/智造设备'
  },
  C: {
    name: '文化/IP',
    color: '#DC2626',
    lightColor: '#FEE2E2',
    icon: Palette,
    emoji: '🎭',
    description: '非遗大师/文化IP'
  },
  E: {
    name: '创业/人才',
    color: '#F97316',
    lightColor: '#FFEDD5',
    icon: Rocket,
    emoji: '🚀',
    description: '创业者/学生'
  }
};

const machineIcons: Record<string, string> = {
  '3d-fdm': '🖨️',
  '3d-sla': '🖨️',
  '3d-clay': '🏺',
  'cnc': '⚙️',
  'laser': '🔥',
  'print': '🎨',
  'robot': '🤖'
};

export default function NICEMapPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedRole, setSelectedRole] = useState<NICEFilter>('all');
  const [selectedCapability, setSelectedCapability] = useState<CapabilityFilter>('all');
  const [selectedPartner, setSelectedPartner] = useState<NICEPartner | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredPartner, setHoveredPartner] = useState<string | null>(null);

  const filteredPartners = nicePartners.filter(partner => {
    // Role filter
    if (selectedRole !== 'all' && partner.type !== selectedRole) return false;

    // Capability filter
    if (selectedCapability !== 'all') {
      if (selectedCapability === '3d' && !partner.machines?.some(m => m.type.includes('3d'))) return false;
      if (selectedCapability === 'laser' && !partner.machines?.some(m => m.type === 'laser')) return false;
      if (selectedCapability === 'ai' && !partner.robotArtist) return false;
      if (selectedCapability === 'heritage' && partner.type !== 'C') return false;
      if (selectedCapability === 'bookable' && !partner.machines?.some(m => m.instantMake)) return false;
    }

    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-amber-500';
      case 'idle': return 'bg-blue-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-8 h-8 text-amber-500" />
                <h1 className="text-2xl font-bold text-gray-900">NICE Global 产业地图</h1>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                全球创意产业基础设施
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    viewMode === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  地图
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                  列表
                </button>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                筛选
                {selectedRole !== 'all' || selectedCapability !== 'all' ? (
                  <span className="w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                    {(selectedRole !== 'all' ? 1 : 0) + (selectedCapability !== 'all' ? 1 : 0)}
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          {/* NICE Global Stats Bar */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">全球在线创作者</span>
              <span className="font-bold text-gray-900">{niceGlobalStats.onlineCreators.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-600">活跃机器人艺术家</span>
              <span className="font-bold text-gray-900">{niceGlobalStats.activeRobotArtists}</span>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-rose-500" />
              <span className="text-sm text-gray-600">今日产出艺术品</span>
              <span className="font-bold text-gray-900">{niceGlobalStats.dailyArtworks.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Role Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">合作伙伴类型</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedRole('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedRole === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    全部
                  </button>
                  {(Object.keys(roleConfig) as NICERole[]).map(role => {
                    const config = roleConfig[role];
                    return (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedRole === role
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={{
                          backgroundColor: selectedRole === role ? config.color : undefined
                        }}
                      >
                        <span>{config.emoji}</span>
                        <span>{role}</span>
                        <span className="text-xs opacity-75">- {config.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Capability Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">能力筛选</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCapability('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCapability === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    全部
                  </button>
                  <button
                    onClick={() => setSelectedCapability('3d')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCapability === '3d' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🖨️ 可3D打印
                  </button>
                  <button
                    onClick={() => setSelectedCapability('laser')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCapability === 'laser' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🔥 可激光雕刻
                  </button>
                  <button
                    onClick={() => setSelectedCapability('ai')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCapability === 'ai' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🤖 有大模型
                  </button>
                  <button
                    onClick={() => setSelectedCapability('heritage')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCapability === 'heritage' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🎭 非遗驻场
                  </button>
                  <button
                    onClick={() => setSelectedCapability('bookable')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCapability === 'bookable' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ✨ 可预约/立等可取
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {viewMode === 'map' ? (
          /* Map View */
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map Container */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Interactive Map with Realistic Tiles */}
                <NICEInteractiveMap
                  partners={filteredPartners}
                  selectedPartner={selectedPartner}
                  onPartnerSelect={setSelectedPartner}
                  selectedRole={selectedRole}
                  selectedCapability={selectedCapability}
                />
              </div>
            </div>

            {/* Partner Detail Panel */}
            <div className="lg:col-span-1">
              {selectedPartner ? (
                <PartnerDetail partner={selectedPartner} onClose={() => setSelectedPartner(null)} />
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">点击地图上的标记查看详情</p>
                  <p className="text-sm text-gray-400 mt-2">
                    共找到 {filteredPartners.length} 个合作伙伴
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {(Object.keys(roleConfig) as NICERole[]).map(role => {
              const partners = filteredPartners.filter(p => p.type === role);
              if (partners.length === 0) return null;

              const config = roleConfig[role];

              return (
                <div key={role} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div
                    className="px-6 py-4 flex items-center gap-3"
                    style={{ backgroundColor: config.lightColor }}
                  >
                    <span
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{ backgroundColor: config.color }}
                    >
                      {config.emoji}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{role} - {config.name}</h3>
                      <p className="text-sm text-gray-600">{config.description} ({partners.length}个)</p>
                    </div>
                  </div>

                  <div className="divide-y">
                    {partners.map(partner => (
                      <button
                        key={partner.id}
                        onClick={() => setSelectedPartner(partner)}
                        className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex-shrink-0">
                          {partner.robotArtist ? (
                            <img
                              src={partner.robotArtist.avatar}
                              alt=""
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : partner.type === 'N' ? (
                            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-2xl">
                              🏛️
                            </div>
                          ) : partner.type === 'C' ? (
                            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-2xl">
                              🎭
                            </div>
                          ) : partner.type === 'E' ? (
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
                              🚀
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                              ⚡
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{partner.name}</h4>
                          <p className="text-sm text-gray-500 truncate">{partner.address}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {partner.robotArtist && (
                              <span className="text-xs text-purple-600 flex items-center gap-1">
                                <Cpu className="w-3 h-3" />
                                {partner.robotArtist.name}
                              </span>
                            )}
                            {partner.machines && (
                              <span className="text-xs text-gray-400">
                                {partner.machines.length}台设备
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          {partner.robotArtist ? (
                            <span
                              className={`w-2 h-2 rounded-full ${
                                partner.robotArtist.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                              }`}
                            />
                          ) : partner.machines ? (
                            <span
                              className={`w-2 h-2 rounded-full ${getStatusColor(partner.machines[0].status)}`}
                            />
                          ) : null}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Robot Artists Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Cpu className="w-8 h-8 text-purple-500" />
            机器人艺术家
            <span className="text-sm font-normal text-gray-500">AI驱动的创意伙伴</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nicePartners
              .filter(p => p.robotArtist)
              .map(partner => {
                const robot = partner.robotArtist!;
                return (
                  <div
                    key={robot.id}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-32 bg-gradient-to-br from-purple-400 to-indigo-500">
                      <img
                        src={robot.avatar}
                        alt={robot.name}
                        className="w-full h-full object-cover opacity-50"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-white text-xl font-bold">{robot.name}</p>
                          <p className="text-white/80 text-sm">{robot.model}</p>
                        </div>
                      </div>
                      <span
                        className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                          robot.status === 'online'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-400 text-white'
                        }`}
                      >
                        {robot.status === 'online' ? '在线' : '离线'}
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          {robot.style}
                        </span>
                        <span className="text-sm text-gray-500">
                          今日 {robot.dailyOutput} 件
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">驻场：{partner.address}</p>

                      <div className="space-y-1">
                        {robot.specialties.map((s, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>

                      <button className="w-full mt-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-md transition-all">
                        与TA共创
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* Academic Partners Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-amber-500" />
            全球学术网络
            <span className="text-sm font-normal text-gray-500">NICE合作伙伴院校</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {academicPartners.map(school => (
              <div
                key={school.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={school.avatar}
                      alt={school.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{school.name}</h4>
                      <p className="text-sm text-gray-500">{school.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                      {school.type}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">专注领域：</span>
                    {school.focus}
                  </p>

                  <div className="space-y-1">
                    {school.projects.map((p, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                        <ExternalLink className="w-3 h-3" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// Partner Detail Component
function PartnerDetail({ partner, onClose }: { partner: NICEPartner; onClose: () => void }) {
  const config = roleConfig[partner.type];
  const [showShare, setShowShare] = useState(false);

  const shareUrl = `${window.location.origin}/nice/${partner.id}`;
  const shareTitle = `${config.emoji} ${partner.name} - NICE Global产业地图`;
  const shareDesc = partner.description || `探索${partner.name}的AI创意服务`;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-32">
      {/* Header */}
      <div
        className="p-6"
        style={{ backgroundColor: config.lightColor }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: config.color }}
            >
              {config.emoji}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{partner.name}</h3>
              <p className="text-sm text-gray-600">{config.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Info */}
        <div>
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{partner.address}</span>
          </div>
          <p className="text-gray-600">{partner.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {partner.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Robot Artist */}
        {partner.robotArtist && (
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-500" />
              机器人艺术家
            </h4>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={partner.robotArtist.avatar}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{partner.robotArtist.name}</p>
                  <p className="text-sm text-purple-600">{partner.robotArtist.style}</p>
                </div>
                <span
                  className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                    partner.robotArtist.status === 'online'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {partner.robotArtist.status === 'online' ? '在线' : '离线'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <div>模型：{partner.robotArtist.model}</div>
                <div>今日产出：{partner.robotArtist.dailyOutput}件</div>
              </div>
              <div className="space-y-1">
                {partner.robotArtist.specialties.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Machines */}
        {partner.machines && partner.machines.length > 0 && (
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Printer className="w-5 h-5 text-cyan-500" />
              智造设备 ({partner.machines.length})
            </h4>
            <div className="space-y-3">
              {partner.machines.map(machine => (
                <div
                  key={machine.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <span className="text-2xl">{machineIcons[machine.type] || '⚙️'}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{machine.name}</p>
                    {machine.specs && (
                      <p className="text-xs text-gray-500">{machine.specs}</p>
                    )}
                    {machine.materials && (
                      <p className="text-xs text-gray-500">
                        可用材料：{machine.materials.join('、')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        machine.status === 'online'
                          ? 'bg-green-100 text-green-700'
                          : machine.status === 'busy'
                          ? 'bg-amber-100 text-amber-700'
                          : machine.status === 'idle'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {machine.status === 'online' ? '空闲' : machine.status === 'busy' ? '使用中' : machine.status === 'idle' ? '待命' : '离线'}
                    </span>
                    {machine.instantMake && (
                      <p className="text-xs text-green-600 mt-1">✨ 立等可取</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events */}
        {partner.events && partner.events.length > 0 && (
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              活动安排
            </h4>
            <div className="space-y-2">
              {partner.events.map((event, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                  <span className="text-gray-700">{event.name}</span>
                  <span className="text-sm text-amber-600">{event.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Creations */}
        {partner.creations && partner.creations.length > 0 && (
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Palette className="w-5 h-5 text-rose-500" />
              代表作品
            </h4>
            <div className="space-y-2">
              {partner.creations.map((creation, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">{creation.name}</span>
                  <div className="text-right">
                    <span className="font-medium text-amber-600">¥{creation.price}</span>
                    {creation.limited && (
                      <p className="text-xs text-rose-500">限量{creation.limited}件</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        {partner.stats && (
          <div className="border-t pt-6">
            <div className="grid grid-cols-3 gap-4">
              {partner.stats.partners && (
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">{partner.stats.partners}</p>
                  <p className="text-xs text-gray-500">合作伙伴</p>
                </div>
              )}
              {partner.stats.creators && (
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600">{partner.stats.creators}</p>
                  <p className="text-xs text-gray-500">创作者</p>
                </div>
              )}
              {partner.stats.entrepreneurs && (
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-orange-600">{partner.stats.entrepreneurs}</p>
                  <p className="text-xs text-gray-500">创业者</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="border-t pt-6 space-y-3">
          <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-all">
            查看详情 & 导航
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setShowShare(true)}
              className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              分享
            </button>
            {partner.machines?.some(m => m.instantMake) && (
              <button className="flex-1 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors">
                立即预约
              </button>
            )}
          </div>
        </div>

        {/* Share Modal */}
        <ShareModal
          isOpen={showShare}
          onClose={() => setShowShare(false)}
          title={shareTitle}
          description={shareDesc}
          url={shareUrl}
        />
      </div>
    </div>
  );
}
