const pool = require("../dbConnection");

const adoptPet = async (req, res) => {
  try {
    const { pet_id, user_id } = req.body;
    const query = `INSERT INTO adoptions (pet_id,user_id,status) values (?,?,'APPLIED')`;
    const [result] = await pool.query(query, [pet_id, user_id]);
    console.log("result", result);
    res.status(201).json({
      success: true,
      message: "Applied for adoption",
      adoption_id: result.id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

const approveAdoption = async (req, res) => {
  try {
    const { application_id ,status } = req.body;
    const query =
      "UPDATE adoptions SET status=?  where adoption_id=? ";
    const [result] = await pool.query(query, [status,application_id]);

    res.status(200).json({
      success: true,
      message: "Approved Adoption",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAllAdoptions = async (req, res) => {
  try {
    const { role, user_id } = req.body;
    let query = `SELECT adoption_id ,p.name as petname, species,gender,breed,u.name as requestedBy,email , status  FROM adoptions a INNER JOIN users u on u.user_id=a.user_id INNER JOIN pets p ON p.pet_id=a.pet_id 
  where p.is_active=1`;
    if (role !== "ADMIN") query += ` AND a.user_id=?`;
    console.log("query", query);
    const [rows] = await pool.query(query, [user_id]);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { adoptPet, approveAdoption, getAllAdoptions };
