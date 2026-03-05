import { Home, Bell, Heart, Bookmark } from "lucide-react";

interface SidebarProps {
  userProfile: {
    avatar: string;
    username: string;
  };
}

export function Sidebar({ userProfile }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: "홈" },
    { icon: Bell, label: "알림" },
    { icon: Heart, label: "좋아요" },
    { icon: Bookmark, label: "북마크" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-100 border-r border-gray-200 flex flex-col fixed left-0 top-0">
      {/* 사용자 프로필 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img 
            src={userProfile.avatar} 
            alt={userProfile.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm text-gray-900">{userProfile.username}</span>
        </div>
      </div>

      {/* 메뉴 아이템들 */}
      <nav className="flex-1 p-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-left text-gray-500"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}