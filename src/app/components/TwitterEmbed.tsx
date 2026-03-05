import { Heart, MessageCircle, Link2 } from "lucide-react";

interface TwitterEmbedProps {
  username: string;
  handle: string;
  isVerified: boolean;
  content: string;
  images: string[];
  timestamp: string;
  likes: number;
  userProfile: string;
}

export function TwitterEmbed({ 
  username, 
  handle, 
  isVerified, 
  content, 
  images, 
  timestamp,
  likes,
  userProfile 
}: TwitterEmbedProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 p-4">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <img 
            src={userProfile} 
            alt={username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm">{username}</span>
              {isVerified && (
                <svg viewBox="0 0 22 22" className="w-4 h-4 fill-blue-500">
                  <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"/>
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-500">@{handle} · Follow</span>
          </div>
        </div>
        {/* X 로고 */}
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-900">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </div>

      {/* 내용 */}
      <p className="text-sm mb-3 whitespace-pre-wrap">{content}</p>

      {/* 이미지 그리드 */}
      <div className="aspect-square w-full mb-3">
        {images.length === 1 && (
          <img 
            src={images[0]} 
            alt="Tweet image"
            className="w-full h-full object-cover rounded-2xl"
          />
        )}
        
        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-1 h-full">
            {images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`Tweet image ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
            ))}
          </div>
        )}
        
        {images.length === 3 && (
          <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
            <img 
              src={images[0]} 
              alt="Tweet image 1"
              className="col-span-2 w-full h-full object-cover rounded-xl"
            />
            <img 
              src={images[1]} 
              alt="Tweet image 2"
              className="w-full h-full object-cover rounded-xl"
            />
            <img 
              src={images[2]} 
              alt="Tweet image 3"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        )}
        
        {images.length === 4 && (
          <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
            {images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`Tweet image ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
            ))}
          </div>
        )}
      </div>

      {/* 타임스탬프 */}
      <p className="text-sm text-gray-500 mb-3">{timestamp}</p>

      {/* 액션 버튼들 */}
      <div className="flex items-center gap-6 mb-4 pt-3 border-t border-gray-100">
        <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
          <Heart className="w-5 h-5" />
          <span className="text-sm">{likes}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">Reply</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
          <Link2 className="w-5 h-5" />
          <span className="text-sm">Copy link</span>
        </button>
      </div>

      {/* Read more on X 버튼 */}
      <button className="w-full py-2 text-center text-blue-500 hover:bg-gray-50 rounded-full border border-gray-200 transition-colors">
        <span className="text-sm font-medium">Read more on X</span>
      </button>
    </div>
  );
}
