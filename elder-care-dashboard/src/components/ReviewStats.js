import StarRating from './StarRating';

export default function ReviewStats({ totalReviews, growthPercentage, averageRating }) {
    return (
        <div className="flex border-b pb-6 mb-6">
            {/* Total reviews */}
            <div className="w-1/2 pr-4">
                <p className="text-sm text-gray-600">Total Reviews</p>
                <div className="flex items-center mt-1">
                    <span className="text-3xl font-bold mr-2">{(totalReviews / 1000).toFixed(1)}k</span>
                    <span className="text-xs bg-green-100 text-green-800 px-1 rounded flex items-center">
                        {growthPercentage}% ↑
                    </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Growth in reviews on this year</p>
            </div>

            {/* Average rating */}
            <div className="w-1/2 pl-4">
                <p className="text-sm text-gray-600">Average Rating</p>
                <div className="flex items-center mt-1">
                    <span className="text-3xl font-bold mr-2">{averageRating.toFixed(1)}</span>
                    <StarRating rating={averageRating} />
                </div>
                <p className="text-xs text-gray-500 mt-1">Average rating on this year</p>
            </div>
        </div>
    );
}