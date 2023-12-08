import React, { useState } from 'react';
import './NavBar.css';
import Calendar  from './MyCalendar';
import { useUserRole } from '../hooks/UseUserRole';
import { Modal } from 'react-bootstrap';
import SearchBar from './SearchBar';
import ShiftBar from './ShiftBar';
import PropTypes from 'prop-types';

function NavBar({ handleSearchShift, handleAddShift, logOut }) {
  const { position, username } = useUserRole();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <nav aria-label="log out">
      <div className="aot-head">
        <div className="logo-container">
          <div className="logo-text">
            {position === 'manager' ? (
              <>
                EmoTime Manager
                <br />
                <span className="small-text">
                  HR ClockIn Platform
                </span>
              </>
            ) : (
              <>
                EmoTime Employee
                <br />
                <span className="small-text">
                  HR ClockIn Platform
                </span>
              </>
            )}
          </div>
               
        </div>
        <div className="logtext-container ">
          {username && <p className="logtext">Welcome, {username}!</p>}
        </div>
        <div className="buttons-container">
          {position === 'manager' && (
            <SearchBar handleSearchShift={handleSearchShift} />
          )}
          {position === 'employee' && (
            <ShiftBar handleAddShift={handleAddShift} />
          )}
          <button className="nav-button" onClick={openModal}>
            Calendar
          </button>
          <a className="nav-button" id="LogoutAction" onClick={logOut} href='/'>
            Logout
          </a>
        </div>

      </div>

      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Calendar></Calendar>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={closeModal}>Close</button>
        </Modal.Footer>
      </Modal>
    </nav>
  );
}

NavBar.propTypes = {
  handleSearchShift: PropTypes.func.isRequired, 
  handleAddShift: PropTypes.func.isRequired, 
  logOut: PropTypes.func.isRequired, 
};

export default NavBar;
