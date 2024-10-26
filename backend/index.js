const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(
    process.env.MONGODB_URI || "your_mongodb_connection_string",
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

const transactionSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    transType: { type: String, enum: ["income", "expense"], required: true },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

app.get("/transactions", async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/transactions", async (req, res) => {
    const { description, amount, transType } = req.body;

    if (!description || !amount || !transType) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newTransaction = new Transaction({ description, amount, transType });
        await newTransaction.save();
        res.json(newTransaction);
    } catch (error) {
        console.error("Error saving transaction:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
