import { Heart } from 'lucide-react';
import StarRating from './StarRating';

export default function ReviewItem({ review, toggleLike }) {
    return (
        <div className="mb-8 pb-6 border-b">
            <div className="flex mb-2">
                <div className="mr-3">
                    <img
                        src={review.avatarUrl}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="font-medium">{review.name}</h3>
                    <div className="text-xs text-gray-500">
                        <p>Total Spent: ${review.totalSpent}</p>
                        <p>Total Review: {review.totalReviews}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex mb-1">
                        <StarRating rating={review.rating} />
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                </div>
            </div>

            <div className="text-sm text-gray-700 mb-2">
                <p>{review.comment}</p>
                <p className="mt-2">{review.postscript}</p>
            </div>

            <div className="flex mt-4">
                <button className="mr-4 px-3 py-1 border rounded text-xs">Public Comment</button>
                <button className="mr-4 px-3 py-1 border rounded text-xs">Direct Message</button>
                <button onClick={() => toggleLike(review.id)} className="flex items-center">
                    {review.liked ? (
                        <Heart size={18} fill="red" color="red" />
                    ) : (
                        <Heart size={18} />
                    )}
                </button>
            </div>
        </div>
    );
}