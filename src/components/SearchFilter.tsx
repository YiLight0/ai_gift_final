import { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';

interface SearchFilterProps {
  onSearch: (filters: FilterState) => void;
  categories: string[];
  locations: string[];
  resultCount?: number;
}

export interface FilterState {
  keyword: string;
  categories: string[];
  priceRange: [number, number];
  locations: string[];
  sortBy: 'popular' | 'price-low' | 'price-high' | 'newest';
}

const defaultFilters: FilterState = {
  keyword: '',
  categories: [],
  priceRange: [0, 1000],
  locations: [],
  sortBy: 'popular'
};

export default function SearchFilter({ onSearch, categories, locations, resultCount }: SearchFilterProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, keyword: e.target.value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleKeywordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const toggleLocation = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter(l => l !== location)
      : [...filters.locations, location];
    const newFilters = { ...filters, locations: newLocations };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    const newPriceRange: [number, number] = type === 'min'
      ? [numValue, filters.priceRange[1]]
      : [filters.priceRange[0], numValue];
    const newFilters = { ...filters, priceRange: newPriceRange };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    setShowSortDropdown(false);
    onSearch(newFilters);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    onSearch(defaultFilters);
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.locations.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000 ||
    filters.keyword !== '';

  const sortLabels = {
    'popular': '🔥 热门',
    'price-low': '💰 价格从低到高',
    'price-high': '💰 价格从高到低',
    'newest': '✨ 最新'
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
      {/* Search Bar */}
      <form onSubmit={handleKeywordSubmit} className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索纹样、作品、创作者..."
            value={filters.keyword}
            onChange={handleKeywordChange}
            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all"
          />
          {filters.keyword && (
            <button
              type="button"
              onClick={() => {
                const newFilters = { ...filters, keyword: '' };
                setFilters(newFilters);
                onSearch(newFilters);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all ${
            showFilters || hasActiveFilters
              ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline">筛选</span>
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-white text-red-500 rounded-full text-xs flex items-center justify-center">
              {filters.categories.length + filters.locations.length + (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0)}
            </span>
          )}
        </button>
      </form>

      {/* Filter Panel */}
      {showFilters && (
        <div className="border-t border-gray-100 pt-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">分类筛选</label>
              <button
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowRegionDropdown(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span className={filters.categories.length > 0 ? 'text-red-600' : 'text-gray-600'}>
                  {filters.categories.length > 0
                    ? `已选${filters.categories.length}个`
                    : '选择分类'}
                </span>
                {showCategoryDropdown ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {showCategoryDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-3">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          filters.categories.includes(category)
                            ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Region Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">地区筛选</label>
              <button
                onClick={() => {
                  setShowRegionDropdown(!showRegionDropdown);
                  setShowCategoryDropdown(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span className={filters.locations.length > 0 ? 'text-red-600' : 'text-gray-600'}>
                  {filters.locations.length > 0
                    ? `已选${filters.locations.length}个`
                    : '选择地区'}
                </span>
                {showRegionDropdown ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {showRegionDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-3 max-h-48 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {locations.map((location) => (
                      <button
                        key={location}
                        onClick={() => toggleLocation(location)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          filters.locations.includes(location)
                            ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">价格区间</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="最低价"
                  value={filters.priceRange[0] || ''}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-red-500/20 text-sm"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="最高价"
                  value={filters.priceRange[1] === 1000 ? '' : filters.priceRange[1]}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-red-500/20 text-sm"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[0, 50, 100, 200, 500].map((min) => (
                  <button
                    key={min}
                    onClick={() => {
                      const max = min === 500 ? 1000 : min + 50;
                      const newFilters = { ...filters, priceRange: [min, max] as [number, number] };
                      setFilters(newFilters);
                      onSearch(newFilters);
                    }}
                    className={`px-2 py-1 rounded text-xs transition-all ${
                      filters.priceRange[0] === min
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    {min === 0 ? '不限' : `¥${min}${min === 500 ? '+' : ''}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filters & Clear */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {filters.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm"
                  >
                    {cat}
                    <button onClick={() => toggleCategory(cat)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.locations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm"
                  >
                    {loc}
                    <button onClick={() => toggleLocation(loc)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm">
                    ¥{filters.priceRange[0]} - ¥{filters.priceRange[1] === 1000 ? '不限' : filters.priceRange[1]}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                清除全部
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sort Options */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">排序方式：</span>
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <span className="text-gray-700">{sortLabels[filters.sortBy]}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showSortDropdown && (
              <div className="absolute z-10 top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-48">
                {(Object.keys(sortLabels) as Array<keyof typeof sortLabels>).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleSortChange(key)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                      filters.sortBy === key ? 'text-red-600 font-medium' : 'text-gray-600'
                    }`}
                  >
                    {sortLabels[key]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-500">
          <span className="font-medium text-red-600">{resultCount ?? 2341}</span> 个结果
        </div>
      </div>
    </div>
  );
}
