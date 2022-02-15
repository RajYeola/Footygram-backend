const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRouter = require("./routes/user.route");
const postsRouter = require("./routes/post.route");

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  try {
    return res.json({ message: "Welcome to Footygram API" });
  } catch (error) {
    return res.json({
      message: "Unable to fetch API",
      errorMessage: error.message,
    });
  }
});
app.use("/user", userRouter);
app.use("/posts", postsRouter);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    })
  )
  .catch((error) => console.log(error.message));
