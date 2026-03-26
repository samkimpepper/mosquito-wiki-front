import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Tweet } from "react-tweet";

interface SwatchFeedCardProps {
  type: "swatch";
  user: { name: string; handle: string; avatar: string };
  time: string;
  description: string;
  images: string[];
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
}

interface TweetFeedCardProps {
  type: "tweet";
  tweetId: string;
  user: { name: string; handle: string; avatar: string };
  time: string;
}

export type SwatchFeedItem = SwatchFeedCardProps | TweetFeedCardProps;

function ImageGrid({ images }: { images: string[] }) {
  if (images.length === 1) {
    return (
      <div className="rounded-lg overflow-hidden border border-gray-200 mt-2">
        <img src={images[0]} alt="" className="w-full object-cover max-h-72" />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-0.5 rounded-lg overflow-hidden border border-gray-200 mt-2">
        {images.map((img, i) => (
          <img key={i} src={img} alt="" className="w-full h-40 object-cover" />
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="grid grid-cols-2 gap-0.5 rounded-lg overflow-hidden border border-gray-200 mt-2">
        <img src={images[0]} alt="" className="row-span-2 w-full h-full object-cover" style={{ maxHeight: '200px' }} />
        <img src={images[1]} alt="" className="w-full h-[99px] object-cover" />
        <img src={images[2]} alt="" className="w-full h-[99px] object-cover" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-0.5 rounded-lg overflow-hidden border border-gray-200 mt-2">
      {images.map((img, i) => (
        <img key={i} src={img} alt="" className="w-full h-28 object-cover" />
      ))}
    </div>
  );
}

export function SwatchFeedCard(props: SwatchFeedItem) {
  const [liked, setLiked] = useState(props.type === "swatch" ? props.isLiked ?? false : false);
  const [likeCount, setLikeCount] = useState(props.type === "swatch" ? props.likeCount : 0);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors bg-white p-3">
      {/* 유저 정보 */}
      <div className="flex items-center gap-2">
        <img
          src={props.user.avatar}
          alt={props.user.name}
          className="w-7 h-7 rounded-full object-cover border border-gray-200 flex-shrink-0"
        />
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-gray-900 truncate">{props.user.name}</span>
          <span className="text-xs text-gray-400 truncate">{props.user.handle}</span>
          <span className="text-xs text-gray-300 flex-shrink-0">· {props.time}</span>
        </div>
        {props.type === "tweet" && (
          <span className="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 border border-gray-200 text-gray-400 text-xs rounded flex-shrink-0">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            임베드
          </span>
        )}
      </div>

      {props.type === "swatch" && (
        <>
          {/* 설명 */}
          {props.description && (
            <p className="text-xs text-gray-800 mt-2 leading-relaxed line-clamp-3">{props.description}</p>
          )}

          {/* 이미지 */}
          {props.images.length > 0 && <ImageGrid images={props.images} />}

          {/* 액션 */}
          <div className="flex items-center gap-3 mt-2.5">
            <button
              onClick={() => { setLiked(l => !l); setLikeCount(c => liked ? c - 1 : c + 1); }}
              className={`flex items-center gap-1 transition-colors ${liked ? "text-pink-500" : "text-gray-400 hover:text-pink-500"}`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? "fill-pink-500" : ""}`} />
              {likeCount > 0 && <span className="text-xs">{likeCount}</span>}
            </button>
            <button className="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-3.5 h-3.5" />
              {props.commentCount > 0 && <span className="text-xs">{props.commentCount}</span>}
            </button>
          </div>
        </>
      )}

      {props.type === "tweet" && (
        <div className="mt-2 [&_.react-tweet-theme]:shadow-none [&_.react-tweet-theme]:border-0 [&_.react-tweet-theme]:rounded-none [&_.react-tweet-theme]:bg-transparent [&_.react-tweet-theme]:p-0 [&_.react-tweet-theme]:max-w-none" style={{ zoom: 0.7 }}>
          <Tweet id={props.tweetId} />
        </div>
      )}
    </div>
  );
}
