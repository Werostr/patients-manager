const express = require("express");
const patientsRouter = express.Router();
const Patient = require("../models/patient");

patientsRouter.get("/", async (req, res) => {
  try {
    const allPatients = await Patient.find({});
    return res.status(200).json(allPatients);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error loading patients." });
  }
});

patientsRouter.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    return res.status(200).json(patient);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error loading patient." });
  }
});

patientsRouter.post("/", async (req, res) => {
  try {
    const { firstName, lastName, pesel, street, city, zipCode } = req.body;
    const existingPesel = await Patient.findOne({ pesel });
    if (existingPesel) {
      return res.status(400).json("peselExists");
    }
    if (pesel.toString().length !== 11) {
      return res
        .status(400)
        .json({ error: "The PESEL number must be 11 digits long." });
    }
    if (!/^\d{2}-\d{3}$/.test(zipCode)) {
      return res
        .status(400)
        .json({ error: "The zip code must have format '00-000'." });
    }

    const newPatient = new Patient({
      firstName,
      lastName,
      pesel,
      street,
      city,
      zipCode,
    });
    const savedPatient = await newPatient.save();

    return res.status(201).json(savedPatient);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error creating new patient." });
  }
});

patientsRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, street, city, zipCode } = req.body;

    if (!/^\d{2}-\d{3}$/.test(zipCode)) {
      return res
        .status(400)
        .json({ error: "The zip code must have format '00-000'." });
    }

    const patient = await Patient.findByIdAndUpdate(id, {
      firstName,
      lastName,
      street,
      city,
      zipCode,
    });

    const savedPatient = await patient.save();
    return res.status(200).json(savedPatient);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error updating patient." });
  }
});

patientsRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deletedPatient = await Patient.findByIdAndDelete(id);

    return res.status(200).json(deletedPatient);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error removing patient." });
  }
});

module.exports = patientsRouter;
