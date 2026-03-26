import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Save, Send, Mic, Image, Sparkles, Check, Wand2, RefreshCw, Loader2 } from 'lucide-react';
import { mockProducts, ChatMessage } from '../data/mockData';
import { useState, useRef, useEffect } from 'react';

interface DesignOption {
  id: string;
  name: string;
  image: string;
  price: number;
  prompt?: string;
}

// Demo AI image templates - in production, these would come from a real AI API
const demoImages = [
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', // Traditional style
  'https://images.unsplash.com/photo-1569470451072-68314f596aec?w=400&h=400&fit=crop', // Modern style
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop', // Fusion style
];

const styleVariations = [
  { name: '传统风格', suffix: 'traditional Chinese pattern style' },
  { name: '现代风格', suffix: 'modern minimalist design' },
  { name: '融合风格', suffix: 'fusion of East and West elements' },
];

export default function CoCreatePage() {
  const { id } = useParams();
  const product = mockProducts.find(p => p.id === id) || mockProducts[0];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'agent',
      content: '你好！我是AI纹样设计师。基于这个「' + product.name + '」纹样，我可以帮你：\n\n1. 🎨 换颜色（传统蓝/莫兰迪/赛博朋克）\n2. ✨ 换元素（蝴蝶→龙凤→花草）\n3. ✏️ 加文字（你的名字/祝福语）\n4. 📦 换载体（托特包→丝巾→手机壳）\n\n直接告诉我你想要的设计，或者点击下方的"AI生成"按钮来创建专属纹样！',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesigns, setGeneratedDesigns] = useState<DesignOption[]>([]);
  const [userPrompt, setUserPrompt] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, generatedDesigns]);

  // Simulate AI image generation with progress
  const generateWithAI = async () => {
    if (!userPrompt.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedDesigns([]);

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: '🎨 ' + userPrompt,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI generation process with 3 steps
    const steps = [
      { progress: 20, message: '正在分析你的设计需求...' },
      { progress: 40, message: '正在提取传统纹样元素...' },
      { progress: 60, message: '正在融合现代设计理念...' },
      { progress: 80, message: '正在渲染设计方案...' },
      { progress: 100, message: '设计方案生成完成！' },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress(step.progress);
    }

    // Generate 3 design variations
    const designs: DesignOption[] = styleVariations.map((style, i) => ({
      id: `gen_${Date.now()}_${i}`,
      name: `AI设计方案 ${i + 1} (${style.name})`,
      image: demoImages[i],
      price: product.price + (product.patternData?.coCreateAddPrice || 20) + (i * 15),
      prompt: userPrompt + ', ' + style.suffix
    }));

    setGeneratedDesigns(designs);

    // Add agent response
    const agentMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'agent',
      content: `太棒了！我已经根据你的描述「${userPrompt}」生成了3个AI设计方案：\n\n🎨 方案1（传统风格）- 保留经典纹样，色彩典雅\n✨ 方案2（现代风格）- 简约时尚，适合年轻人\n🌟 方案3（融合风格）- 东西合璧，创意十足\n\n你可以选择喜欢的进行下单~`,
      timestamp: new Date(),
      designs: designs as any
    };
    setMessages(prev => [...prev, agentMessage]);
    setIsGenerating(false);
    setUserPrompt('');
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response with suggestions
    setTimeout(() => {
      const suggestions = [
        '你可以试试：把颜色换成莫兰迪色系\n\n或者直接告诉我你想要的设计，我来帮你生成！',
        '试试加入龙凤元素，会更有东方韵味\n\n或者点击"AI生成"按钮描述你的想法~',
        '加上一句祝福语吧，比如"福"或"寿"\n\n也可以直接说"帮我设计一个生日礼物"~'
      ];
      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: suggestions[Math.floor(Math.random() * suggestions.length)],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={`/product/${product.id}`} className="p-2 hover:bg-gray-100 rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-semibold text-gray-800">AI二创设计</h1>
                <p className="text-xs text-gray-500">{product.supplier.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-xl">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl">
                <Save className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Product Info */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex gap-4">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-24 h-24 rounded-xl object-cover"
            />
            <div>
              <h2 className="font-semibold text-gray-800">{product.name}</h2>
              <p className="text-sm text-gray-500 mb-2">{product.supplier.name}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-red-600 font-bold">¥{product.price}</span>
                <span className="text-gray-400">+</span>
                <span className="text-rose-500">二创加价 ¥{product.patternData?.coCreateAddPrice || 20}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Generation Section */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-red-500" />
            AI智能生成
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full ml-2">演示模式</span>
          </h3>
          <div className="space-y-3">
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder={`描述你想要的设计，例如：\n• 把蝴蝶换成龙凤纹样\n• 使用莫兰迪色系\n• 添加金色边框\n• 加入"福"字元素`}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-red-500 resize-none"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={generateWithAI}
                disabled={isGenerating || !userPrompt.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI正在生成中... {generationProgress}%
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    AI生成设计方案
                  </>
                )}
              </button>
              <button
                onClick={() => setUserPrompt('')}
                className="p-3 hover:bg-gray-100 rounded-xl"
                title="清除"
              >
                <RefreshCw className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Quick prompts */}
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">快速模板（点击添加）：</p>
            <div className="flex flex-wrap gap-2">
              {[
                { text: '传统蓝色系', icon: '🎨' },
                { text: '赛博朋克风格', icon: '🤖' },
                { text: '加入金色元素', icon: '✨' },
                { text: '莫兰迪配色', icon: '🌸' },
                { text: '龙凤纹样', icon: '🐉' },
                { text: '添加"福"字', icon: '🧧' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setUserPrompt(prev => prev + (prev ? '，' : '') + item.text)}
                  className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full hover:bg-red-100 transition-colors"
                >
                  {item.icon} {item.text}
                </button>
              ))}
            </div>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="mt-4">
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {generationProgress < 30 && '正在分析设计需求...'}
                {generationProgress >= 30 && generationProgress < 60 && '正在生成纹样...'}
                {generationProgress >= 60 && generationProgress < 90 && '正在渲染细节...'}
                {generationProgress >= 90 && '即将完成...'}
              </p>
            </div>
          )}
        </div>

        {/* Generated Designs Preview */}
        {(generatedDesigns.length > 0 || isGenerating) && (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-500" />
              生成的纹样方案
            </h3>
            {isGenerating ? (
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse flex items-center justify-center flex-col">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-2" />
                    <span className="text-xs text-gray-400">生成中...</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {generatedDesigns.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => setSelectedDesign(design.id)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                      selectedDesign === design.id
                        ? 'border-red-500 ring-2 ring-red-200'
                        : 'border-transparent hover:border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <img
                      src={design.image}
                      alt={design.name}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="text-white font-medium text-sm">{design.name}</p>
                      <p className="text-white/80 text-sm">¥{design.price}</p>
                    </div>
                    {selectedDesign === design.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chat Messages */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 min-h-[300px]">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-500" />
            与【AI纹样设计师】对话
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden ${
                  message.role === 'agent' ? 'bg-red-100' : 'bg-rose-100'
                } flex items-center justify-center`}>
                  {message.role === 'agent' ? (
                    <Sparkles className="w-5 h-5 text-red-500" />
                  ) : (
                    <span className="text-lg">👤</span>
                  )}
                </div>
                <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block px-4 py-3 rounded-2xl ${
                    message.role === 'agent'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                  }`}>
                    <p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-red-500" />
                </div>
                <div className="inline-block px-4 py-3 rounded-2xl bg-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Options */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
          {[
            { id: 'color', icon: '🎨', label: '换颜色' },
            { id: 'element', icon: '✨', label: '换元素' },
            { id: 'text', icon: '✏️', label: '加文字' },
            { id: 'carrier', icon: '📦', label: '换载体' },
            { id: 'random', icon: '🎲', label: '随机生成' }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => {
                const prompts: Record<string, string> = {
                  color: '使用莫兰迪色系，配色柔和优雅',
                  element: '将蝴蝶纹样换成龙凤呈祥元素',
                  text: '添加一个金色的"福"字',
                  carrier: '设计适合印在丝巾上的图案',
                  random: '融合东西方元素，现代与传统结合'
                };
                setUserPrompt(prompts[option.id] || '');
              }}
              className="flex-shrink-0 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-red-500 hover:bg-red-50 transition-all"
            >
              {option.icon} {option.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="告诉我你想要的设计..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
            />
            <button className="p-3 hover:bg-gray-100 rounded-xl">
              <Mic className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-3 hover:bg-gray-100 rounded-xl">
              <Image className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={handleSend}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selected Design Action */}
        {selectedDesign && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">
                  已选择：{generatedDesigns.find(d => d.id === selectedDesign)?.name}
                </p>
                <p className="text-red-600 font-bold">
                  ¥{generatedDesigns.find(d => d.id === selectedDesign)?.price}
                </p>
              </div>
              <button className="px-8 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                确认并下单
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Spacer for fixed bottom bar */}
      {selectedDesign && <div className="h-24" />}
    </div>
  );
}
