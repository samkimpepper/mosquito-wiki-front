import { Heart, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface FeedCardProps {
  images: string[];
  productName: string;
  userProfile: {
    avatar: string;
    username: string;
    date: string;
  };
  swatchCount?: number;
  likeCount?: number;
}

export function FeedCard({ images, productName, userProfile, swatchCount = 0, likeCount = 0 }: FeedCardProps) {
  const imageCount = images.length;
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);

  const handleLikeToggle = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setCurrentLikeCount(newLikedState ? currentLikeCount + 1 : currentLikeCount - 1);
  };
  
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors bg-white">
      {/* 프로필 섹션 */}
      <div className="px-3 py-2.5 flex items-center gap-2 border-b border-gray-100">
        <img
          src={userProfile.avatar}
          alt={userProfile.username}
          className="w-5 h-5 rounded-full object-cover"
        />
        <span className="text-xs font-medium text-gray-800">{userProfile.username}</span>
        <span className="text-xs text-gray-200">|</span>
        <span className="text-xs text-gray-400">{userProfile.date}</span>
      </div>

      {/* 이미지 영역 */}
      <div className="bg-white p-2">
        <div className="aspect-square overflow-hidden">
          {imageCount === 1 && (
            <img 
              src={images[0]} 
              alt={productName}
              className="w-full h-full object-cover rounded-lg border border-gray-200"
            />
          )}
          
          {imageCount === 2 && (
            <div className="grid grid-rows-2 gap-2 h-full">
              <img 
                src={images[0]} 
                alt={`${productName} 1`}
                className="w-full h-full object-cover rounded-t-lg border border-gray-200"
              />
              <img 
                src={images[1]} 
                alt={`${productName} 2`}
                className="w-full h-full object-cover rounded-b-lg border border-gray-200"
              />
            </div>
          )}
          
          {imageCount === 3 && (
            <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
              <div className="col-span-2">
                <img 
                  src={images[0]} 
                  alt={`${productName} 1`}
                  className="w-full h-full object-cover rounded-t-lg border border-gray-200"
                />
              </div>
              <img 
                src={images[1]} 
                alt={`${productName} 2`}
                className="w-full h-full object-cover rounded-bl-lg border border-gray-200"
              />
              <img 
                src={images[2]} 
                alt={`${productName} 3`}
                className="w-full h-full object-cover rounded-br-lg border border-gray-200"
              />
            </div>
          )}
          
          {imageCount === 4 && (
            <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
              <img 
                src={images[0]} 
                alt={`${productName} 1`}
                className="w-full h-full object-cover rounded-tl-lg border border-gray-200"
              />
              <img 
                src={images[1]} 
                alt={`${productName} 2`}
                className="w-full h-full object-cover rounded-tr-lg border border-gray-200"
              />
              <img 
                src={images[2]} 
                alt={`${productName} 3`}
                className="w-full h-full object-cover rounded-bl-lg border border-gray-200"
              />
              <img 
                src={images[3]} 
                alt={`${productName} 4`}
                className="w-full h-full object-cover rounded-br-lg border border-gray-200"
              />
            </div>
          )}
        </div>
      </div>

      {/* 통계 및 제품명 */}
      <div className="px-3 py-2.5 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-800 mb-2 line-clamp-2">{productName}</p>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-gray-400">
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="text-xs">{swatchCount}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleLikeToggle}
              className={`transition-colors ${isLiked ? 'text-red-400' : 'text-gray-300 hover:text-gray-500'}`}
            >
              <Heart
                className="w-3.5 h-3.5"
                fill={isLiked ? "currentColor" : "none"}
              />
            </button>
            <span className="text-xs text-gray-400">{currentLikeCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}