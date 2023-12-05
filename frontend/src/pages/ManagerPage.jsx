/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import UseCheckMsg from "../hooks/UseCheckMsg";
import "./ManagerPage.css";
import Pagination from '../components/Pagination';
import Navbar from '../components/NavBar';
import { createRoot } from "react-dom/client";
import { Modal } from 'bootstrap';


function ManagerPage() {

    const loadDataURL = '/api/allReviews';
    const searchURL = '/api/search';
    const loadCheckInDataURL = '/api/getCheckInByName';
    const reviewingURL = '/api/giveReviews';


    const [tableData, setTableData] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalNumber, setTotalNumber] = useState(0);
    const [modalTableData, setModalTableData] = useState([]);
    const [modalRowsPerPage, setModalRowsPerPage] = useState(0);
    const [modalCurrentPage, setModalCurrentPage] = useState(1);
    const [modalTotalNumber, setModalTotalNumber] = useState(0);
    const table = useRef(null);
    const modalTable = useRef(null);
    const reviewingTable = useRef(null);



    UseCheckMsg();

    const loadData = () => {
        fetch(loadDataURL).then(
            (res) => {
                if (res.redirected) {
                    window.location.href = res.url;
                } else if (!res.ok) {
                    throw new Error();
                } else {
                    return res.json()
                }
            }
        ).then(
            (data) => {
                setTableData(() => data);
                setTotalNumber(data.length);
            }
        ).catch((error) => {
            console.error(error);
        })
    }



    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        table.current.innerHTML = "";

        let start = rowsPerPage * (currentPage - 1);

        for (let i = start; i < start + rowsPerPage; i++) {
            if (i >= tableData.length) {
                break;
            }
            const row = table.current.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);

            cell1.innerHTML = i + 1;
            cell2.innerHTML = tableData[i].name;
            cell3.innerHTML = tableData[i].shift;

            if (tableData[i].reviews) {
                cell4.innerHTML = tableData[i].reviews;
            }


            let obj = {
                "shift": tableData[i].shift,
                "name": tableData[i].name
            };
            const root = createRoot(cell5);

        root.render(
        <>
            <button className="operation-button" onClick={() => showCheckIn(obj)} 
            tabIndex="0" onKeyDown={(e) => { if (e.key === "Enter") return showCheckIn(obj) }}>
            View
            </button>
            <button className="operation-button" onClick={() => showReviewing(obj)} 
            tabIndex="0" onKeyDown={(e) => { if (e.key === "Enter") return showReviewing(obj) }}>
            Review
            </button>
            <button className="operation-button" onClick={() => handleDeleteShift(obj)}>
            Delete
            </button>
        </>
)

        }

    }, [tableData, rowsPerPage, currentPage])

    const onPageChange = (currPage) => {
        setCurrentPage(currPage);
        return;
    }
    const onRowPerPageChange = (rowPerPage) => {
        setRowsPerPage(rowPerPage);
    }

    //searce shifts
    const handleSearchShift = (e) => {
        if (e) {
            e.preventDefault();
        }
        let obj = {};
        let shift = document.getElementById("shift").value;
        let name = document.getElementById("name").value;
        if (shift && shift !== "") {
            obj.shift = shift;
        }
        if (name && name !== "") {
            obj.name = name;
        }
        fetch(searchURL, {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(
            (response) => {
                if (response.redirected) {
                    window.location.href = response.url;
                } else if (!response.ok) {
                    throw new Error();
                } else {
                    return response.json()
                }
            }
        ).then((data) => {
            setTableData(() => data);
            setTotalNumber(data.length);
        }
        ).catch((error) => {
            console.error(error);
        })
    }
    //show check in records
    const showCheckIn = (obj) => {
        let checkInModal = new Modal(document.getElementById('checkInModal'));
        checkInModal.show();
        loadModalData(obj);
    }

    //load check in data
    const loadModalData = (obj) => {
        fetch(loadCheckInDataURL, {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(
            (response) => {
                if (response.redirected) {
                    window.location.href = response.url;
                } else if (!response.ok) {
                    throw new Error();
                } else {
                    return response.json()
                }
            }
        ).then((data) => {
            console.log(data);
            setModalTableData(() => data);
            setModalTotalNumber(data.length);
        }
        ).catch((error) => {
            console.error(error);
        })
    }

    const onModalPageChange = (curr) => {
        setModalCurrentPage(curr);
        return;
    }

    const onModalRowPerPageChange = (curr) => {
        setModalRowsPerPage(curr);
    }

    useEffect(() => {
        modalTable.current.innerHTML = "";

        let start = modalRowsPerPage * (modalCurrentPage - 1);
        for (let i = start; i < start + modalRowsPerPage; i++) {
            if (i >= modalTableData.length) {
                break;
            }
            const row = modalTable.current.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1)
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);

            cell1.innerHTML = i + 1;
            cell2.innerHTML = modalTableData[i].name;
            cell3.innerHTML = modalTableData[i].shift;
            cell4.innerHTML = modalTableData[i].date;
        }

    }, [modalTableData, modalRowsPerPage, modalCurrentPage])

    const handleDeleteShift = (shiftObj) => {
        fetch('/api/deleteOneShift', { 
            method: 'POST',
            body: JSON.stringify(shiftObj),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                loadData(); 
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    //show reviewing table
    const showReviewing = (obj) => {
        reviewingTable.current = new Modal(document.getElementById('reviewingModal'));
        reviewingTable.current.show();
        document.getElementById('reviewingShift').innerHTML = "Shift: " + obj.shift;
        document.getElementById('reviewingName').innerHTML = "Name: " + obj.name;
    }

    //submit reviewing
    const submitReviewing = () => {
        let obj = {
            "name": document.getElementById('reviewingName').innerHTML.split(" ")[1],
            "shift": document.getElementById('reviewingShift').innerHTML.split(" ")[1],
            "reviews": document.getElementById('review').value
        }
        console.log(obj);
        if (!obj.name || obj.name === "") {
            alert("Name Shouldn't be Empty");
            return;
        }
        if (!obj.shift || obj.shift === "") {
            alert("Shift Shouldn't be Empty");
            return;
        }
        if (!obj.reviews || obj.reviews === "") {
            alert("Review Shouldn't be Empty");
            return;
        }

        if (typeof obj.reviews == 'number' || Number.isFinite(obj.reviews)) {
            alert("invalid input");
            return;
        }
        
        fetch(reviewingURL, {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(
            (response) => {
                if (response.redirected) {
                    window.location.href = response.url;
                } else if (!response.ok) {
                    throw new Error();
                } else {
                    reviewingTable.current.hide();
                    handleSearchShift();
                }
            }
        ).catch((error) => {
            console.error(error);
        })
    }

    return (
        <>
            <Navbar></Navbar>

            <main>
                <form
                    id="Search-form"
                    className="form-inline aot-form"
                    action="/"
                    method="post"
                    onSubmit={handleSearchShift}
                >
                    <div className="form-group">
                        <label htmlFor="name" className="aoe-text">
                            Name:
                        </label>
                        <br />
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="shift" className="aoe-text">
                            Shift:
                        </label>
                        <br />
                        <input
                            type="text"
                            name="shift"
                            id="shift"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary aoe-btn-submit">Search</button>
                    </div>

                </form>
                <table className="table aot-table table-striped" id="reviewsTable">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Employee Name</th>
                            <th scope="col">Shifts</th>
                            <th scope="col">Review</th>
                            <th scope="col">Functions</th>
                        </tr>
                    </thead>
                    <tbody ref={table}></tbody>
                </table>
                <Pagination totalNumber={totalNumber} pageChange={onPageChange} rowPerPageChange={onRowPerPageChange} id="managerMain"/>
                <div className="modal fade" id="checkInModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog aot-modal">
                        <div className="modal-dialog modal-dialog-scrollable aot-modal">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="staticBackdropLabel">Records</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                </div>
                                <div className="modal-body">
                                    <table className="table aot-table table-striped" id="modalTable">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">name</th>
                                                <th scope="col">shift</th>
                                                <th scope="col">date</th>
                                            </tr>
                                        </thead>
                                        <tbody ref={modalTable}></tbody>
                                    </table>
                                </div>
                                <Pagination totalNumber={modalTotalNumber} pageChange={onModalPageChange} rowPerPageChange={onModalRowPerPageChange} id="managerModule"/>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="reviewingModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel2" aria-hidden="true">
                    <div className="modal-dialog aot-modal">
                        <div className="modal-dialog modal-dialog-scrollable aot-modal">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="staticBackdropLabel2">Reviewing</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                </div>
                                <div className="modal-body">
                                    <div className="reviewing-label">
                                        <label className="aoe-text" id="reviewingShift">
                                            Shift:
                                        </label>
                                        <label className="aoe-text" id="reviewingName">
                                            Name:
                                        </label>
                                    </div>
                                    <div className="form-group reviewing-inputgroup">
                                        <label htmlFor="review" className="aoe-text reviewing-input-label">
                                            Review:
                                        </label>
                                        <input
                                            type="text"
                                            name="review"
                                            id="review"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary aoe-btn-submit" onClick={submitReviewing}>Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </>
    );
}

ManagerPage.propTypes = {};

export default ManagerPage;