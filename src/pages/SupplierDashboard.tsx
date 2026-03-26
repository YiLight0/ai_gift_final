import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Package, MessageSquare, Settings, Bell, 
  TrendingUp, TrendingDown, Eye, Users, ShoppingCart, Sparkles,
  AlertCircle, Lightbulb, BarChart3, Palette, Video, DollarSign,
  Play, RotateCcw, Save, TestTube
} from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: '数据看板', icon: LayoutDashboard },
  { id: 'products', label: '商品管理', icon: Package },
  { id: 'messages', label: '消息中心', icon: MessageSquare },
  { id: 'agent', label: 'Agent配置', icon: Settings },
];

export default function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [agentConfig, setAgentConfig] = useState({
    name: '苗绣纹样Agent-龙阿姨工坊',
    welcomeMessage: '欢迎来到龙阿姨的苗绣世界！我是你的AI助手，可以帮你了解苗绣故事，或者一起设计专属纹样~',
    style: 'kind',
    colors: true,
    carriers: true,
    text: true,
    corePattern: false,
    craft: false,
    basePrice: 128,
    coCreatePrice: 20,
    authPrice: 10,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen sticky top-0">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                alt=""
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">龙阿姨工坊</h3>
                <p className="text-xs text-gray-500">西江苗寨</p>
              </div>
            </div>
          </div>
          
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <div className="flex items-center gap-4">
              <button className="p-2 bg-white rounded-xl border hover:border-amber-500">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="px-4 py-2 bg-white rounded-xl border hover:border-amber-500 text-sm">
                帮助
              </button>
            </div>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500 text-sm">今日曝光</span>
                    <span className="text-green-500 text-sm flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" /> +15%
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">5.2k</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500 text-sm">访客数</span>
                    <span className="text-green-500 text-sm flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" /> +8%
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">328</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500 text-sm">订单数</span>
                    <span className="text-green-500 text-sm flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" /> +20%
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">12</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500 text-sm">二创请求</span>
                    <span className="text-amber-500 text-sm">待处理: 8</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">45</div>
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">🔔 待办事项</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                    <span className="text-rose-700 text-sm">3个二创方案待确认（超过2小时未响应将降权）</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <span className="text-amber-700 text-sm">库存预警：靛蓝染料仅剩5份</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <Lightbulb className="w-5 h-5 text-green-500" />
                    <span className="text-green-700 text-sm">平台推荐：你的"蝴蝶纹"适合即将到来的七夕节，建议推出限定款</span>
                  </div>
                </div>
              </div>

              {/* Trends */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">📈 爆款趋势</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">本周热门：故宫红配色</span>
                    <span className="text-rose-500 font-medium">↑ 230%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">用户偏好：小件饰品转化率高于包袋</span>
                    <span className="text-amber-500 font-medium">+40%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Agent Config Tab */}
          {activeTab === 'agent' && (
            <div className="space-y-6">
              {/* Basic Settings */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">🤖 Agent基础设置</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Agent名称</label>
                    <input
                      type="text"
                      value={agentConfig.name}
                      onChange={(e) => setAgentConfig({...agentConfig, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">欢迎语</label>
                    <textarea
                      value={agentConfig.welcomeMessage}
                      onChange={(e) => setAgentConfig({...agentConfig, welcomeMessage: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">回复风格</label>
                    <div className="flex gap-2">
                      {['kind', 'professional', 'lively', 'mysterious'].map((style) => (
                        <button
                          key={style}
                          onClick={() => setAgentConfig({...agentConfig, style})}
                          className={`px-4 py-2 rounded-xl text-sm ${
                            agentConfig.style === style
                              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {style === 'kind' && '亲切'}
                          {style === 'professional' && '专业'}
                          {style === 'lively' && '活泼'}
                          {style === 'mysterious' && '神秘'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Knowledge Base */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">📚 知识库管理</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Palette className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <div className="font-medium text-gray-900">纹样库</div>
                    <div className="text-sm text-gray-500">50个图案</div>
                    <button className="mt-2 text-amber-600 text-sm hover:underline">上传新图案</button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Video className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="font-medium text-gray-900">工艺视频</div>
                    <div className="text-sm text-gray-500">12个视频</div>
                    <button className="mt-2 text-amber-600 text-sm hover:underline">上传视频</button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="font-medium text-gray-900">定价表</div>
                    <div className="text-sm text-gray-500">已设置</div>
                    <button className="mt-2 text-amber-600 text-sm hover:underline">修改</button>
                  </div>
                </div>
              </div>

              {/* Co-create Permissions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">🎨 二创权限设置</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">纹样开放程度</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                        <input type="radio" name="permission" className="w-4 h-4 text-amber-500" />
                        <span>完全开放（用户可任意修改）</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-amber-50 border-2 border-amber-500 rounded-xl cursor-pointer">
                        <input type="radio" name="permission" defaultChecked className="w-4 h-4 text-amber-500" />
                        <span className="font-medium">部分开放（仅允许改颜色/载体，核心图案不可改）</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                        <input type="radio" name="permission" className="w-4 h-4 text-amber-500" />
                        <span>仅授权（二创需支付授权费）</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">可修改元素</label>
                    <div className="flex flex-wrap gap-3">
                      <label className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-amber-500" />
                        <span>颜色</span>
                      </label>
                      <label className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-amber-500" />
                        <span>载体</span>
                      </label>
                      <label className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-amber-500" />
                        <span>加文字</span>
                      </label>
                      <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-amber-500" />
                        <span>核心图案</span>
                      </label>
                      <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-amber-500" />
                        <span>工艺</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">二创定价策略</label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">基础款</label>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">¥</span>
                          <input
                            type="number"
                            value={agentConfig.basePrice}
                            onChange={(e) => setAgentConfig({...agentConfig, basePrice: parseInt(e.target.value)})}
                            className="w-24 px-3 py-2 bg-gray-50 rounded-lg outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">二创加价</label>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">+¥</span>
                          <input
                            type="number"
                            value={agentConfig.coCreatePrice}
                            onChange={(e) => setAgentConfig({...agentConfig, coCreatePrice: parseInt(e.target.value)})}
                            className="w-24 px-3 py-2 bg-gray-50 rounded-lg outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">授权费</label>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">¥</span>
                          <input
                            type="number"
                            value={agentConfig.authPrice}
                            onChange={(e) => setAgentConfig({...agentConfig, authPrice: parseInt(e.target.value)})}
                            className="w-24 px-3 py-2 bg-gray-50 rounded-lg outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">📱 消费者视角预览</h3>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm">
                      <RotateCcw className="w-4 h-4" />
                      重置对话
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-xl text-sm text-amber-700">
                      <TestTube className="w-4 h-4" />
                      AI思考过程
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 overflow-hidden flex-shrink-0">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 bg-white rounded-xl rounded-tl-none p-3 shadow-sm">
                        <p className="text-sm text-gray-800">欢迎来到龙阿姨的苗绣世界！我是你的AI助手...</p>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <div className="flex-1 bg-gradient-to-r from-amber-500 to-rose-500 rounded-xl rounded-tr-none p-3 text-white text-sm">
                        这个蝴蝶纹能改成红色吗？
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 overflow-hidden flex-shrink-0">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 bg-white rounded-xl rounded-tl-none p-3 shadow-sm">
                        <p className="text-sm text-gray-800">可以呀！我们有三种红色可选：故宫红、酒红、桃红。你想看哪种效果？</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-700">💡 优化建议：检测到"颜色"类问题回复较慢（平均3秒），建议预加载色卡数据</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-amber-500">
                  保存草稿
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl">
                  <Save className="w-5 h-5" />
                  保存配置
                </button>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">商品管理</h3>
                <p className="text-gray-500">管理您的商品列表、库存和定价</p>
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">消息中心</h3>
                <p className="text-gray-500">查看用户咨询和订单消息</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
