interface SwatchCardProps {
  images: string[];
  name: string;
  description: string;
  userProfile: {
    avatar: string;
    username: string;
    date: string;
  };
}

export function SwatchCard({ images, name, description, userProfile }: SwatchCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
      {/* 사용자 프로필 헤더 */}
      <div className="p-3 flex items-center gap-2">
        <img 
          src={userProfile.avatar} 
          alt={userProfile.username}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{userProfile.username}</span>
          <span className="text-xs text-gray-400">{userProfile.date}</span>
        </div>
      </div>

      {/* 이미지 그리드 - 고정된 크기 */}
      <div className="aspect-square w-full">
        {images.length === 1 && (
          <img 
            src={images[0]} 
            alt={`${name} - 1`}
            className="w-full h-full object-cover"
          />
        )}
        
        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-1 h-full">
            {images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${name} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ))}
          </div>
        )}
        
        {images.length === 3 && (
          <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
            <img 
              src={images[0]} 
              alt={`${name} - 1`}
              className="col-span-2 w-full h-full object-cover"
            />
            <img 
              src={images[1]} 
              alt={`${name} - 2`}
              className="w-full h-full object-cover"
            />
            <img 
              src={images[2]} 
              alt={`${name} - 3`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {images.length === 4 && (
          <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
            {images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${name} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ))}
          </div>
        )}
      </div>
      
      {/* 텍스트 정보 - 항상 아래 */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>
    </div>
  );
}