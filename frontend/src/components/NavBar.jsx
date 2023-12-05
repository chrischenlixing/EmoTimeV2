import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Calendar from './MyCalendar';
import './NavBar.css';
import { useUserRole } from '../hooks/UseUserRole';
import { Modal } from 'react-bootstrap';

function NavBar({ handleLogout }) {
  const position = useUserRole();
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
          <div className="logo-text">{position === 'manager' ? 'EmoTime Manager' : 'EmoTime Employee'}</div>
        </div>
        <div className="buttons-container">
          <button className="nav-button" onClick={openModal}>
            Open Calendar
          </button>
          <a className="nav-button" id="LogoutAction" onClick={handleLogout} href="/">
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
    handleLogout: PropTypes.func.isRequired,
  };

export default NavBar;