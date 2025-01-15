"use strict";
import "dotenv/config";
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: `OK`,
    status: 200,
  });
});

app.listen(3000, () => {
  console.log(`Listening on port ::3000`);
});
