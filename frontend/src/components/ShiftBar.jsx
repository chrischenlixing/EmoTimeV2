import React, { useState } from 'react';

const ShiftBar = ({ handleAddShift }) => {
  const [selectedShift, setSelectedShift] = useState('');


  return (

      <form
        id="shiftBar-form"
        className="form-inline aot-form"
        action="/"
        method="post"
        onSubmit={handleAddShift}
      >
        <div className="form-group">
          <label htmlFor="shiftList" className="aoe-text">
            Select a Shift Date:
          </label>
          <select
            className="form-select"
            name="shiftList"
            id="shiftList"
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
          >
          </select>
        </div>
        <div className="form-group">
          <div className="form-group">
            <button type="submit" className="btn btn-primary aoe-btn-submit">
              Submit
            </button>
          </div>
        </div>
      </form>

  );
  };

  export default ShiftBar;