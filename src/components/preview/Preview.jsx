import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

function Preview({ result }) {
  return (
    <div className="preview">
      <h2>Output:</h2>
      <div>{result}</div>
    </div>
  );
}
Preview.propTypes = {
  result: PropTypes.object.isRequired,
};
export default Preview;
