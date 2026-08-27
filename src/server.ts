import express from "express";

const PORT = 5001;
const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "welcome",
    success: true,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
