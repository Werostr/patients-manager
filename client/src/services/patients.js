import axios from "axios";

const getAll = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/patients");
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

const getOne = async (id) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/patients/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

const addNew = async (data) => {
  try {
    const res = await axios.post("http://localhost:3000/api/patients", data);
    return res.data;
  } catch (err) {
    console.log(err.response.data);
    if (err.response.data === "peselExists") {
      return err.response.data;
    }
  }
};

const updateOne = async (data, id) => {
  try {
    const res = await axios.put(
      `http://localhost:3000/api/patients/${id}`,
      data
    );
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

const deleteOne = async (id) => {
  try {
    const res = await axios.delete(`http://localhost:3000/api/patients/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export default {
  getAll,
  getOne,
  addNew,
  updateOne,
  deleteOne,
};
