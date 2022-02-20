const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const cors = require("cors");

dotenv.config();

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log("database connected!"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

// ======================= router ====================================
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cartorder", cartRoute);
app.use("/api/orders", orderRoute);

app.get("/", (req, res) => {
  console.log("succeed");
});

app.listen(process.env.PORT || 5000, () => console.log("server is running!"));
