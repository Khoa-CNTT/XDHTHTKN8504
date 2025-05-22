import React from "react";

function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages === 0) return null;

    const paginationRange = () => {
        const totalPageNumbersToShow = 7;
        const totalPageNumbers = totalPages;

        if (totalPageNumbers <= totalPageNumbersToShow) {
            return [...Array(totalPageNumbers).keys()].map(i => i + 1);
        }

        const leftSiblingIndex = Math.max(page - 1, 1);
        const rightSiblingIndex = Math.min(page + 1, totalPageNumbers);

        const showLeftEllipsis = leftSiblingIndex > 3;
        const showRightEllipsis = rightSiblingIndex < totalPageNumbers - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPageNumbers;

        let pages = [];

        if (!showLeftEllipsis && showRightEllipsis) {
            let leftRange = [...Array(5).keys()].map(i => i + 1);
            pages = [...leftRange, "...", lastPageIndex - 1, lastPageIndex];
        } else if (showLeftEllipsis && !showRightEllipsis) {
            let rightRange = [...Array(5).keys()].map(i => totalPageNumbers - 4 + i);
            pages = [firstPageIndex, 2, "...", ...rightRange];
        } else if (showLeftEllipsis && showRightEllipsis) {
            pages = [
                firstPageIndex,
                2,
                "...",
                leftSiblingIndex,
                page,
                rightSiblingIndex,
                "...",
                lastPageIndex - 1,
                lastPageIndex,
            ];
        } else {
            pages = [...Array(totalPageNumbers).keys()].map(i => i + 1);
        }

        return [...new Set(pages)];
    };

    const pages = paginationRange();

    return (
        <nav className="flex justify-center items-center space-x-3 mt-8 select-none">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className={`px-4 py-2 rounded-md border transition-colors duration-300 ${page === 1
                        ? "text-gray-400 border-gray-300 cursor-not-allowed bg-gray-100"
                        : "hover:bg-blue-100 border-blue-300 text-blue-600"
                    }`}
            >
                Prev
            </button>

            {pages.map((p, idx) =>
                p === "..." ? (
                    <span
                        key={idx}
                        className="px-4 py-2 text-gray-500 font-semibold cursor-default select-none"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={idx}
                        onClick={() => onPageChange(p)}
                        className={`px-4 py-2 rounded-md border transition-colors duration-300 ${p === page
                                ? "bg-blue-600 text-white border-blue-600 font-bold"
                                : "hover:bg-blue-100 border-blue-300 text-blue-600"
                            }`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-md border transition-colors duration-300 ${page === totalPages
                        ? "text-gray-400 border-gray-300 cursor-not-allowed bg-gray-100"
                        : "hover:bg-blue-100 border-blue-300 text-blue-600"
                    }`}
            >
                Next
            </button>
        </nav>
    );
}

export default Pagination;
