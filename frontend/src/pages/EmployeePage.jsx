/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useRef } from "react";
import UseCheckMsg from "../hooks/UseCheckMsg";
import "./EmployeePage.css";
import Pagination from "../components/Pagination";
import NavBar from "../components/NavBar";
import { createRoot } from "react-dom/client";
import { Modal } from 'bootstrap'


function EmployeePage() {

    const initShiftListURL = '/api/getShiftList';
    const addShiftURL = '/api/addShift';
    const loadDataURL = '/api/getByName';
    const checkInURL = '/api/clockin';
    const loadCheckInDataURL = '/api/getCheckInByName';

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



    //init shift select list
    const initShiftList = () => {
        fetch(initShiftListURL).then(
            (response) => {
                return response.json()
            }
        ).then((data) => {
            let select = document.getElementById("shiftList");
            let size = select.options.length;
            for (let i = 0; i < size; i++) {
                select.remove(0);
            }
            for (let i = 0; i < data.length; i++) {
                var option = document.createElement("option");
                option.text = data[i];
                option.value = data[i];
                select.add(option);
            }
        }).catch((error) => {
            console.error(error);
        })
    }

    UseCheckMsg();

    //load data into table
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
                // console.log(data);
                setTableData(() => data);
                setTotalNumber(data.length);
            }
        ).catch((error) => {
            console.error(error);
        })
    }



    useEffect(() => {
        initShiftList();
        loadData();
    }, []);

    useEffect(() => {
        // console.log(table.current);
        // console.log(table.current.hasChildNodes());
        table.current.innerHTML = "";
        // console.log("df:"+rowsPerPage);

        let start = rowsPerPage * (currentPage - 1);
        for (let i = start; i < start + rowsPerPage; i++) {
            if (i >= tableData.length) {
                break;
            }
            const row = table.current.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1)
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);

            cell1.innerHTML = i + 1;
            cell2.innerHTML = tableData[i].name;
            cell3.innerHTML = tableData[i].shift;

            if (tableData[i].reviews) {
                cell4.innerHTML = tableData[i].reviews;
            }
            else{
                cell4.innerHTML = "<span class='text-muted'>Waiting for Manager's Review</span>";
            }
            let obj = {
                "shift": tableData[i].shift,
                "name": tableData[i].name
            };
            const root = createRoot(cell5);
            root.render(
                <>
                <button className="operation-button" onClick={() => clockinfunc(obj)} 
                  tabIndex="0" onKeyDown={(e) => { if (e.key === "Enter") return clockinfunc(obj) }}>
                  Clockin
                </button>
                <button className="operation-button" onClick={() => showCheckIn(obj)} 
                  tabIndex="0" onKeyDown={(e) => { if (e.key === "Enter") return showCheckIn(obj) }}>
                  View
                </button>
                <button className="operation-button" onClick={() => handleDeleteShift(obj)}>
                        Delete
                    </button>
                
              </>
            )

        }

    }, [tableData, rowsPerPage, currentPage])


    //add shift
    const handleAddShift = (e) => {
        e.preventDefault();
        let shift = document.getElementById("shiftList").value;
        if (!shift || shift === "") {
            alert("please select shift");
        } else {
            fetch(addShiftURL, {
                method: 'POST',
                body: JSON.stringify({ "shift": shift }),
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
                if (data.message) {
                    alert(data.message);
                } else {
                    loadData();
                }
            }
            ).catch((error) => {
                console.error(error);
            })
        }
    };

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

    const onPageChange = (currPage) => {
        setCurrentPage(currPage);
        return;
    }
    const onRowPerPageChange = (rowPerPage) => {
        // console.log("rowPerPage:"+rowPerPage);
        setRowsPerPage(rowPerPage);
    }

    const clockinfunc = (obj) => {
        obj.date = new Date().toDateString();
        fetch(checkInURL, {
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
              return response.json();
            }
          }
        ).then((data) => {
          console.log(data);
          if (data.message) {
            alert(data.message);
          }
        }).catch((error) => {
          console.error(error);
        });
      };
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

    return (
        <>
            <NavBar></NavBar>
  

            <main className="body">
                <div class="container">

            
                <form
                    id="registerShift-form"
                    className="form-inline aot-form"
                    action="/"
                    method="post"
                    onSubmit={handleAddShift}
                >
                    <div className="form-group">
                        <label htmlFor="shiftList" className="aoe-text">
                            Select a Shift Date:
                        </label>
                        <select className="form-select" name="shiftList" id="shiftList">
                        </select>
                    </div>
                    <div className="form-group">
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary aoe-btn-submit">Submit</button>
                        </div>
                    </div>
                </form>
                </div>
                <table className="table aot-table table-striped" id="reviewsTable">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Employee Name</th>
                            <th scope="col">Shifts</th>
                            <th scope="col">Reviews</th>
                            <th scope="col">Functions</th>
                        </tr>
                    </thead>
                    <tbody ref={table}></tbody>
                </table>
                <Pagination totalNumber={totalNumber} pageChange={onPageChange} rowPerPageChange={onRowPerPageChange} id="employeeMain" />
                <div className="modal fade" id="checkInModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog aot-modal">
                        <div className="modal-dialog modal-dialog-scrollable aot-modal">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="staticBackdropLabel">Clockin records</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                </div>
                                <div className="modal-body">
                                    <table className="table aot-table table-striped" id="modalTable">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Shifts</th>
                                                <th scope="col">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody ref={modalTable}></tbody>
                                    </table>
                                </div>
                                <Pagination totalNumber={modalTotalNumber} pageChange={onModalPageChange} rowPerPageChange={onModalRowPerPageChange} id="employeeModule" />
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

    
                </div>

                
            </main>

        </>


    );
}

EmployeePage.propTypes = {};

export default EmployeePage;