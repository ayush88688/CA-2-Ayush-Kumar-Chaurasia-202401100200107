
const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Book");

const router = express.Router();

// POST: Add a new book
router.post("/", async (req, res) => {
    try {
        const { title, author, category } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        if (!author || !author.trim() ||
            !category || !category.trim()) {
            return res.status(400).json({
                message: "Author and category are required"
            });
        }

        const book = await Book.create({
            title,
            author,
            category
        });

        res.status(201).json({
            message: "Book added successfully",
            book
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add book",
            error: error.message
        });
    }
});

// GET: Retrieve books with pagination
router.get("/", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        if (!Number.isInteger(page) || page < 1 ||
            !Number.isInteger(limit) || limit < 1 ||
            limit > 100) {
            return res.status(400).json({
                message: "Invalid page or limit"
            });
        }

        const skip = (page - 1) * limit;

        const books = await Book.find()
            .skip(skip)
            .limit(limit);

        const totalRecords = await Book.countDocuments();

        res.status(200).json({
            currentPage: page,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            books
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve books",
            error: error.message
        });
    }
});

// PATCH: Update book availability
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { availability } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid book ID"
            });
        }

        if (typeof availability !== "boolean") {
            return res.status(400).json({
                message: "Availability must be true or false"
            });
        }

        const book = await Book.findByIdAndUpdate(
            id,
            { availability },
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book availability updated",
            book
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update book",
            error: error.message
        });
    }
});

module.exports = router;
