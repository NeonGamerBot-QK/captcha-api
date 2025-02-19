"use strict";
import "dotenv/config";
import express from "express";
import { genCanvas } from "./gen_canvas_img.js";
import { readFileSync } from "fs";
import { genHardCaptcha } from "./utils.js";
import { join } from "path";
const app = express();
let cached = new Map();
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    message: `OK`,
    status: 200,
  });
});

if (process.env.NODE_ENV !== "production") {
  app.get("/example", async (req, res) => {
    res.set({ "Content-Type": "image/png" });
    const img = await genCanvas("example");
    res.end(img);
  });

  app.get("/example-math", async (req, res) => {
    res.set({ "Content-Type": "image/png" });
    const img = await genCanvas("1 + 1");
    res.end(img);
  });

  app.get("/example-gen-text", (req, res) => {
    res.json({ text: genHardCaptcha() });
  });
}
app.get("/captcha/:id/render", async (req, res) => {
  const text = cached.get(Number(req.params.id));
  res.set({ "Content-Type": "image/png" });
  if (!text) return res.end(readFileSync("404.png"));
  const code = text.text;
  const img = await genCanvas(code);
  res.end(img);
});

app.post("/captcha/:id/solve", (req, res) => {
  const d = cached.get(Number(req.params.id));
  if (!d) return res.json({ message: `Invalid ID`, status: 400 });
  console.log(`solve`, req.body, d.text);
  if (req.body.text === d.text) {
    res.json({ message: `Correct`, status: 200 });
    cached.delete(Number(req.params.id));
  } else {
    res.status(400).json({ message: `Incorrect`, status: 400 });
  }
});

app.get("/captcha", async (req, res) => {
  const id = cached.size;
  cached.set(id, {
    created_at: Date.now(),
    text: genHardCaptcha(),
  });
  res.json({
    id,
  });
});
app.get("/heartbeat", (req, res) => {
  res.json({ message: "OK" });
});
app.get("/demo", (req, res) => {
  // TODO: render html file here.
  res.sendFile(join(import.meta.dirname, "views", "demo.html"));
});
app.listen(3000, () => {
  console.log(`Listening on port ::3000`);
});
