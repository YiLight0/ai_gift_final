import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Building, Cpu, Palette, Rocket, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { NICEPartner, NICERole } from '../data/mockData';

interface NICEInteractiveMapProps {
  partners: NICEPartner[];
  selectedPartner: NICEPartner | null;
  onPartnerSelect: (partner: NICEPartner) => void;
  selectedRole: NICERole | 'all';
  selectedCapability: string;
}

// Color configuration for NICE types
const roleColors: Record<NICERole, string> = {
  N: '#2DADA8',
  I: '#6366F1',
  C: '#DC2626',
  E: '#F97316'
};

const roleEmojis: Record<NICERole, string> = {
  N: '🏛️',
  I: '⚡',
  C: '🎭',
  E: '🚀'
};

export default function NICEInteractiveMap({
  partners,
  selectedPartner,
  onPartnerSelect,
  selectedRole
}: NICEInteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showPopup, setShowPopup] = useState<NICEPartner | null>(null);

  // Convert coordinates to position on map
  const coordinateToPosition = useCallback((coords: [number, number]) => {
    // Map coordinates: lng (108-122) -> x, lat (20-42) -> y
    const baseLng = 108;
    const baseLat = 20;
    const rangeLng = 14;
    const rangeLat = 22;

    const x = ((coords[0] - baseLng) / rangeLng) * 100;
    const y = ((42 - coords[1]) / rangeLat) * 100;

    return { x, y };
  }, []);

  // Handle zoom
  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  // Handle reset
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handle mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    handleZoom(delta);
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-teal-100 via-blue-100 to-purple-100 rounded-2xl overflow-hidden">
      {/* Map Container with pan/zoom */}
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Map Background - Simplified China/East Asia View */}
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          {/* Grid Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapGrid)" />
          </svg>

          {/* Simplified Coastline */}
          <svg className="absolute inset-0 w-full h-full opacity-30">
            <path
              d="M 10% 60% Q 25% 55%, 35% 50% T 55% 45% Q 70% 40%, 80% 35% L 85% 30% Q 80% 35%, 75% 40% T 60% 50% Q 45% 55%, 30% 60% Z"
              fill="#3B82F6"
              opacity="0.3"
            />
          </svg>

          {/* Partner Markers */}
          {partners.map(partner => {
            const pos = coordinateToPosition(partner.coordinates);
            const isSelected = selectedPartner?.id === partner.id;
            const isHovered = showPopup?.id === partner.id;

            return (
              <div
                key={partner.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  zIndex: isSelected || isHovered ? 100 : 10
                }}
                onClick={() => {
                  onPartnerSelect(partner);
                  setShowPopup(partner);
                }}
                onMouseEnter={() => setShowPopup(partner)}
                onMouseLeave={() => setShowPopup(null)}
              >
                {/* Marker */}
                <div
                  className={`relative px-3 py-2 rounded-full shadow-lg transition-all duration-200 ${
                    isSelected ? 'scale-125 ring-4 ring-offset-2' : isHovered ? 'scale-110' : ''
                  }`}
                  style={{
                    backgroundColor: roleColors[partner.type],
                    boxShadow: isSelected ? `0 8px 24px ${roleColors[partner.type]}80` : undefined
                  }}
                >
                  {/* Pulse animation for online AI partners */}
                  {partner.type === 'I' && partner.robotArtist?.status === 'online' && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                  )}

                  <span className="text-white text-sm font-medium whitespace-nowrap flex items-center gap-1">
                    <span>{roleEmojis[partner.type]}</span>
                    <span className="hidden md:inline">{partner.name.split('·')[0]}</span>
                  </span>

                  {/* Status dot */}
                  {partner.machines && partner.machines[0] && (
                    <span
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        partner.machines[0].status === 'online' ? 'bg-green-500' :
                        partner.machines[0].status === 'busy' ? 'bg-amber-500' : 'bg-gray-400'
                      }`}
                    />
                  )}
                </div>

                {/* Hover Popup */}
                {isHovered && !isSelected && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-xl p-4 z-50 animate-fadeIn">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{roleEmojis[partner.type]}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{partner.name}</h4>
                        <p className="text-sm text-gray-500">{partner.address}</p>
                        {partner.robotArtist && (
                          <p className="text-xs text-purple-600 mt-1">
                            🤖 {partner.robotArtist.name} {partner.robotArtist.status === 'online' ? '在线' : '离线'}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{partner.description}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Zoom indicator points */}
          <div className="absolute left-8 top-8 text-xs text-gray-400 space-y-1">
            <p>zoom: {zoom.toFixed(1)}x</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        {/* Map Style Selector */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg space-y-1">
          <p className="text-xs text-gray-500 font-medium px-2">样式</p>
          <button className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded-lg font-medium">
            🗺️ 街道
          </button>
          <button className="w-full px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200">
            🛰️ 卫星
          </button>
          <button className="w-full px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200">
            🌙 深色
          </button>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1">
        <button
          onClick={() => handleZoom(0.2)}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ZoomIn className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={() => handleZoom(-0.2)}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ZoomOut className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={handleReset}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <Maximize2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-30 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">图例</h4>
        <div className="space-y-2">
          {(Object.keys(roleColors) as NICERole[]).map(role => (
            <div key={role} className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: roleColors[role] }}
              >
                {roleEmojis[role]}
              </span>
              <span className="text-sm text-gray-600">
                {role === 'N' ? '地点/空间' :
                 role === 'I' ? '技术/智造' :
                 role === 'C' ? '文化/IP' : '创业/人才'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Count */}
      <div className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
        <p className="text-sm text-gray-700">
          📍 显示 {partners.length} 个合作伙伴
        </p>
      </div>

      {/* Help Text */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-black/60 text-white text-xs px-3 py-2 rounded-lg">
        🖱️ 滚轮缩放 | 👆拖动移动 | 🔍双击放大
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
