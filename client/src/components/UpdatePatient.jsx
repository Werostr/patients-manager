import { useState } from "react";
import { useNavigate } from "react-router-dom";
import patients from "../services/patients";
import {
  Grid,
  TextField,
  Card,
  Button,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";

export default function UpdatePatient({ setAllPatients }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pesel, setPesel] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [zipError, setZipError] = useState(false);
  const navigate = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    patients
      .getOne(id)
      .then((foundPatient) => {
        setFirstName(foundPatient.firstName);
        setLastName(foundPatient.lastName);
        setPesel(foundPatient.pesel);
        setStreet(foundPatient.street);
        setCity(foundPatient.city);
        setZipCode(foundPatient.zipCode);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleEdit = async (event) => {
    event.preventDefault();
    setZipError(false);

    if (zipCode.length < 6) {
      return setZipError(true);
    }
    try {
      const updatedPatient = await patients.updateOne(
        {
          firstName,
          lastName,
          street,
          city,
          zipCode,
        },
        id
      );

      setAllPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient._id === id ? { ...patient, ...updatedPatient } : patient
        )
      );
      setFirstName("");
      setLastName("");
      setStreet("");
      setCity("");
      setZipCode("");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{ display: "flex", justifyContent: "center", paddingTop: 5 }}
      >
        <Box
          sx={{
            width: "50%",
          }}
        >
          <Card
            sx={{
              backgroundColor: "rgb(94, 132, 194,0.2)",
              paddingBottom: 6,
              paddingX: 5,
            }}
          >
            <Grid component="form" container onSubmit={handleEdit} spacing={2}>
              <Grid
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginTop: 4,
                }}
                item
              >
                <Button variant="outlined" onClick={handleBack}>
                  Back
                </Button>
              </Grid>
              <Grid
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
                item
              >
                <EditIcon
                  sx={{
                    fontSize: "70px",
                  }}
                ></EditIcon>
                <Typography>Edit patient</Typography>
              </Grid>
              <Grid
                xs={12}
                item
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <TextField
                  id="firstName"
                  label="first name"
                  name="firstName"
                  value={firstName}
                  onChange={({ target }) => setFirstName(target.value)}
                  required
                />
              </Grid>
              <Grid
                xs={12}
                item
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <TextField
                  id="lastName"
                  type="lastName"
                  label="last name"
                  name="lastName"
                  value={lastName}
                  onChange={({ target }) => setLastName(target.value)}
                  required
                />
              </Grid>
              <Grid
                xs={12}
                item
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <TextField
                  id="pesel"
                  label="PESEL"
                  name="pesel"
                  value={pesel}
                  disabled
                />
              </Grid>
              <Grid
                xs={12}
                item
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <TextField
                  type="street"
                  id="street"
                  label="street"
                  name="street"
                  value={street}
                  onChange={({ target }) => setStreet(target.value)}
                  required
                />
              </Grid>
              <Grid
                xs={12}
                item
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <TextField
                  type="city"
                  id="city"
                  label="city"
                  name="city"
                  value={city}
                  onChange={({ target }) => setCity(target.value)}
                  required
                />
              </Grid>
              <Grid
                xs={12}
                item
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <TextField
                  type="zipCode"
                  id="zipCode"
                  label="zip code"
                  name="zipCode"
                  value={zipCode}
                  onChange={({ target }) => {
                    let value = target.value.replace(/\D/g, "");
                    value = value.slice(0, 5);
                    if (value.length > 2) {
                      value = value.replace(/^(\d{2})(\d{0,3})$/, "$1-$2");
                    }
                    setZipCode(value);
                  }}
                  error={zipError}
                  helperText={zipError ? "Zip code too short" : ""}
                  required
                />
              </Grid>
              <Grid
                xs={12}
                item
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button type="submit" variant="outlined">
                  Edit
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Box>
      </Container>
    </>
  );
}
