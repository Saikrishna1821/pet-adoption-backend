const express = require("express");
require("dotenv").config();
const { pool } = require("./models/dbConnection");
const cors = require("cors");

const {
  getPets,
  findPetById,
  deletePet,
  updatePetDetails,
  addPet,
} = require("./models/controllers/pets");
const {
  adoptPet,
  approveAdoption,
  getAllAdoptions,
} = require("./models/controllers/adoption");
const { registerUser, login } = require("./models/controllers/user");
const app = express();
app.use(cors());
app.use(express.json());
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);


const PORT = 4000 || 8000;

app.get("/health", (req, res) => {
  res.json({ status: 200, message: "Success" });
});
app.get("/allpets", getPets);
app.get("/pet/:id", findPetById);
app.post("/addpet", addPet);
app.patch("/removepet/:pet_id", deletePet);
app.patch("/updatepet/:pet_id", updatePetDetails);
app.post("/adoptpet", adoptPet);
app.put("/approveAdopt", approveAdoption);
app.post("/register", registerUser);
app.post("/login", login);
app.post("/getApplications", getAllAdoptions);
pool.getConnection((err, con) => {
  if (err) {
    console.log("Database is not connected", err);
  }
  con.release();
  app.listen(PORT, () => {
    console.log("Server running on PORT:", PORT);
  });
});
