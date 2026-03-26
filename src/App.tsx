import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { CategoryProvider } from './contexts/CategoryContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CoCreatePage = lazy(() => import('./pages/CoCreatePage'));
const CreatorPage = lazy(() => import('./pages/CreatorPage'));
const ChallengePage = lazy(() => import('./pages/ChallengePage'));
const SupplierDashboard = lazy(() => import('./pages/SupplierDashboard'));
const DesignCultivationPage = lazy(() => import('./pages/DesignCultivationPage'));
const MasterOnboardingPage = lazy(() => import('./pages/MasterOnboardingPage'));
const VideoCoCreationPage = lazy(() => import('./pages/VideoCoCreationPage'));
const NICEMapPage = lazy(() => import('./pages/NICEMapPage'));
const MugCustomizer = lazy(() => import('./pages/MugCustomizer'));

function RouteFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center px-4">
      <div className="rounded-2xl border border-red-100 bg-white/80 px-6 py-4 text-sm text-gray-500 shadow-sm backdrop-blur">
        页面加载中...
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CategoryProvider>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="cocreate/:id" element={<CoCreatePage />} />
              <Route path="creator/:id" element={<CreatorPage />} />
              <Route path="challenge" element={<ChallengePage />} />
              <Route path="supplier" element={<SupplierDashboard />} />
              <Route path="cultivation" element={<DesignCultivationPage />} />
              <Route path="master" element={<MasterOnboardingPage />} />
              <Route path="video-create/:id" element={<VideoCoCreationPage />} />
              <Route path="nice" element={<NICEMapPage />} />
              <Route path="mug-customizer" element={<MugCustomizer />} />
            </Route>
          </Routes>
        </Suspense>
      </CategoryProvider>
    </BrowserRouter>
  );
}

export default App;
