import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center py-80">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    </div>
  );
};

export default Loading;
