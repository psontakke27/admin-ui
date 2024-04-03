import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { FiEdit } from "react-icons/fi";

const UserTable = ({
  columns,
  displayedUsers,
  setUsers,
  selectedRows,
  onRowSelection,
  onDelete,
  onEdit,
  searchText,
}) => {
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    setEditingRowId(null);
    setEditedData({});
  }, [searchText]);

  const handleRowSelection = (event, id) => {
    const checked = event.target.checked;
    if (checked) {
      onRowSelection([...selectedRows, id]);
    } else {
      onRowSelection(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleDelete = (id) => {
    if (editingRowId === id) {
      setEditingRowId(null);
      setEditedData({});
    }

    onDelete(id);
  };

  const handleStartEditing = (id) => {
    const userToEdit = displayedUsers.find((user) => user.id === id);
    setEditingRowId(id);
    setEditedData({ ...userToEdit });
  };

  const handleSaveChanges = (data) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === data.id ? editedData : user))
    );
    setEditingRowId(null);
    setEditedData({});
  };

  const handleCancelEditing = () => {
    setEditingRowId(null);
    setEditedData({});
  };

  const handleEditField = (field, newValue) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));
  };

  return (
    <TableContainer component={Paper} style={{ minWidth: 300 }}>
      <Table className="user-table">
        <TableHead>
          <TableRow>
            <TableCell className="user-table-cell name-cell" padding="checkbox">
              <Checkbox
                indeterminate={
                  selectedRows.length > 0 &&
                  selectedRows.length < displayedUsers.length
                }
                checked={selectedRows.length === displayedUsers.length}
                onChange={(event) =>
                  onRowSelection(
                    event.target.checked
                      ? displayedUsers.map((user) => user.id)
                      : []
                  )
                }
              />
            </TableCell>
            {columns.map((column) => (
              <TableCell
                className="user-table-cell name-cell"
                key={column.field}
                style={{
                  fontWeight: "bold",
                }}
              >
                {column.headerName}
              </TableCell>
            ))}
            <TableCell
              className="user-table-cell name-cell"
              style={{ fontWeight: "bold" }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedUsers.map((user) => (
            <TableRow
              key={user.id}
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                backgroundColor: selectedRows.includes(user.id)
                  ? "rgba(0, 0, 0, 0.1)"
                  : "transparent",
              }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedRows.includes(user.id)}
                  onChange={(event) => handleRowSelection(event, user.id)}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  className="user-table-cell name-cell"
                  key={column.field}
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                  }}
                >
                  {editingRowId === user.id && column.field !== "id" ? (
                    <TextField
                      value={editedData[column.field] || ""}
                      onChange={(e) =>
                        handleEditField(column.field, e.target.value)
                      }
                      fullWidth
                      autoFocus
                    />
                  ) : (
                    user[column.field]
                  )}
                </TableCell>
              ))}
              <TableCell
                className="user-table-cell name-cell"
                style={{ padding: "4px 8px", fontSize: "12px" }}
              >
                {editingRowId === user.id ? (
                  <>
                    <IconButton onClick={() => handleSaveChanges(user)}>
                      <DoneIcon />
                    </IconButton>
                    <IconButton onClick={handleCancelEditing}>
                      <CloseIcon />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton onClick={() => handleStartEditing(user.id)}>
                      <FiEdit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(user.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;