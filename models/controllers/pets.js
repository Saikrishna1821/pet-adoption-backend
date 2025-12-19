const pool = require("../dbConnection");
const { adoptPet } = require("./adoption");
const getPets = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT *
FROM pets p
WHERE p.is_active = 1
AND NOT EXISTS (
  SELECT 1
  FROM adoptions a
  WHERE a.pet_id = p.pet_id
  AND a.status = 'APPROVED'
)
`);
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};
const findPetById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("Select * from pets where pet_id=?", [id]);

    res.status(200).json({ success: true, pets: rows });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

const deletePet = async (req, res) => {
  console.log("INSODE DELTE");
  try {
    const { pet_id } = req.params;
    const query = `
      UPDATE pets
      SET is_active = FALSE
      WHERE pet_id = ?
    `;

    const result = await pool.query(query, [pet_id]);
    console.log(result);
    res.status(200).json({
      success: true,
      message: "Deleted Pet",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

const updatePetDetails = async (req, res) => {
  try {
    const { pet_id } = req.params;
    const { name = null, age = null } = req.body;

    const query = `
      UPDATE pets
      SET
        name = COALESCE(?, name),
        age  = COALESCE(?, age)
      WHERE pet_id = ?
    `;
    console.log("details", pet_id, age, name);
    const [result] = await pool.query(query, [name, age, pet_id]);
    console.log("query", result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Pet not found" });
    }

    res.json({ success: true, message: "Pet updated" });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const addPet = async (req, res) => {
  try {
    const { name, age, gender, species, breed } = req.body;

    const query = `
      INSERT INTO pets (name, age, gender, species, breed)
      VALUES (?, ?, ?, ?, ?)
    `;

    await pool.query(query, [name, age, gender, species, breed]);

    res.status(201).json({
      success: true,
      message: "Added new pet",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getPets, findPetById, deletePet, updatePetDetails, addPet };
