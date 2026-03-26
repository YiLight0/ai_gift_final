import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Play, Pause, Wand2, Music, Sparkles, QrCode,
  ChevronLeft, Check, Copy, Share2, Download, RefreshCw, ChevronDown,
  CheckCircle2, Video, Send, Heart, X, ExternalLink, MessageCircle
} from 'lucide-react';
import { mockVideos, quickTextOptions, quickBgmOptions } from '../data/mockData';

type TabType = 'text' | 'music' | 'effect';
type TemplateType = 'culture' | 'funny' | 'gift';

const templates = [
  { id: 'culture', name: '文化叙事版', emoji: '🏛️', description: '适合展示传统文化底蕴' },
  { id: 'funny', name: '搞笑出圈版', emoji: '😄', description: '轻松有趣，更易传播' },
  { id: 'gift', name: '送礼祝福版', emoji: '🎁', description: '适合作为礼物推荐' },
];

const effects = [
  { id: 'glow', name: '非遗光晕', emoji: '✨' },
  { id: 'text', name: '动态字幕', emoji: '💬' },
  { id: 'qr', name: '购物码', emoji: '📱' },
];

interface GeneratedVideo {
  id: string;
  thumbnail: string;
  style: string;
  styleName: string;
  views: number;
  duration: string;
}

// Social platform configurations
const socialPlatforms = [
  {
    id: 'douyin',
    name: '抖音',
    icon: '🎵',
    color: 'bg-black',
    shareUrl: (title: string, desc: string) => `https://www.douyin.com/share/video`,
    description: '分享到抖音'
  },
  {
    id: 'xiaohongshu',
    name: '小红书',
    icon: '📕',
    color: 'bg-red-500',
    shareUrl: (title: string, desc: string) => `https://www.xiaohongshu.com/share/note`,
    description: '分享到小红书'
  },
  {
    id: 'wechat',
    name: '微信',
    icon: '💬',
    color: 'bg-green-500',
    shareUrl: (title: string, desc: string) => `weixin://`,
    description: '分享到微信'
  },
  {
    id: 'weibo',
    name: '微博',
    icon: '🌊',
    color: 'bg-orange-500',
    shareUrl: (title: string, desc: string) => `https://service.weibo.com/share/share.php`,
    description: '分享到微博'
  },
  {
    id: 'bilibili',
    name: 'B站',
    icon: '📺',
    color: 'bg-pink-500',
    shareUrl: (title: string, desc: string) => `https://bilibili.com`,
    description: '分享到B站'
  },
  {
    id: 'qq',
    name: 'QQ',
    icon: '🐧',
    color: 'bg-blue-500',
    shareUrl: (title: string, desc: string) => `https://qm.qq.com`,
    description: '分享到QQ'
  },
  {
    id: 'moments',
    name: '朋友圈',
    icon: '👥',
    color: 'bg-green-600',
    shareUrl: (title: string, desc: string) => `weixin://`,
    description: '分享到朋友圈'
  },
  {
    id: 'copy',
    name: '复制链接',
    icon: '🔗',
    color: 'bg-purple-500',
    shareUrl: () => '',
    description: '复制链接'
  },
];

export default function VideoCoCreationPage() {
  const { id } = useParams();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('culture');
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [selectedText, setSelectedText] = useState<string>('');
  const [customText, setCustomText] = useState('');
  const [selectedBgm, setSelectedBgm] = useState<string>('');
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<GeneratedVideo | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [currentGeneratingIndex, setCurrentGeneratingIndex] = useState(-1);
  const [copySuccess, setCopySuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const video = mockVideos.find(v => v.id === id) || mockVideos[0];

  // Always show share button if videos exist
  const hasVideos = generatedVideos.length > 0;

  useEffect(() => {
    if (quickTextOptions.length > 0) {
      setSelectedText(quickTextOptions[0]);
    }
    if (quickBgmOptions.length > 0) {
      setSelectedBgm(quickBgmOptions[0].name);
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleEffect = (effectId: string) => {
    setSelectedEffects(prev =>
      prev.includes(effectId)
        ? prev.filter(e => e !== effectId)
        : [...prev, effectId]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratingProgress(0);
    setGeneratedVideos([]);
    setSelectedVideo(null);

    const videoStyles: GeneratedVideo[] = [
      {
        id: '1',
        style: 'overview',
        styleName: '产品概述版',
        thumbnail: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400',
        views: 0,
        duration: '10秒'
      },
      {
        id: '2',
        style: 'scene',
        styleName: '使用场景版',
        thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
        views: 0,
        duration: '8秒'
      },
      {
        id: '3',
        style: 'highlight',
        styleName: '优势卖点版',
        thumbnail: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400',
        views: 0,
        duration: '6秒'
      },
    ];

    const newVideos: GeneratedVideo[] = [];
    for (let i = 0; i < 3; i++) {
      setGeneratingProgress((i / 3) * 100);
      setCurrentGeneratingIndex(i);

      await new Promise(resolve => setTimeout(resolve, 2000));

      newVideos.push({
        ...videoStyles[i],
        id: `generated-${Date.now()}-${i}`,
        views: Math.floor(Math.random() * 5000) + 1000,
      });
      setGeneratedVideos([...newVideos]);
    }

    setGeneratingProgress(100);
    setCurrentGeneratingIndex(-1);
    await new Promise(resolve => setTimeout(resolve, 500));

    setIsGenerating(false);
    setSelectedVideo(newVideos[0]);
    setShowShareModal(true);
  };

  const handleShare = (platformId: string) => {
    const shareTitle = `${video.productName} - ${selectedVideo?.styleName || 'AI生成的独特礼物视频'}`;
    const shareDesc = `#非遗新花样 #AI的礼物`;
    const shareUrl = `${window.location.origin}/video/${video.id}?ref=share&style=${selectedVideo?.style}`;

    switch (platformId) {
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        break;
      case 'wechat':
      case 'moments':
        // For WeChat, show instructions since direct sharing requires QR code scan
        alert('微信分享：请长按保存视频，或使用电脑端微信扫码分享');
        break;
      case 'douyin':
        window.open(`https://www.douyin.com/share/video`, '_blank');
        break;
      case 'xiaohongshu':
        window.open(`https://www.xiaohongshu.com/share/note`, '_blank');
        break;
      case 'weibo':
        window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle + ' ' + shareDesc)}`, '_blank');
        break;
      case 'bilibili':
        window.open(`https://bilibili.com`, '_blank');
        break;
      case 'qq':
        window.open(`https://qm.qq.com`, '_blank');
        break;
      default:
        break;
    }
  };

  const handleDownload = () => {
    alert(`正在下载: ${selectedVideo?.styleName || '视频'}\n格式: MP4\n分辨率: 1080p\n时长: ${selectedVideo?.duration || '10秒'}`);
  };

  const getShareUrl = () => {
    return `${window.location.origin}/video/${video.id}?ref=share&style=${selectedVideo?.style}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      {/* Floating Share Button */}
      {selectedVideo && (
        <button
          onClick={() => setShowShareModal(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white rounded-full font-bold text-lg shadow-2xl hover:scale-105 transition-all animate-bounce"
        >
          <Share2 className="w-6 h-6" />
          <span>分享视频</span>
        </button>
      )}

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ChevronLeft className="w-5 h-5" />
              返回
            </Link>
            <h1 className="text-xl font-bold text-gray-900">视频二创工作台</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">视频时长：6-10秒</span>
            {generatedVideos.length > 0 && (
              <button
                onClick={() => { setGeneratedVideos([]); setSelectedVideo(null); setShowShareModal(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                重新生成
              </button>
            )}
            {selectedVideo && (
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Share2 className="w-4 h-4" />
                分享
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Preview Area */}
          <div className="space-y-6">
            {/* Video Preview */}
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                src={selectedVideo ? video.videoUrl : undefined}
                poster={selectedVideo?.thumbnail || video.coverUrl}
                className="w-full aspect-[9/16] max-h-[600px] mx-auto object-cover"
                loop
                muted
                playsInline
              />

              {/* Empty State */}
              {!selectedVideo && !isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black/80">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                      <Video className="w-12 h-12 text-white/50" />
                    </div>
                    <p className="text-white/70 text-lg font-medium">点击下方"生成视频"</p>
                    <p className="text-white/50 text-sm mt-2">将为你生成3个不同风格的短视频</p>
                  </div>
                </div>
              )}

              {/* Generating Overlay */}
              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center animate-pulse">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-white text-lg font-bold">正在生成视频...</p>
                    <p className="text-white/70 text-sm mt-2">
                      {currentGeneratingIndex >= 0 ? `生成第 ${currentGeneratingIndex + 1}/3 个视频` : '准备中...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Play/Pause Overlay */}
              {selectedVideo && !isGenerating && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                >
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-gray-800" fill="currentColor" />
                    ) : (
                      <Play className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" />
                    )}
                  </div>
                </button>
              )}

              {/* Style Badge */}
              {selectedVideo && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-medium rounded-full shadow-lg">
                  {selectedVideo.styleName}
                </div>
              )}

              {/* Duration Badge */}
              {selectedVideo && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 text-white text-sm font-medium rounded-full">
                  ⏱️ {selectedVideo.duration}
                </div>
              )}

              {/* Share Button Overlay */}
              {selectedVideo && !isGenerating && (
                <button
                  onClick={() => setShowShareModal(true)}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                >
                  <div className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white rounded-full font-bold text-lg shadow-2xl group-hover:scale-110 transition-all">
                    <Share2 className="w-6 h-6" />
                    <span>点击分享</span>
                  </div>
                </button>
              )}

              {/* Product Info */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-gradient-to-t from-black/80 to-transparent pt-8 pb-4 px-4 rounded-b-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{video.productName}</p>
                      <p className="text-amber-400 font-bold">¥{video.productPrice}</p>
                    </div>
                    <Link
                      to={`/product/${video.productId}`}
                      className="px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                      查看详情
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <img src={video.masterAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-medium text-gray-900">{video.masterName}</p>
                  <p className="text-sm text-gray-500">{video.masterTitle}</p>
                </div>
                {video.brokerName && (
                  <>
                    <div className="text-gray-300">|</div>
                    <div>
                      <p className="text-sm text-gray-500">经纪人</p>
                      <p className="font-medium text-red-600">@{video.brokerName}</p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {video.likes}</span>
                <span className="flex items-center gap-1"><Share2 className="w-4 h-4" /> {video.shares}</span>
                <span>🔥 {video.coCreationCount}人二创</span>
              </div>
              {generatedVideos.length > 0 && (
                <button
                  onClick={() => setShowShareModal(true)}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  <span>分享到社交媒体</span>
                </button>
              )}
            </div>

            {/* Generation Progress */}
            {isGenerating && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                  <div>
                    <p className="font-semibold text-gray-900">AI正在生成视频...</p>
                    <p className="text-sm text-gray-500">
                      已生成 {generatedVideos.length}/3 个视频
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-red-500 to-rose-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${generatingProgress}%` }}
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  {generatedVideos.map((v) => (
                    <div key={v.id} className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-700">{v.styleName}</span>
                    </div>
                  ))}
                  {[...Array(3 - generatedVideos.length)].map((_, i) => (
                    <div key={`pending-${i}`} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-gray-400">生成中...</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Editor Panel */}
          <div className="space-y-6">
            {/* Template Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-amber-500" />
                选择模板
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {templates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id as TemplateType)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedTemplate === t.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{t.emoji}</span>
                    <p className="font-medium text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Edit Tools Tabs */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'text' ? 'text-red-600 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  换文案
                </button>
                <button
                  onClick={() => setActiveTab('music')}
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'music' ? 'text-red-600 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  换音乐
                </button>
                <button
                  onClick={() => setActiveTab('effect')}
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'effect' ? 'text-red-600 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  加特效
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'text' && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">推荐文案（点击选择）</p>
                      <div className="space-y-2">
                        {quickTextOptions.map((text, idx) => (
                          <button
                            key={idx}
                            onClick={() => { setSelectedText(text); setCustomText(''); }}
                            className={`w-full text-left p-3 rounded-xl text-sm transition-all ${
                              selectedText === text && !customText
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {text}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">自定义文案（最多20字）</p>
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => { setCustomText(e.target.value.slice(0, 20)); setSelectedText(''); }}
                        placeholder="输入你的专属文案..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        maxLength={20}
                      />
                      <p className="text-xs text-gray-400 mt-1 text-right">{customText.length}/20</p>
                    </div>
                  </div>
                )}

                {activeTab === 'music' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-700">推荐音乐</p>
                      <button className="text-xs text-red-600 flex items-center gap-1">
                        <span>抖音热歌榜</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {quickBgmOptions.map(bgm => (
                        <button
                          key={bgm.id}
                          onClick={() => setSelectedBgm(bgm.name)}
                          className={`p-3 rounded-xl text-left transition-all ${
                            selectedBgm === bgm.name
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{bgm.emoji}</span>
                            <span className="text-sm font-medium truncate">{bgm.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'effect' && (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">添加特效（可多选）</p>
                    <div className="grid grid-cols-3 gap-3">
                      {effects.map(effect => (
                        <button
                          key={effect.id}
                          onClick={() => toggleEffect(effect.id)}
                          className={`p-4 rounded-xl text-center transition-all ${
                            selectedEffects.includes(effect.id)
                              ? 'bg-amber-100 text-amber-800 border-2 border-red-500'
                              : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                          }`}
                        >
                          <span className="text-2xl mb-2 block">{effect.emoji}</span>
                          <p className="text-sm font-medium">{effect.name}</p>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      💡 特效将在生成的视频中自动添加
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Share Button - Always Visible */}
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 rounded-2xl p-4 border-2 border-amber-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-amber-500" />
                分享功能
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                点击下方按钮生成视频后，即可分享到各大社交平台！
              </p>
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="flex flex-col items-center gap-1 p-2 bg-white rounded-lg">
                  <span className="text-xl">🎵</span>
                  <span className="text-xs text-gray-600">抖音</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-white rounded-lg">
                  <span className="text-xl">📕</span>
                  <span className="text-xs text-gray-600">小红书</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-white rounded-lg">
                  <span className="text-xl">💬</span>
                  <span className="text-xs text-gray-600">微信</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-white rounded-lg">
                  <span className="text-xl">🌊</span>
                  <span className="text-xs text-gray-600">微博</span>
                </div>
              </div>
              <button
                onClick={() => hasVideos && setShowShareModal(true)}
                disabled={!hasVideos}
                className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  hasVideos
                    ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Share2 className="w-5 h-5" />
                <span>{hasVideos ? '分享视频' : '先生成视频再分享'}</span>
              </button>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                isGenerating
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white hover:shadow-xl hover:scale-[1.02]'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>生成中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>生成我的短视频</span>
                </>
              )}
            </button>

            {/* Tips */}
            <div className="bg-gradient-to-r from-amber-50 to-rose-50 rounded-2xl p-4 border border-amber-200">
              <p className="text-sm text-amber-800">
                <span className="font-bold">💡 使用提示：</span>
                <br />
                1. 每次生成3个不同风格的6-10秒视频
                <br />
                2. 选择最喜欢的一个分享到社交媒体
                <br />
                3. 分享到抖音/小红书可获得额外流量扶持！
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">🎉 分享视频</h2>
                  <p className="text-gray-500 text-sm mt-1">选择你喜欢的一个视频分享到社交媒体</p>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Video Selection Grid */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-amber-500" />
                  选择要分享的视频
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {generatedVideos.map((v, index) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVideo(v)}
                      className={`relative rounded-xl overflow-hidden transition-all ${
                        selectedVideo?.id === v.id
                          ? 'ring-4 ring-red-500 scale-105 shadow-xl'
                          : 'hover:scale-102 shadow-lg'
                      }`}
                    >
                      <img
                        src={v.thumbnail}
                        alt={v.styleName}
                        className="w-full aspect-[9/16] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-medium text-sm">{v.styleName}</p>
                        <p className="text-white/70 text-xs">⏱️ {v.duration}</p>
                      </div>
                      {selectedVideo?.id === v.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Video Preview */}
              {selectedVideo && (
                <div className="bg-gradient-to-r from-amber-50 to-rose-50 rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedVideo.thumbnail}
                      alt=""
                      className="w-20 h-20 rounded-xl object-cover shadow-lg"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{selectedVideo.styleName}</p>
                      <p className="text-sm text-gray-600">{video.productName}</p>
                      <p className="text-xs text-gray-400 mt-1">⏱️ {selectedVideo.duration} | 📐 1080p | 🎬 25fps</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Share to Social Media */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-amber-500" />
                  分享到
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {socialPlatforms.map(platform => (
                    <button
                      key={platform.id}
                      onClick={() => handleShare(platform.id)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-all group"
                    >
                      <div className={`w-14 h-14 ${platform.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <span className="text-2xl">{platform.icon}</span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Copy Link Section */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-600 mb-3">或者复制链接分享：</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={getShareUrl()}
                    readOnly
                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600"
                  />
                  <button
                    onClick={() => handleShare('copy')}
                    className={`px-6 py-2 rounded-xl font-medium transition-all ${
                      copySuccess
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:opacity-90'
                    }`}
                  >
                    {copySuccess ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                {copySuccess && (
                  <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    链接已复制到剪贴板！
                  </p>
                )}
              </div>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:shadow-xl transition-all"
              >
                <Download className="w-5 h-5" />
                保存视频到本地
              </button>

              {/* Commission Info */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 text-center border border-green-200">
                <p className="text-green-800 font-bold flex items-center justify-center gap-2">
                  💰 分享成交后，可获得 5% 佣金分成
                </p>
                <p className="text-green-600 text-sm mt-2">
                  已有 12,345 位创作者获得佣金，立即分享赚钱！
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
