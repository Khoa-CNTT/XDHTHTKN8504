export default function RatingDistribution({ ratingDistribution }) {
    return (
        <div className="mb-8">
            {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center mb-1">
                    <span className="w-4 text-sm text-gray-700">{item.stars}</span>
                    <div className="flex-1 mx-2">
                        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div
                                className={`h-full rounded-full ${item.stars === 5 ? 'bg-teal-500' :
                                        item.stars === 4 ? 'bg-purple-400' :
                                            item.stars === 3 ? 'bg-yellow-400' :
                                                'bg-red-400'
                                    }`}
                                style={{ width: `${(item.count / 300) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    <span className="w-12 text-right text-xs text-gray-500">
                        {item.count > 999 ? `${(item.count / 1000).toFixed(1)}k` :
                            item.count > 0 ? item.count : '0k'}
                    </span>
                </div>
            ))}
        </div>
    );
}