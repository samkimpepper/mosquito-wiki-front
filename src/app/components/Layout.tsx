import { Sidebar } from "./Sidebar";
import { UploadModal } from "./UploadModal";
import { BrandProductModal } from "./BrandProductModal";
import { Search, Menu, PenSquare, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import defaultProfile from "../../assets/default_profile.jpg";

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [brandProductModalOpen, setBrandProductModalOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  // 로고 텍스트 표시 여부 (홈 페이지에만 표시)
  const showLogo = location.pathname === "/";

  return (
    <div className="min-h-screen bg-white flex">
      {/* 좌측 사이드바 */}
      <Sidebar 
        userProfile={{
          avatar: user?.profileImageUrl ?? defaultProfile,
          username: user?.name ?? "익명"
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 업로드 모달 */}
      <UploadModal 
        isOpen={uploadModalOpen} 
        onClose={() => setUploadModalOpen(false)} 
      />

      {/* 브랜드, 제품 등록 모달 */}
      <BrandProductModal 
        isOpen={brandProductModalOpen} 
        onClose={() => setBrandProductModalOpen(false)} 
      />

      {/* 메인 컨텐츠 */}
      <div className="flex-1 lg:ml-64">
        {/* 헤더 */}
        <div className="border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                {/* 모바일 햄버거 메뉴 */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </button>
                
                {showLogo && (
                  <h1 className="text-lg font-medium text-gray-700">모기위키</h1>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative w-80 hidden sm:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="검색"
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                {/* 등록 버튼 드롭다운 */}
                <div className="relative">
                  <button
                    onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                  >
                    <PenSquare className="w-4 h-4" />
                    <span>등록</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {registerDropdownOpen && (
                    <>
                      {/* 배경 클릭시 닫기 */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setRegisterDropdownOpen(false)}
                      />
                      
                      {/* 드롭다운 메뉴 */}
                      <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20 min-w-[180px]">
                        <button
                          onClick={() => {
                            setUploadModalOpen(true);
                            setRegisterDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                          발색샷 등록
                        </button>
                        <button
                          onClick={() => {
                            setBrandProductModalOpen(true);
                            setRegisterDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          브랜드, 제품 등록
                        </button>
                      </div>
                    </>
                  )}
                </div>
                
                {user ? (
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    로그아웃
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                  >
                    로그인
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 페이지 콘텐츠 */}
        <Outlet />
      </div>
    </div>
  );
}
