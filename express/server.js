
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bookRoutes = require("./Routes/bookRoutes");

const app = express();

app.use(express.json());

app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error.message);
    });
