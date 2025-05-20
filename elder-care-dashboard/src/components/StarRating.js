export default function StarRating({ rating }) {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-lg text-yellow-400">
                    {star <= rating ? "★" : "☆"}
                </span>
            ))}
        </div>
    );
}