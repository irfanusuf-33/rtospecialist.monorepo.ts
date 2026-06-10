"use client";

import { useState } from "react";
import WestOutlinedIcon from '@mui/icons-material/WestOutlined';
import EastOutlinedIcon from '@mui/icons-material/EastOutlined';

interface CoursePaginationProps {
    setActivePage: (page: number) => void;
    totalPages: number;
}

const CoursePagination = ({ setActivePage, totalPages }: CoursePaginationProps) => {
    const [active, setActive] = useState(1);

    const visiblePages = 5;
    const changePage = (page: number) => {
        setActive(page);
        setActivePage(page);
    };

    const getPageRange = () => {
        const start = Math.max(1, active - Math.floor(visiblePages / 2));
        const end = Math.min(totalPages, start + visiblePages - 1);
        const range = [];
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    };

    return (
        <div className="pagination-container">
            <button
                className={`first-button px-2 hover:underline${active === 1 ? " disabled" : ""}`}
                onClick={() => changePage(1)}
                disabled={active === 1}
            >
                First
            </button>

            <button
                className={`prev-button flex items-center px-2 hover:underline${active === 1 ? " disabled" : ""}`}
                onClick={() => changePage(active - 1)}
                disabled={active === 1}
            >
                <WestOutlinedIcon fontSize="small" /> <span>Previous</span>
            </button>

            {getPageRange().map((pageNum) => (
                <button
                    key={pageNum}
                    onClick={() => changePage(pageNum)}
                    className={`page-button w-8 h-8 rounded-full text-center${active === pageNum ? " active" : ""}`}
                >
                    {pageNum}
                </button>
            ))}

            <button
                className={`next-button flex items-center px-2 hover:underline${active === totalPages ? " disabled" : ""}`}
                onClick={() => changePage(active + 1)}
                disabled={active === totalPages}
            >
                 <span>Next</span><EastOutlinedIcon fontSize="small" />
            </button>

            <button
                className={`last-button px-2 hover:underline${active === totalPages ? " disabled" : ""}`}
                onClick={() => changePage(totalPages)}
                disabled={active === totalPages}
            >
                Last
            </button>
        </div>
    );
// ...existing code...
};

export default CoursePagination;
