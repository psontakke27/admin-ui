import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Fab,
  Alert,
  Snackbar,
  // useMediaQuery,
} from "@mui/material";
import UserTable from "./UserTable";
import AppBar from "./AppBar";

const AdminInterface = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const usersPerPage = 10;

  useEffect(() => {
    document.title = "AdminUI";
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRowSelection = (selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const handleDelete = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    const reindexedUsers = updatedUsers.map((user, index) => {
      const newId = (index + 1).toString();
      return { ...user, id: newId };
    });
    setUsers(reindexedUsers);
  };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(
      (user) => !selectedRows.includes(user.id)
    );
    setUsers(updatedUsers);
    setSelectedRows([]);
  };

  const handleEdit = (id, field, newValue) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, [field]: newValue } : user
    );
    setUsers(updatedUsers);
  };

  const filteredUsers = users.filter((user) => {
    const searchTerm = searchText.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
    );
  });

  const columns = [
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
    { field: "role", headerName: "Role" },
  ];

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const displayedUsers = filteredUsers.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (page) => {
    if (page < 1) {
      setCurrentPage(1);
    } else if (page > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <AppBar />
      <div
        style={{
          maxWidth: "100%",
          marginTop: "1rem",
          padding: "0 8px",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          label="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div>
        <UserTable
          columns={columns}
          setUsers={setUsers}
          displayedUsers={displayedUsers}
          selectedRows={selectedRows}
          onRowSelection={handleRowSelection}
          onDelete={handleDelete}
          onEdit={handleEdit}
          searchText={searchText}
        />
      </div>

      <Box
        position="fixed"
        bottom={0}
        left={0}
        width="100%"
        bgcolor="white"
        padding="1rem"
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <Button
          variant="contained"
          onClick={handleDeleteSelected}
          color="error"
          disabled={selectedRows.length === 0}
          style={{ flexShrink: 1, marginBottom: "0.5rem" }}
        >
          Delete Selected
        </Button>
        <div style={{ display: "flex", gap: "0.5rem", margin: "0 auto" }}>
          <Fab
            color="primary"
            size="small"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            {"<<"}
          </Fab>
          <Fab
            color="primary"
            size="small"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {"<"}
          </Fab>
          {[...Array(totalPages)].map((_, index) => (
            <Fab
              key={index + 1}
              color={currentPage === index + 1 ? "inherit" : "primary"}
              size="small"
              onClick={() => handlePageChange(index + 1)}
              style={{ marginLeft: "0.5rem" }}
            >
              {index + 1}
            </Fab>
          ))}
          <Fab
            color="primary"
            size="small"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {">"}
          </Fab>
          <Fab
            color="primary"
            size="small"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {">>"}
          </Fab>
        </div>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminInterface;