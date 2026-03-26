import { X, Gift, Share2, Heart, Copy, CheckCheck } from 'lucide-react';
import { Product } from '../data/mockData';
import { useState } from 'react';

interface GiftModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const presetMessages = [
  '祝你天天开心！🎉',
  '这份礼物代表我的心意 💝',
  '愿你永远幸福美好 ✨',
  '想和你分享这份美好 🌸',
  '定制专属，只为你 🎁'
];

const friendOptions = [
  { id: '1', name: '小红', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { id: '2', name: '小明', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: '3', name: '爸妈', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
];

export default function GiftModal({ product, isOpen, onClose }: GiftModalProps) {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerateCard = () => {
    setShowCard(true);
  };

  const handleCopyLink = () => {
    const link = `https://ai-gift.com/gift/${product.id}?from=friend&msg=${encodeURIComponent(customMessage)}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWechat = () => {
    const link = `https://ai-gift.com/gift/${product.id}?from=friend&msg=${encodeURIComponent(customMessage)}`;
    window.open(`https://qrcode.chanima.net/qr?text=${encodeURIComponent(link)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Gift className="w-6 h-6 text-red-500" />
            送给朋友
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {!showCard ? (
            <>
              {/* Product Preview */}
              <div className="flex gap-3 p-3 bg-red-50 rounded-2xl mb-4">
                <img src={product.images[0]} alt={product.name} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-red-600 font-bold">¥{product.price}</p>
                  <p className="text-gray-500 text-sm">{product.supplier.name}</p>
                </div>
              </div>

              {/* Friend Selection */}
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-3">选择好友</h3>
                <div className="flex gap-3">
                  {friendOptions.map((friend) => (
                    <button
                      key={friend.id}
                      onClick={() => setSelectedFriend(friend.id)}
                      className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                        selectedFriend === friend.id
                          ? 'bg-red-100 ring-2 ring-red-500'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <img src={friend.avatar} alt={friend.name} className="w-14 h-14 rounded-full mb-2" />
                      <span className="text-sm font-medium text-gray-700">{friend.name}</span>
                    </button>
                  ))}
                  <button className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all">
                    <div className="w-14 h-14 rounded-full mb-2 bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white text-2xl">
                      +
                    </div>
                    <span className="text-sm font-medium text-gray-700">添加</span>
                  </button>
                </div>
              </div>

              {/* Message Selection */}
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-3">祝福语</h3>
                <div className="grid grid-cols-1 gap-2">
                  {presetMessages.map((msg, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCustomMessage(msg)}
                      className={`p-3 rounded-xl text-left text-sm transition-all ${
                        customMessage === msg
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {msg}
                    </button>
                  ))}
                </div>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="或输入自定义祝福语..."
                  className="w-full mt-3 p-3 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={2}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleGenerateCard}
                disabled={!selectedFriend}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  selectedFriend
                    ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                生成礼物卡片
              </button>
            </>
          ) : (
            /* Gift Card Preview */
            <div className="text-center">
              {/* Card */}
              <div className="relative bg-gradient-to-br from-red-100 via-red-50 to-rose-100 rounded-3xl p-6 mb-4 shadow-lg">
                <div className="absolute top-4 right-4">
                  <span className="text-4xl">🎁</span>
                </div>
                <img src={product.images[0]} alt={product.name} className="w-32 h-32 rounded-2xl mx-auto mb-4 object-cover shadow-md" />
                <h3 className="font-bold text-gray-800 text-lg mb-1">{product.name}</h3>
                <p className="text-red-600 font-bold text-xl mb-2">¥{product.price}</p>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <img src={friendOptions.find(f => f.id === selectedFriend)?.avatar} alt="" className="w-8 h-8 rounded-full" />
                  <span className="text-gray-600 text-sm">{friendOptions.find(f => f.id === selectedFriend)?.name} 送你</span>
                </div>
                {customMessage && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-sm text-gray-700 italic">
                    "{customMessage}"
                  </div>
                )}
                <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-xs">
                  <Heart className="w-4 h-4" />
                  <span>来自 AI的礼物</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  {copied ? <CheckCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? '已复制' : '复制链接'}
                </button>
                <button
                  onClick={shareToWechat}
                  className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  分享好友
                </button>
              </div>

              <button
                onClick={() => setShowCard(false)}
                className="w-full mt-3 py-2 text-gray-500 text-sm hover:text-gray-700"
              >
                返回修改
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
