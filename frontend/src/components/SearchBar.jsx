import React from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({ handleSearchShift }) => {

    
    return (
        <form
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
    );
};

SearchBar.propTypes = {
    handleSearchShift: PropTypes.func.isRequired, // Expecting handleSearchShift to be a function
  };

export default SearchBar;