// //backend
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect(
//     "mongodb+srv://vaibhavwakshe:OsrOWl4DaymC07R3@cluster0.2h2zoqw.mongodb.net/",
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     }
// );

// const db = mongoose.connection;
// db.on("error", (error) => {
//     console.error("MongoDB connection error:", error);
// });
// db.once("open", () => {
//     console.log("Connected to MongoDB");
// });

// // Define Expense schema
// const expenseSchema = new mongoose.Schema({
//     description: { type: String, required: true },
//     amount: { type: Number, required: true },
// });

// const Expense = mongoose.model("Expense", expenseSchema);

// // Define income schema
// const incomeSchema = new mongoose.Schema({
//     description: { type: String, required: true },
//     amount: { type: Number, required: true },
// });

// const Income = mongoose.model("Income", incomeSchema);

// // API routes
// app.get("/expenses", async (req, res) => {
//     try {
//         const expenses = await Expense.find();
//         res.json(expenses);
//     } catch (error) {
//         console.error("Error fetching expenses:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// app.post("/expenses", async (req, res) => {
//     const { description, amount } = req.body;

//     try {
//         if (!description || !amount) {
//             return res
//                 .status(400)
//                 .json({ message: "Description and amount are required." });
//         }

//         const newExpense = new Expense({ description, amount });
//         await newExpense.save();
//         res.json(newExpense);
//     } catch (error) {
//         console.error("Error saving expense:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

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
