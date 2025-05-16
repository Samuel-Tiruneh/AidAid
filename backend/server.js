const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const requestDonateRoutes = require("./routes/requestDonate");
const partnerRoutes = require("./routes/partnerRoutes");
const guideRoutes = require("./routes/guideRoutes");
const userRoutes = require("./routes/userRoutes");
const cloudinaryRoutes = require("./cloudinary");


dotenv.config();
connectDB();

const app = express();
app.use(cors());


app.post(
  "/api/webhooks/chapa",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    req.rawBody = req.body.toString("utf8");
    next();
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/uploads", express.static("uploads"));
app.use("/api", requestDonateRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/users", userRoutes);
app.use("/api", cloudinaryRoutes);

// Import auth routes
const authRoutes = require("./routes/authRoutes");
const donationRoutes = require("./routes/donations");
const paymentRoutes = require("./routes/payment");
const webhookRoutes = require("./routes/webhooks");

app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/webhooks", webhookRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`💥 Server running on port ${PORT}`));
