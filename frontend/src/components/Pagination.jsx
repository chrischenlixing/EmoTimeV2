/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import "./Pagination.css";

function Pagination(props) {

    const defaultRowPerPage = 5;
    const [currPage, setCurrPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowPerPage);
    const [totalPages,setTotalPages]=useState(parseInt((props.totalNumber - 1) / defaultRowPerPage + 1));

    useEffect(
        ()=>{
            props.pageChange(currPage);
            props.rowPerPageChange(rowsPerPage);
        },[]
    )
    useEffect(()=>{
        setCurrPage(1);
        setTotalPages(parseInt((props.totalNumber - 1) / rowsPerPage + 1));
    },[props.totalNumber,setTotalPages]

    )
    useEffect(
        ()=>{
            props.pageChange(currPage);
        },[currPage]
    )

    useEffect(
        ()=>{
            setCurrPage(1);
            setTotalPages(parseInt((props.totalNumber - 1) / rowsPerPage + 1));
            props.rowPerPageChange(rowsPerPage);
        },[rowsPerPage]
    )

    //jump to first page
    const toFirstPage = (e) => {
        if (currPage !== 1) {
            setCurrPage(1);
        }
    }

    //jump to last page
    const toLastPage = (e) => {
        if (currPage !== totalPages) {
            setCurrPage(totalPages);
        }
    }

    //to next page
    const toNextPage = (e) => { 
        if (currPage !== totalPages) {
            setCurrPage(currPage + 1);
        }
    }

    //to pre page
    const toPrePage = (e) => {
        if (currPage !==1) {
            setCurrPage(currPage - 1);
        }
    }
    //set rows per page
    const handleRowsPerPage=(e)=>{
        setRowsPerPage(parseInt(e.target.value));
    }
    return (
        <div className="aot-pagination">
                <nav aria-label={`${props.id}_pagination`}>
                    <ul className="pagination">
                        <li className="page-item">
                            <button className="page-link" aria-label="Previous" onClick={toFirstPage}>
                                <span aria-hidden="true">«</span>
                            </button>
                        </li>
                        <li className="page-item">
                            <button className="page-link" onClick={toPrePage}>
                                Previous
                            </button>
                        </li>
                        <li className="page-number">
                            {currPage}/{totalPages} <span>{props.totalNumber} items</span>
                        </li>
                        <li className="page-item">
                            <button className="page-link" onClick={toNextPage}>
                                Next
                            </button>
                        </li>
                        <li className="page-item">
                            <button className="page-link" aria-label="Next" onClick={toLastPage}>
                                <span aria-hidden="true">»</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            <div className="rows-per-page">
                <span>
                    <label htmlFor={`${props.id}_rowsPerPage`} className="aoe-text">
                        Rows per Page:
                    </label>
                </span>
                <span>
                    <select value={rowsPerPage} onChange={handleRowsPerPage} 
                    className="form-select" id={`${props.id}_rowsPerPage`}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                </span>
            </div>
        </div>
    );
}

Pagination.propTypes = {
    totalNumber: PropTypes.number.isRequired,
    pageChange: PropTypes.func.isRequired,
    rowPerPageChange: PropTypes.func.isRequired,
    id:PropTypes.string.isRequired
};
export default Pagination;