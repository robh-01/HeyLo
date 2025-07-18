import express from "express";
const app = express();

app.get("", (req, res) => {
  const some = "some";
  console.log(some);
  console.log("got a request");
  res.send("Hello there");
});

app.listen(3000);
