import { Gift, Heart, Sparkles, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface ActivityItem {
  id: string;
  type: 'gift' | 'like' | 'cocreate' | 'follow';
  user: string;
  target: string;
  time: string;
  avatar: string;
}

const mockActivities: ActivityItem[] = [
  { id: '1', type: 'gift', user: '小美', target: '苗绣蝴蝶包', time: '刚刚', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { id: '2', type: 'like', user: 'Peter', target: '敦煌飞天丝巾', time: '1分钟前', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: '3', type: 'cocreate', user: '小红', target: '同济樱花马克杯', time: '2分钟前', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
  { id: '4', type: 'gift', user: 'John', target: '景德镇茶具套装', time: '3分钟前', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
  { id: '5', type: 'follow', user: 'Alice', target: '龙阿姨工坊', time: '5分钟前', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
  { id: '6', type: 'cocreate', user: '小明', target: '苏绣团扇', time: '6分钟前', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  { id: '7', type: 'gift', user: 'Sarah', target: '苗绣蝴蝶包', time: '8分钟前', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
];

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [visibleActivities, setVisibleActivities] = useState<ActivityItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    // Initialize with first few activities
    setActivities(mockActivities);
    setVisibleActivities(mockActivities.slice(0, 4));
    indexRef.current = 4;

    // Add new activity every 3-5 seconds
    const interval = setInterval(() => {
      const randomActivity = mockActivities[Math.floor(Math.random() * mockActivities.length)];
      const newActivity = {
        ...randomActivity,
        id: Date.now().toString(),
        time: '刚刚',
      };

      setActivities(prev => {
        const updated = [newActivity, ...prev];
        // Keep only last 20
        return updated.slice(0, 20);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activities.length <= 4) return;

    const interval = setInterval(() => {
      setVisibleActivities(current => {
        if (activities.length <= 4) return current;

        const nextIndex = indexRef.current % activities.length;
        indexRef.current = nextIndex + 1;

        // Get the next 4 activities starting from nextIndex
        const newVisible: ActivityItem[] = [];
        for (let i = 0; i < 4; i++) {
          newVisible.push(activities[(nextIndex + i) % activities.length]);
        }
        return newVisible;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activities]);

  // Auto-close after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExpanded(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'gift': return <Gift className="w-4 h-4 text-rose-500" />;
      case 'like': return <Heart className="w-4 h-4 text-red-500" />;
      case 'cocreate': return <Sparkles className="w-4 h-4 text-red-500" />;
      case 'follow': return <UserPlus className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'gift': return `送给了好友「${activity.target}」`;
      case 'like': return `点赞了「${activity.target}」`;
      case 'cocreate': return `二创了「${activity.target}」`;
      case 'follow': return `关注了「${activity.target}」`;
      default: return '';
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-12'}`}>
      {/* Toggle Button */}
      <button
        onClick={toggleExpanded}
        className={`absolute top-1/2 -translate-y-1/2 ${isExpanded ? '-right-4' : '-right-4'} w-8 h-16 bg-gradient-to-r from-red-500 to-rose-500 rounded-r-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-50 group`}
        style={{ right: isExpanded ? '-32px' : '-32px' }}
      >
        {isExpanded ? (
          <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-white text-xs font-medium writing-mode-vertical">动态</span>
            <ChevronRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </div>
        )}
      </button>

      {/* Main Panel */}
      <div
        ref={containerRef}
        className={`bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        style={{ width: isExpanded ? '256px' : '0', height: isExpanded ? 'auto' : '0' }}
      >
        {isExpanded && (
          <>
            <div className="p-3 border-b bg-gradient-to-r from-red-500 to-rose-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  实时动态
                </div>
                <span className="text-white/80 text-xs">{activities.length}条动态</span>
              </div>
            </div>
            <div className="divide-y max-h-80 overflow-y-auto">
              {visibleActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="p-3 flex items-center gap-3 hover:bg-red-50 transition-colors animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={activity.avatar}
                    alt={activity.user}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-red-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium text-gray-800">{activity.user}</span>
                      <span className="text-gray-500"> {getActivityText(activity)}</span>
                    </p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                  {getActivityIcon(activity.type)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Collapsed State - Mini Indicator */}
      {!isExpanded && (
        <div className="w-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-2 flex flex-col items-center gap-2">
          <div className="relative">
            <img
              src={visibleActivities[0]?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
              alt=""
              className="w-8 h-8 rounded-full object-cover ring-2 ring-red-100"
            />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div className="flex flex-col items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500 mt-1">LIVE</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
}
