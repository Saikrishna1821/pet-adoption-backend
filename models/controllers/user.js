const bcrypt = require("bcrypt");
const pool = require("../dbConnection");
const jwt = require("jsonwebtoken");
const registerUser = async (req, res) => {
  try {
    const { name, password, email, role = "user" } = req.body;
    const hashPassword = await bcrypt.hash(password, 2);
    const query =
      "INSERT INTO users (name,password_hash,email,role) values (?,?,?,?)";
    const [result] = await pool.query(query, [name, hashPassword, email, role]);
    res.status(201).json({
      success: true,
      message: "Account Created Successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const query = "Select * from users where email=?";
    const [result] = await pool.query(query, [email]);
    console.log("Result", result);
    const isMatch = await bcrypt.compare(password, result[0]?.password_hash);
    if (!isMatch) {
      res.status(401).json({
        success: true,
        message: "Invalid email or password",
      });
      return;
    }
    const user = {
      user_id: result[0].user_id,
      name: result[0].name,
      role: result[0].role,
    };
    const token = await jwt.sign(user, "Saikrishna@1");
    console.log(token);

    res.status(200).json({
      success: true,
      message: "LoggedIn Successfully",
      token:token
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { registerUser, login };
