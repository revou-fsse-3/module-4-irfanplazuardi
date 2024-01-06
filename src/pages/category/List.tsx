import { Table, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Container, Typography, Button, TableFooter, TablePagination } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  is_active: boolean;
}

const List = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Category[]>([]);

  const handleEdit = (id: string) => () => {
    navigate(`/edit/${id}`);
  };

  const token = window.localStorage.getItem("token");

  const fetchList = async () => {
    const response = await axios.get("https://mock-api.arikmpt.com/api/category", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRows(response.data.data);
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = (id: string) => async () => {
    try {
      await axios.delete(`https://mock-api.arikmpt.com/api/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchList();
    } catch (error) {}
  };

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="content">
      <Container maxWidth="md">
        <div className="category-list">
          <Typography color="info.main" variant="h4" component="h4" align={"center"}>
            List Of Category
          </Typography>
          <Button size="small" variant="contained" color="primary" component={Link} to={"/add"} sx={{ width: "fit-content", marginLeft: 0, marginRight: "auto" }}>
            Add New Category
          </Button>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.is_active ? "Active" : "Deactive"}</TableCell>
                    <TableCell align="center">
                      <div className="action-group">
                        <Button size="small" variant="contained" onClick={handleEdit(row.id)}>
                          Edit
                        </Button>
                        <Button size="small" variant="outlined" color="error" onClick={handleDelete(row.id)}>
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                    colSpan={4}
                    count={rows.length}
                    rowsPerPage={10}
                    page={1}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={() => console.log("handle change")}
                    onRowsPerPageChange={() => console.log("handle row change")}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          <Button variant="contained" onClick={handleLogout}>
            logout
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default List;
