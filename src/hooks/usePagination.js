import { useState } from "react";

const usePagination = (data, perPage) => {
    const [pageNumber, setPageNumber] = useState(0);
    
    const pageCount = Math.ceil(data.length / perPage);
    const offset = pageNumber * perPage;
    const currentPageData = data.slice(offset, offset + perPage);

    const handlePageChange = ({ selected }) => {
        setPageNumber(selected);
    };

    const handlePagePrev = () => {
        setPageNumber((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handlePageNext = () => {
        setPageNumber((prev) => (prev < pageCount - 1 ? prev + 1 : prev));
    };

    return { pageNumber, setPageNumber, pageCount, currentPageData, handlePageChange, handlePagePrev, handlePageNext };
};

export default usePagination;
