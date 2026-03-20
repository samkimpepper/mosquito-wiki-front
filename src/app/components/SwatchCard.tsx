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
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors">
      {/* 사용자 프로필 헤더 */}
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
      <div className="px-3 py-2.5 border-t border-gray-100">
        <h3 className="text-xs font-medium text-gray-800 mb-1">{name}</h3>
        <p className="text-xs text-gray-400 line-clamp-2">{description}</p>
      </div>
    </div>
  );
}