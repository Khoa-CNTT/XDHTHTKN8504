import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchReviewForStaff } from '../../store/reviewSlice';
import Loading from '../Loading';
import ErrorFallback from "../ErrorFallback"

const Star = ({ filled }) => (
    <svg
        className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
        viewBox="0 0 20 20"
    >
        <polygon points="10 1.5 12.4 6.8 18.2 7.3 13.8 11.1 15.2 16.5 10 13.6 4.8 16.5 6.2 11.1 1.8 7.3 7.6 6.8 10 1.5" />
    </svg>
);

const ReviewCard = ({ data }) => {
    const fullName = `${data.reviewer.firstName} ${data.reviewer.lastName}`;
    return (
        <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <img
                src={data.reviewer.avartar}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover border border-gray-300"
            />
            <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800">{fullName}</h4>
                <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} filled={i < data.rating} />
                    ))}
                </div>
                <p className="mt-2 text-gray-700 italic">"{data.comment}"</p>
            </div>
        </div>
    );
};

const ReviewUsed = () => {
    const { _id } = useParams();
    const dispatch = useDispatch();
    const { reviews, loading, error } = useSelector((state) => state.review)

    useEffect(() => {
        dispatch(fetchReviewForStaff(_id));
    }, [dispatch, _id])

    // console.log("dd", reviews);
    if(loading)
        return <Loading />
    
    if(error)
        return <ErrorFallback error={error} onRetry={dispatch(fetchReviewForStaff(_id))} />

    const averageRating =
        reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    return (
        <div className="w-full">
            {/* Tổng quan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <p className="text-gray-500 text-sm">Tổng số đánh giá</p>
                    <p className="text-3xl font-bold mr-2">{reviews.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <p className="text-gray-500 text-sm">Trung bình rating</p>
                    <div className="flex justify-center items-center gap-1">
                        <span className="text-3xl font-bold mr-2">{averageRating.toFixed(1) || 0}</span>
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} filled={i < Math.round(averageRating)} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Danh sách đánh giá */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <ReviewCard key={review._id} data={review} />
                ))}
            </div>
        </div>
    );
};

export default ReviewUsed;
