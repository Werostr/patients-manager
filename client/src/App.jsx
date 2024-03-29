import "./App.css";
import { Route, Routes } from "react-router-dom";
import AllPatients from "./components/AllPatients";
import UpdatePatient from "./components/UpdatePatient";
import NewPatient from "./components/NewPatient";
import { useEffect, useState } from "react";
import patients from "./services/patients";

function App() {
  const [allPatients, setAllPatients] = useState([]);

  useEffect(() => {
    patients
      .getAll()
      .then((foundPatients) => setAllPatients(foundPatients))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AllPatients
              allPatients={allPatients}
              setAllPatients={setAllPatients}
            />
          }
        />
        <Route
          path="/new"
          element={<NewPatient setAllPatients={setAllPatients} />}
        />
        <Route
          path="/:id/edit"
          element={<UpdatePatient setAllPatients={setAllPatients} />}
        />
      </Routes>
    </>
  );
}

export default App;
