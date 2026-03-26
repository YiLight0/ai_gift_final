import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, User, Grid3X3, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useCategory } from '../contexts/useCategory';
import type { Category } from '../contexts/categoryTypes';

const categories: Category[] = ['全部', '非遗', '景区', '博物馆', '校园', '用户共创'];

const navItems = [
  { path: '/', label: '首页' },
  { path: '/challenge', label: '全球挑战赛' },
  { path: '/cultivation', label: '设计修仙' },
  { path: '/mug-customizer', label: 'AI定制杯子' },
  { path: '/master', label: '入驻大师' },
  { path: '/nice', label: 'NICE地图' },
  { path: '/supplier', label: '供应商后台' },
];

const navOrder = ['/', '/mug-customizer', '/challenge', '/cultivation', '/master', '/nice', '/supplier'];

export default function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const { selectedCategory, setSelectedCategory } = useCategory();

  const orderedNavItems = [...navItems].sort(
    (a, b) => navOrder.indexOf(a.path) - navOrder.indexOf(b.path),
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      <header className="sticky top-0 z-50">
        <div className="border-b border-red-100/50 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between lg:h-20">
              <Link to="/" className="flex items-center gap-3 group">
                <img
                  src="/logo.png"
                  alt="AI Gift Logo"
                  className="h-10 w-auto object-contain transition-transform group-hover:scale-105 lg:h-12"
                />
              </Link>

              <nav className="hidden items-center gap-1 lg:flex">
                {orderedNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md shadow-red-200'
                        : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-2 lg:gap-4">
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setCategoryDropdownOpen((open) => !open)}
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-red-300 hover:text-red-600"
                  >
                    <Grid3X3 className="h-4 w-4" />
                    <span className="hidden lg:inline">{selectedCategory}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        categoryDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {categoryDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setCategoryDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                            selectedCategory === category
                              ? 'bg-red-50 text-red-600'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-red-600'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="hidden items-center gap-2 rounded-full bg-gray-100 px-4 py-2.5 transition-colors hover:bg-gray-200 lg:flex">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索..."
                    className="w-32 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>

                <Link
                  to="/creator/creator-1"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl lg:h-11 lg:w-11"
                >
                  <User className="h-5 w-5" />
                </Link>

                <button
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100 lg:hidden"
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6 text-gray-600" />
                  ) : (
                    <Menu className="h-6 w-6 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="space-y-2 border-t border-gray-100 bg-white/95 px-4 py-4 backdrop-blur-xl lg:hidden">
            {orderedNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                分类
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setMobileMenuOpen(false);
                    }}
                    className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-16 bg-gray-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <img src="/logo.png" alt="AI Gift Logo" className="h-10 w-auto object-contain" />
              </div>
              <p className="text-sm text-gray-400">
                让每一份设计都有温度，让传统文化走进现代生活。
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">关于平台</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">关于我们</a></li>
                <li><a href="#" className="hover:text-white">加入我们</a></li>
                <li><a href="#" className="hover:text-white">媒体报道</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">支持</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">帮助中心</a></li>
                <li><a href="#" className="hover:text-white">联系客服</a></li>
                <li><a href="#" className="hover:text-white">意见反馈</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">合作</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">商家入驻</a></li>
                <li><a href="#" className="hover:text-white">院校合作</a></li>
                <li><a href="#" className="hover:text-white">机构合作</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 AI的礼物 powered by 同济大学设计创意学院</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
