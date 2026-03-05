interface FeedCardProps {
  images: string[];
  productName: string;
  userProfile: {
    avatar: string;
    username: string;
    date: string;
  };
}

export function FeedCard({ images, productName, userProfile }: FeedCardProps) {
  const imageCount = images.length;
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* 프로필 섹션 */}
      <div className="p-3 flex items-center gap-2 border-b border-gray-100">
        <img 
          src={userProfile.avatar} 
          alt={userProfile.username}
          className="w-6 h-6 rounded-full object-cover"
        />
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-gray-900">{userProfile.username}</span>
          <span className="text-gray-400">{userProfile.date}</span>
        </div>
      </div>

      {/* 이미지 영역 */}
      <div className="bg-white">
        {imageCount === 1 && (
          <img 
            src={images[0]} 
            alt={productName}
            className="w-full aspect-square object-cover"
          />
        )}
        
        {imageCount === 2 && (
          <div className="grid grid-cols-2 gap-1">
            {images.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`${productName} ${idx + 1}`}
                className="w-full aspect-square object-cover"
              />
            ))}
          </div>
        )}
        
        {imageCount === 3 && (
          <div className="grid grid-cols-2 gap-1">
            <img 
              src={images[0]} 
              alt={`${productName} 1`}
              className="w-full aspect-square object-cover col-span-2"
            />
            {images.slice(1).map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`${productName} ${idx + 2}`}
                className="w-full aspect-square object-cover"
              />
            ))}
          </div>
        )}
        
        {imageCount === 4 && (
          <div className="grid grid-cols-2 gap-1">
            {images.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`${productName} ${idx + 1}`}
                className="w-full aspect-square object-cover"
              />
            ))}
          </div>
        )}
      </div>

      {/* 제품명 */}
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900">{productName}</p>
      </div>
    </div>
  );
}
