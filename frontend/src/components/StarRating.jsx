import { Star } from 'lucide-react';

const StarRating = ({ rating, totalReviews, size = 18, interactive = false, onRate = null }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        disabled={!interactive}
                        onClick={() => interactive && onRate && onRate(star)}
                        className={`${interactive ? 'hover:scale-110 active:scale-95' : 'cursor-default'} transition-all`}
                    >
                        <Star
                            size={size}
                            className={`${star <= rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : interactive && star <= (interactive.hoverRating || 0)
                                        ? 'text-amber-200 fill-amber-200'
                                        : 'text-gray-200'
                                }`}
                        />
                    </button>
                ))}
            </div>
            {totalReviews !== undefined && (
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                    ({totalReviews})
                </span>
            )}
            {rating > 0 && totalReviews === undefined && !interactive && (
                <span className="text-sm font-black text-gray-900 mt-0.5">{rating.toFixed(1)}</span>
            )}
        </div>
    );
};

export default StarRating;
