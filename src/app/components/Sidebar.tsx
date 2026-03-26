import { Home, Bell, Heart, Bookmark, X } from "lucide-react";
import { useNavigate } from "react-router";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const menuItems = [
    { icon: Home, label: "홈", path: "/" },
    { icon: Bell, label: "알림", path: null },
    { icon: Heart, label: "좋아요", path: null },
    { icon: Bookmark, label: "북마크", path: null },
  ];

  return (
    <>
      {/* 모바일 백드롭 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <div className={`
        w-72 bg-white flex flex-col flex-shrink-0
        fixed left-0 top-14 z-50 h-[calc(100vh-3.5rem)]
        lg:sticky lg:top-14 lg:z-auto
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* 모바일 닫기 버튼 */}
        <div className="lg:hidden absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 메뉴 아이템들 */}
        <nav className="flex-1 py-3 flex flex-col items-center">
          <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200 w-36">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => item.path && navigate(item.path)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left text-gray-500 hover:text-gray-800"
              >
                <item.icon className="w-3.5 h-3.5" />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
