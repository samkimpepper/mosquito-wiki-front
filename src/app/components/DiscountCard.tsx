interface DiscountCardProps {
  image: string;
  productName: string;
  discountInfo: string;
}

export function DiscountCard({ image, productName, discountInfo }: DiscountCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors bg-white">
      {/* 이미지 */}
      <img
        src={image}
        alt={productName}
        className="w-full aspect-square object-cover"
      />

      {/* 텍스트 */}
      <div className="px-3 py-2.5 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-800 mb-0.5">{productName}</p>
        <p className="text-xs text-gray-400">{discountInfo}</p>
      </div>
    </div>
  );
}