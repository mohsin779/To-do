import React, { useRef } from "react";

const CheckBox = ({ text, checked, onChangeStatus, id }) => {
  const checkboxRef = useRef(null);

  const selectCheckBox = () => {
    checkboxRef.current.click();
  };

  return (
    <div className="mad-container">
      <div className="round">
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={checked}
          onChange={onChangeStatus}
          id={id}
        />
        <label htmlFor={id}></label>
      </div>
      <p onClick={selectCheckBox} className="mad">
        {text}
      </p>
    </div>
  );
};

export default CheckBox;