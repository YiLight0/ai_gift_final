import { Heart, MessageCircle, Share2, ShoppingBag, Wand2, Play } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ShareModal from './ShareModal';

interface VideoCardProps {
  videoUrl: string;
  coverUrl: string;
  productName: string;
  productPrice: number;
  masterName: string;
  masterTitle: string;
  masterAvatar: string;
  brokerName?: string;
  likes: number;
  shares: number;
  coCreationCount: number;
  bgmName: string;
  onLike: () => void;
  onShare: () => void;
  onBuy: () => void;
  onCoCreate: () => void;
}

export default function VideoCard({
  videoUrl,
  coverUrl,
  productName,
  productPrice,
  masterName,
  masterTitle,
  masterAvatar,
  brokerName,
  likes,
  shares,
  coCreationCount,
  bgmName,
  onLike,
  onShare,
  onBuy,
  onCoCreate,
}: VideoCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [localLikes, setLocalLikes] = useState(likes);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoId = videoUrl.split('/').pop() || 'video';
  const shareUrl = `${window.location.origin}/video/${videoId}`;
  const shareTitle = `🎬 ${productName} - AI的礼物`;
  const shareDesc = `来看看${masterName}的作品，支持定制！`;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLocalLikes(prev => isLiked ? prev - 1 : prev + 1);
    onLike();
  };

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

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div className="relative bg-black rounded-2xl overflow-hidden shadow-xl group">
      {/* Video Layer */}
      <div className="relative aspect-[9/16] max-h-[70vh] mx-auto">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={coverUrl}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          onClick={togglePlay}
        />

        {/* Play Button Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Right Action Bar */}
        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4">
          {/* Master Avatar */}
          <div className="relative">
            <img
              src={masterAvatar}
              alt={masterName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
            />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">+</span>
            </div>
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex flex-col items-center"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isLiked ? 'bg-rose-500' : 'bg-white/20 backdrop-blur-sm'}`}>
              <Heart className={`w-6 h-6 ${isLiked ? 'text-white fill-current' : 'text-white'}`} />
            </div>
            <span className="text-white text-xs mt-1">{formatNumber(localLikes)}</span>
          </button>

          {/* Comment Button */}
          <button className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs mt-1">{shares}</span>
          </button>

          {/* Share Button */}
          <button onClick={() => setShowShare(true)} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs mt-1">{formatNumber(shares)}</span>
          </button>

          {/* Buy Button */}
          <button onClick={onBuy} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs mt-1">购买</span>
          </button>
        </div>

        {/* Bottom Info Layer */}
        <div className="absolute left-3 right-14 bottom-4">
          {/* Master Tag */}
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/80 backdrop-blur-sm rounded-full mb-2">
            <span className="text-white text-xs font-medium">{masterName}</span>
            <span className="text-white/80 text-xs">·</span>
            <span className="text-white/90 text-xs">{masterTitle}</span>
          </div>

          {/* Product Info */}
          <h3 className="text-white font-bold text-lg mb-1">{productName}</h3>
          <p className="text-red-400 font-semibold mb-2">¥{productPrice}</p>

          {/* Stats */}
          <div className="flex items-center gap-2 text-white/80 text-xs mb-2">
            <span>🔥 已有{coCreationCount}人二创视频转发</span>
            {brokerName && (
              <span>· 经纪人@{brokerName}推荐</span>
            )}
          </div>

          {/* Music Tag */}
          <div className="flex items-center gap-2 max-w-[200px]">
            <div className="flex items-center gap-1 text-white text-xs bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 truncate">
              <span className="text-lg">🎵</span>
              <span className="truncate">{bgmName}</span>
            </div>
          </div>
        </div>

        {/* Co-Create Button */}
        <button
          onClick={onCoCreate}
          className="absolute right-3 top-3 flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-full shadow-lg hover:shadow-xl transition-all group/btn"
        >
          <Wand2 className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">二创</span>
        </button>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        title={shareTitle}
        description={shareDesc}
        url={shareUrl}
        image={coverUrl}
      />
    </div>
  );
}
