import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TableHead,
  Grid,
  Button,
  Container,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import patients from "../services/patients";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import AddIcon from "@mui/icons-material/Add";

export default function AllPatients({ allPatients, setAllPatients }) {
  const [sortBy, setSortBy] = useState("firstName");
  const [page, setPage] = useState(1);
  const [patientsPerPage, setPatientsPerPage] = useState(5);
  const navigate = useNavigate();

  const sortedPatients = useMemo(() => {
    return [...allPatients].sort((a, b) => {
      if (sortBy === "firstName") {
        return a.firstName.localeCompare(b.firstName);
      } else if (sortBy === "lastName") {
        return a.lastName.localeCompare(b.lastName);
      } else if (sortBy === "pesel") {
        return a.pesel - b.pesel;
      } else if (sortBy === "zipCode") {
        return (
          parseInt(a.zipCode.replace("-", "")) -
          parseInt(b.zipCode.replace("-", ""))
        );
      }
    });
  }, [allPatients, sortBy]);

  const emptyRows =
    page > 0 ? Math.max(0, page * patientsPerPage - allPatients.length) : 0;

  const handleGoToAdd = async (id) => {
    navigate(`/${id}/edit`);
  };

  const handleDelete = async (id) => {
    try {
      await patients.deleteOne(id);
      setAllPatients((prevPatients) =>
        prevPatients.filter((patient) => patient._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ minWidth: "900px", width: { xs: "80%", lg: "70%" }, paddingTop: 4 }}
    >
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingY: 2,
          paddingLeft: 0,
        }}
        spacing={2}
      >
        <Grid item>
          <Button
            sx={{
              width: "56px",
              height: "60px",
              borderRadius: "10%",
              backgroundColor: "rgb(94, 132, 194,0.7)",
              "&:hover": {
                backgroundColor: "rgb(94, 132, 194,0.6)",
              },
            }}
            onClick={() => navigate("/new")}
          >
            <Tooltip title="Add new">
              <AddIcon fontSize="large" />
            </Tooltip>
          </Button>
        </Grid>
        <Grid item sx={{ display: "flex", flexDirection: "row" }}>
          <Grid item>
            <InputLabel id="view" sx={{ fontSize: 14 }}>
              view
            </InputLabel>
            <Select
              labelId="view"
              variant="standard"
              value={patientsPerPage}
              onChange={(e) => {
                setPatientsPerPage(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={12}>20</MenuItem>
            </Select>
          </Grid>
          <Grid item sx={{ marginX: 2 }}>
            <InputLabel id="sortBy" sx={{ fontSize: 14 }}>
              sort
            </InputLabel>
            <Select
              labelId="sortBy"
              variant="standard"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value={"firstName"}>first name</MenuItem>
              <MenuItem value={"lastName"}>last name</MenuItem>
              <MenuItem value={"pesel"}>pesel</MenuItem>
              <MenuItem value={"zipCode"}>zip code</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgb(94, 132, 194,0.7)" }}>
              <TableCell align="center">first name</TableCell>
              <TableCell align="center">last name</TableCell>
              <TableCell align="center">PESEL</TableCell>
              <TableCell align="center">street</TableCell>
              <TableCell align="center">city</TableCell>
              <TableCell align="center">zip code</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "rgb(94, 132, 194,0.5)" }}>
            {(patientsPerPage > 0
              ? sortedPatients.slice(
                  (page - 1) * patientsPerPage,
                  (page - 1) * patientsPerPage + patientsPerPage
                )
              : sortedPatients
            ).map((patient) => (
              <TableRow key={patient._id} hover>
                <TableCell align="center">{patient.firstName}</TableCell>
                <TableCell align="center">{patient.lastName}</TableCell>
                <TableCell align="center">{patient.pesel}</TableCell>
                <TableCell align="center">{patient.street}</TableCell>
                <TableCell align="center">{patient.city}</TableCell>
                <TableCell align="center">{patient.zipCode}</TableCell>
                <TableCell align="center">
                  <Button onClick={() => handleGoToAdd(patient._id)}>
                    EDIT
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleDelete(patient._id)}>
                    <Tooltip title="delete patient">
                      <DeleteIcon />
                    </Tooltip>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && allPatients.length > patientsPerPage && (
              <TableRow sx={{ height: 73 * emptyRows }}>
                <TableCell colSpan={8}></TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter sx={{ backgroundColor: "rgb(94, 132, 194,0.53)" }}>
            <TableRow>
              <TableCell colSpan={8}>
                <Pagination
                  sx={{ display: "flex", justifyContent: "center" }}
                  showFirstButton
                  showLastButton
                  shape="rounded"
                  count={Math.ceil(allPatients.length / patientsPerPage)}
                  page={page}
                  onChange={(e, p) => setPage(p)}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Container>
  );
}
