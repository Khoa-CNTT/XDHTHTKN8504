import ReviewItem from './ReviewItem';

export default function ReviewsList({ reviews, toggleLike }) {
    return (
        <div>
            {reviews.map((review) => (
                <ReviewItem
                    key={review.id}
                    review={review}
                    toggleLike={toggleLike}
                />
            ))}
        </div>
    );
}