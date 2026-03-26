import { Heart, Image as ImageIcon, Eye } from "lucide-react";
import { useState } from "react";


interface Tag {
  id: number;
  tagValue: string;
  color: string | null;
}

const TAG_COLORS = ["#FF3B00", "#AE4DFF", "#00BEFF", "#00D47B"];

interface FeedProductCardProps {
  images: string[];
  brandName: string;
  productName: string;
  categoryName?: string;
  tags?: Tag[];
  swatchCount?: number;
  likeCount?: number;
  viewCount?: number;
}

export function FeedProductCard({ images, brandName, productName, categoryName, tags = [], swatchCount = 0, likeCount = 0, viewCount = 0 }: FeedProductCardProps) {
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
      {/* 브랜드 + 제품명 */}
      <div className="px-4 pt-3.5 pb-2">
        <span className="text-xs font-medium text-gray-700 truncate">{brandName}</span>
        <p className="text-xs font-medium text-gray-800 line-clamp-1 mt-1">{productName}</p>
        {categoryName && (
          <p className="text-xs text-gray-400 mt-2">{categoryName}</p>
        )}
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

      {/* 태그 */}
      <div className="px-4 pb-2 flex gap-1.5 overflow-hidden" style={{ height: '1.75rem' }}>
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="px-2 py-0.5 rounded text-xs text-white shrink-0"
            style={{ backgroundColor: tag.color ?? TAG_COLORS[tag.id % TAG_COLORS.length] }}
          >
            {tag.tagValue}
          </span>
        ))}
      </div>

      {/* 하단: 아이콘 */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-3">
        <div className="flex items-center gap-1 text-gray-400">
          <ImageIcon className="w-3.5 h-3.5" />
          <span className="text-xs">{swatchCount}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Eye className="w-3.5 h-3.5" />
          <span className="text-xs">{viewCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleLikeToggle}
            className={`transition-colors ${isLiked ? 'text-red-400' : 'text-gray-300 hover:text-gray-500'}`}
          >
            <Heart className="w-3.5 h-3.5" fill={isLiked ? "currentColor" : "none"} />
          </button>
          <span className="text-xs text-gray-400">{currentLikeCount}</span>
        </div>
      </div>

    </div>
  );
}