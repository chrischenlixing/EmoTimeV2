import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './MyCalendar.css'; // Import your CSS file

import Calendar from 'react-calendar';

function MyCalendar(props) {
  const [date, setDate] = useState(new Date());

  return (
    <div className='app'>
      <h3 className='text-center'>Calendar</h3>
      <div className='calendar-container'>
        <Calendar onChange={setDate} value={date} />
      </div>
      <p className='text-center'>
        <span className='bold'></span> {date.toDateString()}
      </p>
    </div>
  );
}

Calendar.propTypes = {
  format: PropTypes.string
};

export default MyCalendar;