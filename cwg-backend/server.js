const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");
const yup = require("yup");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const port = process.env.PORT || 8000;
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(bodyParser.json());

const schema = yup.object().shape({
  companyName: yup
    .string()
    .min(3, "Company Name must be at least 3 characters")
    .max(30, "Company Name must be at most 30 characters"),
  phone: yup.string().matches(/^\d{10}$/, "Phone must be a 10-digit number"),
  phoneType: yup
    .string()
    .oneOf(["mobile", "landline", "others"], "Invalid Phone Type")
    .required("Phone Type is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  streetAddress: yup
    .string()
    .min(10, "Street Address must be at least 10 characters")
    .max(200, "Street Address must be at most 200 characters"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zipCode: yup.string().matches(/^\d{6}$/, "Zip Code must be a 6-digit number"),
});

//------------------------- Register new user -------------------------
app.post("/api/register", async (req, res) => {
  try {
    await schema.validate(req.body, { abortEarly: false });

    const {
      companyName,
      phone,
      phoneType,
      email,
      streetAddress,
      address2,
      city,
      state,
      zipCode,
    } = req.body;

    const emailExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (emailExists.rows.length > 0) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const result = await pool.query(
      "INSERT INTO users (companyName, phone, phoneType, email, streetAddress, address2, city, state, zipCode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        companyName,
        phone,
        phoneType,
        email,
        streetAddress,
        address2,
        city,
        state,
        zipCode,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = error.errors;
      return res.status(400).json({ errors: validationErrors });
    } else {
      console.error("Error processing registration:", error);
      return res.status(500).send("Internal Server Error");
    }
  }
});

//------------------------- Login user -------------------------

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Password is required"),
});

app.post("/api/login", async (req, res) => {
  try {
    await loginSchema.validate(req.body, { abortEarly: false });

    const { email, phone } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND phone = $2",
      [email, phone]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", user: user.rows[0] });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = error.errors;
      return res.status(400).json({ errors: validationErrors });
    } else {
      console.error("Error processing login:", error);
      return res.status(500).send("Internal Server Error");
    }
  }
});

app.post("/api/addCard", async (req, res) => {
  try {
    const userId = req.user.id; // Change this based on your authentication setup

    await cardSchema.validate(req.body, { abortEarly: false });

    const {
      Occasion,
      Recipient,
      Orientation,
      Publisher_Sku,
      CardwithGift_Sku,
      Created_Date,
      Modified_Date,
      Activation_Date,
      Deactivation_Date,
      Front,
      Inside_Left,
      Inside_Right,
      Back,
      Uploaded_By,
      Status,
    } = req.body;

    const result = await pool.query(
      "INSERT INTO cards (user_id, Occasion, Recipient, Orientation, Publisher_Sku, CardwithGift_Sku, Created_Date, Modified_Date, Activation_Date, Deactivation_Date, Front, Inside_Left, Inside_Right, Back, Uploaded_By, Status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *",
      [
        userId,
        Occasion,
        Recipient,
        Orientation,
        Publisher_Sku,
        CardwithGift_Sku,
        Created_Date,
        Modified_Date,
        Activation_Date,
        Deactivation_Date,
        Front,
        Inside_Left,
        Inside_Right,
        Back,
        Uploaded_By,
        Status,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding card:", error);
    if (error.name === "ValidationError") {
      const validationErrors = error.errors;
      return res.status(400).json({ errors: validationErrors });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
