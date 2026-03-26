// 产品数据模型
export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  video?: string;
  category: '非遗' | '景区' | '博物馆' | '校园' | '用户共创';
  location: string;
  supplier: Supplier;
  stats: {
    likes: number;
    comments: number;
    shares: number;
    coCreations: number;
  };
  isHot: boolean;
  certifications: string[];
  description: string;
  story?: string;
  craftVideo?: string;
  originStory?: string;
  patternData?: PatternData;
}

export interface Supplier {
  id: string;
  name: string;
  avatar: string;
  type: '非遗传承人' | '景区商户' | '设计院校' | '博物馆';
  location: string;
  level: number;
  certifications: string[];
  stats: {
    products: number;
    likes: number;
    followers: number;
    sales: number;
  };
}

export interface PatternData {
  elements: string[];
  colors: string[];
  style: string;
  permission: 'all' | 'partial' | 'authorized';
  basePrice: number;
  coCreateAddPrice: number;
  authorizationFee?: number;
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  bio: string;
  location: string;
  country: string;
  level: number;
  levelName: string;
  levelIcon: string;
  certifications: string[];
  stats: {
    works: number;
    likes: number;
    followers: number;
    totalEarnings: number;
  };
  hotRank?: number;
  story?: CreatorStory[];
  badges?: Badge[];
}

export interface CreatorStory {
  year: string;
  event: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  date: string;
  locked?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'voting' | 'judging' | 'completed';
  participants: number;
  countries: number;
  works: number;
  tracks: ChallengeTrack[];
  jury: JuryMember[];
  schedule: ScheduleItem[];
}

export interface ChallengeTrack {
  id: string;
  name: string;
  icon: string;
  participants: number;
  rewards: {
    gold: string;
    silver: string;
    bronze: string;
  };
}

export interface JuryMember {
  name: string;
  title: string;
  institution: string;
  avatar: string;
}

export interface ScheduleItem {
  date: string;
  event: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  options?: QuickOption[];
  designs?: DesignOption[];
}

export interface QuickOption {
  id: string;
  label: string;
  icon: string;
}

export interface DesignOption {
  id: string;
  name: string;
  image: string;
  price: number;
}

// 模拟数据
export const mockSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: '龙阿姨工坊',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    type: '非遗传承人',
    location: '贵州西江苗寨',
    level: 4,
    certifications: ['非遗传承人', '故宫合作艺术家'],
    stats: { products: 234, likes: 12300, followers: 45, sales: 45600 }
  },
  {
    id: 'sup-2',
    name: '故宫文创',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    type: '博物馆',
    location: '北京故宫',
    level: 5,
    certifications: ['博物馆认证', '官方授权'],
    stats: { products: 567, likes: 45600, followers: 123, sales: 234000 }
  },
  {
    id: 'sup-3',
    name: '同济大学设计创意学院',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    type: '设计院校',
    location: '上海',
    level: 4,
    certifications: ['院校认证'],
    stats: { products: 89, likes: 8900, followers: 67, sales: 23400 }
  }
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: '苗绣蝴蝶托特包',
    price: 128,
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600'
    ],
    category: '非遗',
    location: '贵州西江苗寨',
    supplier: mockSuppliers[0],
    stats: { likes: 2341, comments: 156, shares: 89, coCreations: 45 },
    isHot: true,
    certifications: ['非遗认证', '区块链存证'],
    description: '手工苗绣蝴蝶纹样托特包，采用传统苗绣技艺，每一针都是匠心之作。',
    story: '苗绣是苗族女性的传统手工艺，蝴蝶纹样象征着生命与希望。龙阿姨是苗绣第三代传承人，从小跟随母亲学习苗绣技艺。',
    patternData: {
      elements: ['蝴蝶', '花草', '龙凤'],
      colors: ['传统蓝', '莫兰迪', '赛博朋克', '故宫红'],
      style: '传统',
      permission: 'partial',
      basePrice: 128,
      coCreateAddPrice: 20,
      authorizationFee: 10
    }
  },
  {
    id: 'prod-2',
    name: '敦煌飞天丝巾',
    price: 89,
    images: [
      'https://images.unsplash.com/photo-1601924921557-45e6dea0a157?w=600',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600'
    ],
    category: '博物馆',
    location: '甘肃敦煌',
    supplier: mockSuppliers[1],
    stats: { likes: 1823, comments: 89, shares: 45, coCreations: 23 },
    isHot: true,
    certifications: ['博物馆认证', '官方授权'],
    description: '敦煌壁画飞天纹样丝巾，飘逸灵动，展现大唐盛世的风采。',
    patternData: {
      elements: ['飞天', '祥云', '莲花'],
      colors: ['敦煌红', '青金蓝', '金箔色'],
      style: '古典',
      permission: 'all',
      basePrice: 89,
      coCreateAddPrice: 15
    }
  },
  {
    id: 'prod-3',
    name: '同济樱花马克杯',
    price: 45,
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600'
    ],
    category: '校园',
    location: '上海',
    supplier: mockSuppliers[2],
    stats: { likes: 987, comments: 45, shares: 34, coCreations: 12 },
    isHot: false,
    certifications: ['院校认证'],
    description: '同济大学樱花季限定马克杯，记录校园最美时光。',
    patternData: {
      elements: ['樱花', '校徽', '建筑'],
      colors: ['樱花粉', '天蓝色', '金色'],
      style: '现代',
      permission: 'all',
      basePrice: 45,
      coCreateAddPrice: 10
    }
  },
  {
    id: 'prod-4',
    name: '景德镇茶具套装',
    price: 299,
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600',
      'https://images.unsplash.com/photo-1530982011887-3cc11cc85693?w=600'
    ],
    category: '非遗',
    location: '江西景德镇',
    supplier: mockSuppliers[0],
    stats: { likes: 1567, comments: 78, shares: 56, coCreations: 34 },
    isHot: true,
    certifications: ['非遗认证'],
    description: '景德镇手工青花瓷茶具套装，传承千年制瓷技艺。',
    patternData: {
      elements: ['山水', '花鸟', '人物'],
      colors: ['青花蓝', '釉里红', '粉彩'],
      style: '传统',
      permission: 'partial',
      basePrice: 299,
      coCreateAddPrice: 30
    }
  },
  {
    id: 'prod-5',
    name: '苏绣团扇',
    price: 168,
    images: [
      'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'
    ],
    category: '非遗',
    location: '江苏苏州',
    supplier: mockSuppliers[0],
    stats: { likes: 3102, comments: 134, shares: 67, coCreations: 45 },
    isHot: true,
    certifications: ['非遗认证', '大师认证'],
    description: '苏州刺绣团扇，精选蚕丝线，一针一线绣出江南韵味。',
    patternData: {
      elements: ['牡丹', '锦鲤', '园林'],
      colors: ['香色', '藕荷', '月白'],
      style: '婉约',
      permission: 'authorized',
      basePrice: 168,
      coCreateAddPrice: 25,
      authorizationFee: 15
    }
  },
  {
    id: 'prod-6',
    name: '用户共创猫meme T恤',
    price: 69,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'
    ],
    category: '用户共创',
    location: '全国',
    supplier: mockSuppliers[2],
    stats: { likes: 876, comments: 156, shares: 234, coCreations: 567 },
    isHot: false,
    certifications: ['平台认证'],
    description: '用户共创款猫meme主题T恤，可爱有趣。',
    patternData: {
      elements: ['猫咪', '表情包', '文字'],
      colors: ['全彩', '黑白', '渐变'],
      style: '潮流',
      permission: 'all',
      basePrice: 69,
      coCreateAddPrice: 0
    }
  }
];

export const mockCreators: Creator[] = [
  {
    id: 'creator-1',
    name: '龙阿姨',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    cover: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200',
    bio: '苗绣第三代传承人，让传统手艺走进现代生活',
    location: '贵州西江苗寨',
    country: '中国',
    level: 4,
    levelName: '大师',
    levelIcon: '⭐',
    certifications: ['非遗传承人', '故宫合作艺术家'],
    stats: { works: 234, likes: 12300, followers: 45, totalEarnings: 45600 },
    hotRank: 12,
    story: [
      { year: '1985', event: '跟随母亲学习苗绣' },
      { year: '2008', event: '被评为省级非遗传承人' },
      { year: '2024', event: '入驻AI的礼物，作品被45国用户收藏' }
    ],
    badges: [
      { id: 'b1', name: '非遗传承', icon: '🏆', date: '2024.01' },
      { id: 'b2', name: '万赞达人', icon: '❤️', date: '2024.02' },
      { id: 'b3', name: '全球创作者', icon: '🌍', date: '2024.03' }
    ]
  },
  {
    id: 'creator-2',
    name: 'Marco Rossi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
    bio: '佛罗伦萨皮革艺术家，将意大利传统工艺与现代设计融合',
    location: '佛罗伦萨',
    country: '意大利',
    level: 3,
    levelName: '认证设计师',
    levelIcon: '💎',
    certifications: ['国际认证', '院校认证'],
    stats: { works: 156, likes: 8900, followers: 2345, totalEarnings: 34500 }
  }
];

export const mockChallenge: Challenge = {
  id: 'challenge-1',
  title: '纹样无界',
  titleEn: 'Global Pattern Challenge 2024',
  description: '用AI重新诠释你家乡的传统文化符号',
  startDate: '2024-03-27',
  endDate: '2024-04-27',
  status: 'ongoing',
  participants: 2341,
  countries: 56,
  works: 3456,
  tracks: [
    {
      id: 'track-1',
      name: '非遗活化',
      icon: '🏛️',
      participants: 234,
      rewards: { gold: '¥50,000 + 作品量产 + 国际巡展', silver: '¥20,000 + 作品量产', bronze: '¥5,000 + 平台流量扶持' }
    },
    {
      id: 'track-2',
      name: '院校创新',
      icon: '🎓',
      participants: 1567,
      rewards: { gold: '¥30,000 + 实习机会', silver: '¥10,000 + 导师1v1指导', bronze: '¥2,000 + 认证设计师资格' }
    },
    {
      id: 'track-3',
      name: '国际融合',
      icon: '🌐',
      participants: 540,
      rewards: { gold: '¥50,000 + 国际媒体曝光', silver: '¥20,000 + 国际推广', bronze: '¥5,000 + 多语言展示' }
    }
  ],
  jury: [
    { name: '苏运升', title: '教授', institution: '同济大学', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
    { name: '范凌', title: 'CEO', institution: '特赞科技', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' },
    { name: '待定', title: '国际评委', institution: '', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' }
  ],
  schedule: [
    { date: '3.27', event: '挑战赛启动' },
    { date: '4.10', event: '作品提交截止' },
    { date: '4.15', event: '公众投票结束' },
    { date: '4.20', event: '评审团终审' },
    { date: '4.27', event: '颁奖典礼' }
  ]
};

export const quickOptions: QuickOption[] = [
  { id: 'color', label: '换颜色', icon: '🎨' },
  { id: 'element', label: '换元素', icon: '✨' },
  { id: 'text', label: '加文字', icon: '✏️' },
  { id: 'carrier', label: '换载体', icon: '📦' },
  { id: 'random', label: '随机生成', icon: '🎲' }
];

export const designOptions: DesignOption[] = [
  { id: 'd1', name: '故宫凤凰', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', price: 148 },
  { id: 'd2', name: '渐变凤凰', image: 'https://images.unsplash.com/photo-1569470451072-68314f596aec?w=400', price: 158 },
  { id: 'd3', name: '金线凤凰', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400', price: 188 }
];

// 视频数据模型
export interface VideoItem {
  id: string;
  videoUrl: string;
  coverUrl: string;
  productId: string;
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
  shareUrl?: string;
}

// 视频便签数据
export interface VideoNote {
  id: string;
  videoUrl: string;
  coverUrl: string;
  creatorName: string;
  creatorAvatar: string;
  productName: string;
  productId: string;
  coCreationStory: string;
  lineage: {
    role: '设计师' | '经纪人' | '二创者';
    name: string;
    avatar: string;
  }[];
  shareCount: number;
  gmv: number;
}

// 分享追踪数据
export interface ShareTrack {
  trackId: string;
  videoId: string;
  sharerId: string;
  sharerName: string;
  platform: 'wechat' | 'douyin' | 'xiaohongshu' | 'weibo';
  clicks: number;
  conversions: number;
  revenue: number;
}

// 模拟视频数据
export const mockVideos: VideoItem[] = [
  {
    id: 'video-1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-coffee-in-a-white-cup-4623-large.mp4',
    coverUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600',
    productId: 'prod-4',
    productName: '景德镇茶具套装',
    productPrice: 299,
    masterName: '孙建新',
    masterTitle: '建盏国家级传承人',
    masterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    brokerName: '小王',
    likes: 2341,
    shares: 456,
    coCreationCount: 234,
    bgmName: '古琴-高山流水'
  },
  {
    id: 'video-2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stitching-a-white-fabric-4621-large.mp4',
    coverUrl: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600',
    productId: 'prod-5',
    productName: '苏绣团扇',
    productPrice: 168,
    masterName: '李绣娘',
    masterTitle: '苏绣第五代传人',
    masterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    brokerName: '小红',
    likes: 1823,
    shares: 345,
    coCreationCount: 156,
    bgmName: '古筝-渔舟唱晚'
  },
  {
    id: 'video-3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-mug-21878-large.mp4',
    coverUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600',
    productId: 'prod-1',
    productName: '苗绣蝴蝶托特包',
    productPrice: 128,
    masterName: '龙阿姨',
    masterTitle: '苗绣第三代传承人',
    masterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    brokerName: '小明',
    likes: 3102,
    shares: 567,
    coCreationCount: 345,
    bgmName: '民族风-芦笙曲'
  },
  {
    id: 'video-4',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    coverUrl: 'https://images.unsplash.com/photo-1601924921557-45e6dea0a157?w=600',
    productId: 'prod-2',
    productName: '敦煌飞天丝巾',
    productPrice: 89,
    masterName: '王教授',
    masterTitle: '敦煌研究院专家',
    masterAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    likes: 1567,
    shares: 234,
    coCreationCount: 123,
    bgmName: '西域风-丝路花雨'
  }
];

// 模拟分享追踪数据
export const mockShareTracks: ShareTrack[] = [
  { trackId: 'track-1', videoId: 'video-1', sharerId: 'user-1', sharerName: '小红', platform: 'wechat', clicks: 1234, conversions: 45, revenue: 13455 },
  { trackId: 'track-2', videoId: 'video-1', sharerId: 'user-2', sharerName: 'Peter', platform: 'douyin', clicks: 3456, conversions: 89, revenue: 26611 },
];

// 推荐的文案选项
export const quickTextOptions = [
  '送给闺蜜的考研礼物，祝上岸！',
  '老父亲收到这个建盏，眼眶红了...',
  '办公室显眼包必备，同事都问链接',
  '送客户的非遗伴手礼，高端大气',
  '生日礼物首选，寓意满满'
];

// 推荐的BGM列表
export const quickBgmOptions = [
  { id: 'bgm-1', name: '古琴-高山流水', emoji: '🎵' },
  { id: 'bgm-2', name: '古筝-渔舟唱晚', emoji: '🎶' },
  { id: 'bgm-3', name: '电子-赛博国风', emoji: '🎧' },
  { id: 'bgm-4', name: '治愈-轻音乐', emoji: '☕' },
  { id: 'bgm-5', name: '卡点-节奏感', emoji: '💃' }
];

// NICE Global 地图数据模型
export type NICERole = 'N' | 'I' | 'C' | 'E';
export type NICEColor = 'teal' | 'purple' | 'red' | 'orange';

export interface NICEMachine {
  id: string;
  name: string;
  type: '3d-fdm' | '3d-sla' | '3d-clay' | 'cnc' | 'laser' | 'print' | 'robot';
  status: 'online' | 'busy' | 'idle' | 'offline';
  specs?: string;
  materials?: string[];
  instantMake?: boolean;
}

export interface RobotArtist {
  id: string;
  name: string;
  model: string;
  style: string;
  status: 'online' | 'offline';
  dailyOutput: number;
  specialties: string[];
  avatar: string;
}

export interface NICEPartner {
  id: string;
  type: NICERole;
  subType: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [lng, lat]
  description: string;
  tags: string[];
  // N类特有
  certification?: string;
  events?: { name: string; date: string }[];
  // I类特有
  robotArtist?: RobotArtist;
  machines?: NICEMachine[];
  // C类特有
  masterName?: string;
  ipName?: string;
  ipOwner?: string;
  locationBound?: boolean;
  creations?: { name: string; price: number; limited?: number }[];
  // E类特有
  founderName?: string;
  schedule?: string;
  skills?: string[];
  rating?: number;
  // 统计
  stats?: {
    partners?: number;
    creators?: number;
    artworks?: number;
    entrepreneurs?: number;
  };
}

// NICE Global 指数
export interface NICEGlobalStats {
  onlineCreators: number;
  activeRobotArtists: number;
  dailyArtworks: number;
}

// 模拟NICE合作伙伴数据
export const nicePartners: NICEPartner[] = [
  // N类 - 地点/空间
  {
    id: 'n-1',
    type: 'N',
    subType: 'neighborhood',
    name: '上海·杨浦五角场',
    address: '上海市杨浦区五角场',
    coordinates: [121.514, 31.306],
    description: 'NICE Global首发站，五角场文创核心区',
    tags: ['NICE总部', '周末市集', '学术枢纽'],
    certification: 'NICE Global首发站',
    events: [
      { name: '非遗周末市集', date: '每周六日' },
      { name: 'AI设计工作坊', date: '每月第二周' }
    ],
    stats: { partners: 12, entrepreneurs: 156 }
  },
  {
    id: 'n-2',
    type: 'N',
    subType: 'museum',
    name: '北京·故宫博物院',
    address: '北京市东城区景山前街4号',
    coordinates: [116.397, 39.916],
    description: '文旅融合示范区，故宫数字文创实验室',
    tags: ['文旅融合', '数字文创', 'Heritage Partner'],
    certification: 'NICE Global Heritage Partner',
    stats: { partners: 8 }
  },
  {
    id: 'n-3',
    type: 'N',
    subType: 'campus',
    name: '同济大学设计创意学院',
    address: '上海市杨浦区四平路1239号',
    coordinates: [121.508, 31.288],
    description: 'NICE Global总部，产学研转化核心基地',
    tags: ['NICE总部', '学术枢纽', '实验室'],
    certification: 'NICE Global总部',
    events: [
      { name: '赤峰路实验室开放日', date: '每周三' },
      { name: 'NICE2035未来生活原型街', date: '常年' }
    ],
    stats: { partners: 5 }
  },
  {
    id: 'n-4',
    type: 'N',
    subType: 'art-museum',
    name: '西岸美术馆',
    address: '上海市徐汇区龙腾大道2350号',
    coordinates: [121.467, 31.150],
    description: 'MiniMax西岸龙艺术家驻地，数字艺术前沿',
    tags: ['艺术场馆', 'AI艺术家驻地'],
    certification: 'AI Art Partner'
  },
  // I类 - 技术/智造
  {
    id: 'i-1',
    type: 'I',
    subType: 'ai-lab',
    name: 'MiniMax·西岸龙',
    address: '上海西岸美术馆',
    coordinates: [121.467, 31.150],
    description: 'MiniMax大模型驻场艺术家，赛博国风开创者',
    tags: ['AI大模型', '机器人艺术家', '在线'],
    robotArtist: {
      id: 'ra-1',
      name: '西岸龙',
      model: 'MiniMax',
      style: '赛博国风',
      status: 'online',
      dailyOutput: 47,
      specialties: ['龙鳞纹理生成', '黄浦江日落渐变', '非遗纹样赛博化'],
      avatar: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200'
    },
    stats: { creators: 1234, artworks: 47 }
  },
  {
    id: 'i-2',
    type: 'I',
    subType: 'ai-lab',
    name: '火山引擎·紫禁城Painter',
    address: '故宫博物院数字馆',
    coordinates: [116.397, 39.916],
    description: '宫廷数字青绿风格，《千里江山图》AI复现',
    tags: ['AI大模型', '机器人艺术家'],
    robotArtist: {
      id: 'ra-2',
      name: '紫禁城Painter',
      model: '火山引擎',
      style: '宫廷数字青绿',
      status: 'online',
      dailyOutput: 32,
      specialties: ['文物风格渲染', '千里江山图变体', '宫廷纹样生成'],
      avatar: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200'
    }
  },
  {
    id: 'i-3',
    type: 'I',
    subType: 'maker-hub',
    name: '同济NICE LAB智造中心',
    address: '同济大学设计创意学院',
    coordinates: [121.508, 31.288],
    description: '校内智造设备网络，支持多种制造工艺',
    tags: ['智造设备', '3D打印', 'CNC', '数码印花'],
    machines: [
      { id: 'm-1', name: '碳纤维3D打印机', type: '3d-fdm', status: 'online', specs: '精度0.1mm' },
      { id: 'm-2', name: '五轴CNC', type: 'cnc', status: 'busy', specs: '工业级精度' },
      { id: 'm-3', name: '数码印花机', type: 'print', status: 'idle', materials: ['T恤', '帆布袋'] },
      { id: 'm-4', name: '激光切割机', type: 'laser', status: 'online', specs: '功率100W' }
    ]
  },
  {
    id: 'i-4',
    type: 'I',
    subType: 'maker-hub',
    name: '故宫文创实验室',
    address: '故宫博物院午门东侧',
    coordinates: [116.398, 39.917],
    description: '陶泥3D打印，支持非遗材质复刻',
    tags: ['陶泥打印', '非遗复刻', '立等可取'],
    machines: [
      { id: 'm-5', name: '3D陶泥打印机', type: '3d-clay', status: 'idle', specs: '精度0.1mm，支持多色陶泥', instantMake: true },
      { id: 'm-6', name: '激光打标机', type: 'laser', status: 'online', materials: ['金属书签', '木质明信片', '皮质手账'], instantMake: true }
    ]
  },
  {
    id: 'i-5',
    type: 'I',
    subType: 'maker-hub',
    name: '河北地质大学智造链',
    address: '石家庄市裕华区槐安东路136号',
    coordinates: [114.514, 38.042],
    description: '加梯机器人/社区服务，石家庄模式推广基地',
    tags: ['智造基地', '加梯机器人', '社区服务'],
    machines: [
      { id: 'm-7', name: '工业级3D打印机', type: '3d-fdm', status: 'online', specs: '大幅面打印' },
      { id: 'm-8', name: 'CNC切割机', type: 'cnc', status: 'online' },
      { id: 'm-9', name: '激光雕刻机', type: 'laser', status: 'online', specs: '幅面1.2m×2.4m' }
    ]
  },
  // C类 - 文化/IP
  {
    id: 'c-1',
    type: 'C',
    subType: 'heritage-master',
    name: '孙建新·建盏',
    address: '福建建阳（在线）',
    coordinates: [118.3, 27.0],
    description: '建盏国家级传承人，柴烧兔毫盏大师',
    tags: ['非遗传承人', '在线可咨询', '数字分身'],
    masterName: '孙建新',
    creations: [
      { name: '兔毫盏AI版', price: 3500, limited: 10 },
      { name: '油滴星空盏', price: 5800, limited: 5 }
    ],
    stats: { creators: 234 }
  },
  {
    id: 'c-2',
    type: 'C',
    subType: 'cultural-ip',
    name: '千里江山图',
    address: '故宫博物院',
    coordinates: [116.392, 39.914],
    description: '北宋王希孟传世名画，地点锚定数字IP',
    tags: ['传世名画', '地点锚定', '青绿山水'],
    ipName: '千里江山图',
    ipOwner: '故宫博物院',
    locationBound: true,
    creations: [
      { name: '青绿山水丝巾', price: 299 },
      { name: '千里江山长卷复制品', price: 1999 }
    ]
  },
  {
    id: 'c-3',
    type: 'C',
    subType: 'cultural-ip',
    name: '哪吒·东海版',
    address: '浙江舟山（沿海限定）',
    coordinates: [122.1, 29.9],
    description: '光线传媒授权，沿海城市地点锚定IP',
    tags: ['电影IP', '地点锚定', '沿海限定'],
    ipName: '哪吒·东海版',
    ipOwner: '光线传媒',
    locationBound: true,
    creations: [
      { name: '混天绫海浪纹手机壳', price: 89 },
      { name: '风火轮船舵摆件', price: 199 }
    ]
  },
  {
    id: 'c-4',
    type: 'C',
    subType: 'heritage-master',
    name: '龙阿姨·苗绣',
    address: '贵州西江苗寨',
    coordinates: [108.182, 26.512],
    description: '苗绣第三代传承人，传统手艺创新者',
    tags: ['苗绣传承', '在线可咨询'],
    masterName: '龙阿姨',
    creations: [
      { name: '苗绣蝴蝶托特包', price: 128 },
      { name: '龙凤呈祥刺绣画', price: 899 }
    ]
  },
  // E类 - 创业/人才
  {
    id: 'e-1',
    type: 'E',
    subType: 'startup',
    name: '张三·非遗经纪人',
    address: '同济NICE2035门口（周末市集）',
    coordinates: [121.509, 31.289],
    description: '同济设创研二学生，帮非遗大师做AI设计+短视频运营',
    tags: ['非遗经纪人', 'AI设计', '短视频运营'],
    founderName: '张三',
    schedule: '每周六日 10:00-18:00',
    skills: ['AI设计', '懂建盏', '会拍短视频'],
    rating: 4.9
  },
  {
    id: 'e-2',
    type: 'E',
    subType: 'startup',
    name: '李四·装置艺术家',
    address: '西岸美术馆周边',
    coordinates: [121.468, 31.151],
    description: '人机协同艺术创作，AI与装置结合',
    tags: ['装置艺术', '人机协同', 'AI创作'],
    founderName: '李四',
    skills: ['装置艺术', 'AI协同', '创意编程'],
    rating: 4.8
  },
  {
    id: 'e-3',
    type: 'E',
    subType: 'student-cluster',
    name: '五角场学生创业Cluster',
    address: '上海杨浦五角场',
    coordinates: [121.515, 31.307],
    description: '156名学生创业者聚集区，涵盖AI设计、短视频、智能硬件',
    tags: ['创业集群', 'AI设计', '短视频', '智能硬件'],
    stats: { entrepreneurs: 156 }
  }
];

// NICE Global 指数
export const niceGlobalStats: NICEGlobalStats = {
  onlineCreators: 2847,
  activeRobotArtists: 12,
  dailyArtworks: 3456
};

// 学校合作伙伴
export const academicPartners = [
  {
    id: 'acad-1',
    name: '同济大学',
    type: 'NICE总部',
    location: '上海',
    coordinates: [121.508, 31.288] as [number, number],
    focus: '产学研转化',
    projects: ['火眼实验室遗产', 'AI礼物平台'],
    avatar: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?w=200'
  },
  {
    id: 'acad-2',
    name: '米兰理工大学',
    type: '设计联盟',
    location: '米兰',
    coordinates: [9.2, 45.5] as [number, number],
    focus: '欧洲设计标准',
    projects: ['米兰设计周联展'],
    avatar: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=200'
  },
  {
    id: 'acad-3',
    name: '阿尔托大学',
    type: '北欧枢纽',
    location: '赫尔辛基',
    coordinates: [24.9, 60.2] as [number, number],
    focus: '可持续设计',
    projects: ['极地材料AI设计'],
    avatar: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=200'
  },
  {
    id: 'acad-4',
    name: '斯坦福大学',
    type: '创新节点',
    location: '硅谷',
    coordinates: [-122.1, 37.4] as [number, number],
    focus: 'AI伦理',
    projects: ['人机协同创作协议'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
  },
  {
    id: 'acad-5',
    name: '河北地质大学',
    type: '智造基地',
    location: '石家庄',
    coordinates: [114.514, 38.042] as [number, number],
    focus: '加梯机器人',
    projects: ['社区服务', '石家庄模式推广'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
  },
  {
    id: 'acad-6',
    name: '福州大学',
    type: '海峡枢纽',
    location: '福州',
    coordinates: [119.3, 26.1] as [number, number],
    focus: '台海文创融合',
    projects: ['妈祖文化AI设计'],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'
  },
  {
    id: 'acad-7',
    name: '澳门大学',
    type: '葡语桥梁',
    location: '澳门',
    coordinates: [113.5, 22.2] as [number, number],
    focus: '中葡文化IP',
    projects: ['大三巴数字重建'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'
  }
];
