import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, count, size = 14 }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'}
        />
      ))}
      <span className="text-sm font-semibold text-zinc-200 ml-0.5">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-zinc-500">({count.toLocaleString()})</span>
      )}
    </div>
  );
};

export default StarRating;
