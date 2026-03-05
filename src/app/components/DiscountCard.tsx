interface DiscountCardProps {
  image: string;
  text: string;
}

export function DiscountCard({ image, text }: DiscountCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* 이미지 */}
      <img 
        src={image} 
        alt={text}
        className="w-full aspect-square object-cover"
      />
      
      {/* 텍스트 */}
      <div className="p-3">
        <p className="text-sm text-gray-900">{text}</p>
      </div>
    </div>
  );
}
