import type { ComponentType } from 'react';
import { useState } from 'react';
import { X, Link2, Check, MessageCircle, Send, QrCode, Share2 } from 'lucide-react';

type ShareIconProps = {
  className?: string;
};

// Custom SVG icons for Chinese social platforms
const WechatIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.5 11c-.83 0-1.5-.67-1.5-1.5S7.67 8 8.5 8s1.5.67 1.5 1.5S9.33 11 8.5 11zm5 0c-.83 0-1.5-.67-1.5-1.5S12.67 8 13.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-5.5 5.5c2.5 0 4.5-1.5 4.5-3.5s-2-3.5-4.5-3.5c-1.8 0-3.24 1.08-3.9 2.57L2 12.07c.66-1.5 2.03-2.57 3.5-2.57zm5 0c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5z"/>
  </svg>
);

const WeiboIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.194.573zm.176-2.719c-1.893-.493-4.034.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.578-.18-.401-.649.386-1.029.422-1.925-.004-2.57-.801-1.207-2.924-1.114-5.357-.029 0 0-.782.347-.582-.285.621-1.953.152-3.338-.933-4.129-1.431-1.042-3.912-.378-6.023.919-1.807 1.109-2.864 2.553-2.663 3.95.12.831.73 1.535 1.378 2.023-.656.397-1.106.98-1.208 1.71-.17 1.238.653 2.438 1.831 2.676 1.183.236 2.313-.432 2.525-1.494.086-.428-.012-.802-.218-1.121.548-.243 1.156-.336 1.75-.301 1.988.12 3.501 1.604 3.501 3.415 0 1.014-.549 1.962-1.419 2.559-1.646 1.129-4.044.938-5.516-.4-1.215-1.104-1.624-2.724-.994-4.231.17-.407.396-.78.63-1.136.18-.276.145-.665-.113-.857-.602-.444-.977-.98-.977-1.584 0-1.064 1.328-1.606 2.361-1.638.515-.018.992.087 1.44.242-.06-.286-.098-.576-.098-.869 0-2.054 1.778-3.802 4.062-3.802 2.063 0 3.759 1.496 4.041 3.472.06.436.06.853.018 1.262.514-.35 1.154-.548 1.854-.548 1.73 0 3.165 1.193 3.415 2.75.127.788-.035 1.519-.382 2.096-.228.379-.518.669-.816.916z"/>
  </svg>
);

const XiaohongshuIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c.83 0 1.5.67 1.5 1.5S12.83 8 12 8s-1.5-.67-1.5-1.5S11.17 5 12 5zm4.5 13H12v-1h4.5c.28 0 .5.22.5.5s-.22.5-.5.5z"/>
  </svg>
);

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: ComponentType<ShareIconProps>;
  color: string;
  shareUrl: (url: string, title: string) => string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    id: 'douyin',
    name: '抖音',
    icon: ({ className }) => <span className={className}>🎵</span>,
    color: '#000000',
    shareUrl: (url: string, title: string) => `https://www.douyin.com/share/video`
  },
  {
    id: 'xiaohongshu',
    name: '小红书',
    icon: XiaohongshuIcon,
    color: '#FE2C55',
    shareUrl: (url: string, title: string) => `xhsdiscover://search?keyword=${encodeURIComponent(title)}`
  },
  {
    id: 'wechat',
    name: '微信',
    icon: WechatIcon,
    color: '#07C160',
    shareUrl: (url: string, title: string) => `weixin://dl/chat?text=${encodeURIComponent(title + ' ' + url)}`
  },
  {
    id: 'weibo',
    name: '微博',
    icon: WeiboIcon,
    color: '#E6162D',
    shareUrl: (url: string, title: string) => `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
  },
  {
    id: 'bilibili',
    name: 'B站',
    icon: ({ className }) => <span className={className}>📺</span>,
    color: '#FB7299',
    shareUrl: (url: string, title: string) => `https://bilibili.com`
  },
  {
    id: 'wechatMoments',
    name: '朋友圈',
    icon: MessageCircle,
    color: '#07C160',
    shareUrl: (url: string, title: string) => `weixin://dl/moments?text=${encodeURIComponent(title + ' ' + url)}`
  },
  {
    id: 'qq',
    name: 'QQ',
    icon: Send,
    color: '#12B7F5',
    shareUrl: (url: string, title: string) => `mqqapi://share/to_fri?file_type=web&src_i=1&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&image_url=${encodeURIComponent(url)}`
  },
  {
    id: 'copy',
    name: '复制链接',
    icon: Link2,
    color: '#6366F1',
    shareUrl: () => ''
  },
];

export default function ShareModal({ isOpen, onClose, title = 'AI的礼物', description = '发现独特的AI生成礼物，连接传统文化与现代创意', url = window.location.href, image }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  const handleShare = (platform: typeof socialPlatforms[0]) => {
    if (platform.id === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    // Open share URL in new window
    const shareUrl = platform.shareUrl(url, title);
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
        onClose();
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">分享到</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Share Options */}
        <div className="p-4">
          {/* Mobile Native Share */}
          {'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full mb-4 p-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              <Share2 className="w-5 h-5" />
              分享给好友
            </button>
          )}

          {/* Social Platforms Grid */}
          <div className="grid grid-cols-4 gap-3">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <button
                  key={platform.id}
                  onClick={() => handleShare(platform)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-lg"
                    style={{ backgroundColor: platform.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-700 font-medium">{platform.name}</span>
                </button>
              );
            })}
          </div>

          {/* QR Code Section */}
          <div className="mt-6 pt-4 border-t">
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <QrCode className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">显示二维码</span>
              </div>
              <span className="text-gray-400">
                {showQR ? '▲' : '▼'}
              </span>
            </button>

            {showQR && (
              <div className="mt-4 flex flex-col items-center p-4 bg-white border rounded-xl">
                {/* QR Code Placeholder */}
                <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                  <div className="w-40 h-40 bg-gradient-to-br from-red-100 to-rose-100 rounded-lg flex items-center justify-center">
                    <div className="grid grid-cols-5 gap-1">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded-sm ${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-white'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">扫码分享给朋友</p>
              </div>
            )}
          </div>

          {/* Copy Link Feedback */}
          {copied && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-xl flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">链接已复制到剪贴板</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <p className="text-xs text-center text-gray-400">
            分享来自「{title}」
          </p>
        </div>
      </div>
    </div>
  );
}

// Share button component for embedding in other places
export function ShareButton({
  className = '',
  size = 'md',
  title,
  description,
  url,
  image
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`${sizeClasses[size]} bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors ${className}`}
        >
          <Share2 className={`w-5 h-5 text-gray-600 ${size === 'lg' ? 'w-6 h-6' : ''}`} />
        </button>

        {/* Dropdown for quick access */}
        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border p-2 z-50 min-w-[200px]">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  setShowModal(true);
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">分享到...</span>
              </button>
              <div className="border-t my-2" />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(url || window.location.href);
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Link2 className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">复制链接</span>
              </button>
            </div>
          </>
        )}
      </div>

      <ShareModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={title}
        description={description}
        url={url}
        image={image}
      />
    </>
  );
}
