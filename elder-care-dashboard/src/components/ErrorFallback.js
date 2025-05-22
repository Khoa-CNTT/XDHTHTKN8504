import React from "react";

export default function ErrorFallback({ error, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white shadow-md rounded-xl max-w-xl mx-auto mt-12 border border-red-200">
            <div className="text-6xl text-red-500 mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
                Đã xảy ra lỗi!
            </h2>
            <p className="text-gray-600 text-center max-w-md">
                {error?.message || "Không thể kết nối tới máy chủ. Vui lòng thử lại sau."}
            </p>
            <button
                onClick={onRetry}
                className="mt-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-110 text-white px-5 py-2 rounded shadow"
            >
                🔄 Thử lại
            </button>
        </div>
    );
}
