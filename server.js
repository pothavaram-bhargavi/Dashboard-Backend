const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  try {
    const newUser = await prisma.subscription.create({
      data: {
        email,
      },
    });

    res.status(201).json({ success: true, message: "Subscribed" });
  } catch (error) {
    if (error.code === "P2002") {
      // Duplicate email error
      res.status(409).json({ success: false, message: "Email already exists" });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Error subscribing user" });
    }
  }
});

app.post("/createTransaction", async (req, res) => {
  const { name, amount, type } = req.body;
  try {
    const transaction = await prisma.transaction.create({
      data: {
        name,
        amount,
        type,
      },
    });
    console.log(transaction);
    res.status(201).json({ success: true, message: "Transaction Created" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating transaction" });
    console.error("Error creating user:", error);
  }
});

app.get("/transactionList", async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany();
    res.status(201).json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error listing transaction" });
    console.error("Error creating user:", error);
  }
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});