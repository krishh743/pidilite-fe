import React from "react";
import "./AddUserByAdmin.css";


const ConfirmDeleteDialog = ({ onClose, onDelete }) => {
  return (
    <div className="confirmDeleteDialog">
      <div className="confirmDeleteDialogContent">
        <h2>Are you sure you want to delete this user?</h2>
        <div className="dialogButtons">
          <button className="deleteBtn" onClick={onDelete}>Delete</button>
          <button className="cancelBtn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteDialog;
