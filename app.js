require("dotenv").config();
const express = require("express");
const { pool } = require("./models/dbConnection");
const cors = require("cors");

const {
  getPets,
  findPetById,
  deletePet,
  updatePetDetails,
  addPet,
} = require("./controllers/pets");
const {
  adoptPet,
  approveAdoption,
  getAllAdoptions,
} = require("./controllers/adoption");
const { registerUser, login } = require("./controllers/user");
const verifyToken = require("./middlewares/verifyToken");
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.get("/health", (req, res) => {
  res.json({ status: 200, message: "Success" });
});

app.get("/allpets", getPets);
app.post("/register", registerUser);
app.post("/login", login);

app.use(verifyToken);
app.get("/pet/:id", findPetById);
app.post("/addpet", addPet);
app.patch("/removepet/:pet_id", deletePet);
app.patch("/updatepet/:pet_id", updatePetDetails);
app.post("/adoptpet", adoptPet);
app.put("/approveAdopt", approveAdoption);
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
