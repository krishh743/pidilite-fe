import React from "react";
import "./AddUserByAdmin.css";


const ConfirmDeleteDialog = ({ onClose, onDelete,Heading,ActionBtnText,cancelBtn }) => {
  return (
    <div className="confirmDeleteDialog">
      <div className="confirmDeleteDialogContent">
        <h2>{Heading}</h2>
        <div className="dialogButtons">
          <button className="deleteBtn" onClick={onDelete}>{ActionBtnText}</button>
          <button className="cancelBtn" onClick={onClose}>{cancelBtn}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteDialog;
