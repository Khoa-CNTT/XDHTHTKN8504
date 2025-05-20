import React, { useState } from 'react';
// import { Bell, HelpCircle } from 'lucide-react';
import { Button } from '../components/Form';
import { useNavigate } from 'react-router-dom';
import Layout from "../Layout";
import { reviewsData } from '../components/Datas';
import ReviewStats from '../components/ReviewStats';
import RatingDistribution from '../components/RatingDistribution';
import ReviewsList from '../components/ReviewsList';

function Review() {
    const [reviews, setReviews] = useState(reviewsData.reviews);

    const toggleLike = (id) => {
        setReviews(reviews.map(review =>
            review.id === id ? { ...review, liked: !review.liked } : review
        ));
    };
    return (
        <Layout>
            {/* <h1 className="text-xl font-semibold">Review</h1> */}
            <div className="w-full mx-auto bg-white p-6 font-sans">
                {/* Header with icons */}
                {/* <div className="flex justify-end mb-6 gap-4">
                    <Bell size={20} />
                    <HelpCircle size={20} />
                    <span className="font-medium">View Shop</span>
                </div> */}

                {/* Reviews header */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Reviews</h1>
                    {/* <span className="text-sm text-gray-600">{reviewsData.dateRange}</span> */}
                </div>

                {/* Review stats */}
                <div className="flex mb-6 border-b pb-6">
                    <div className="w-1/2 pr-4">
                        <ReviewStats
                            totalReviews={reviewsData.totalReviews}
                            growthPercentage={reviewsData.growthPercentage}
                            averageRating={reviewsData.averageRating}
                        />
                    </div>

                    <div className="w-1/2 pl-4">
                        <RatingDistribution ratingDistribution={reviewsData.ratingDistribution} />
                    </div>
                </div>

                {/* Reviews list */}
                <ReviewsList reviews={reviews} toggleLike={toggleLike} />
            </div>
        </Layout>
    );
}

export default Review
