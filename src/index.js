"use strict";
import "dotenv/config";
import express from "express";
import { genCanvas } from "./gen_canvas_img.js";
import { readFileSync } from "fs";
import { genHardCaptcha } from "./utils.js";
import { join } from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
let cached = new Map();
app.use(express.json());

const swaggerOptions = {
  definition: {
    // openapi: "3.0.0", // OpenAPI version
    info: {
      title: "Captcha api docs", // API title
      version: "1.0.0", // API version
      description: "Congrats in swagger docs",
    },
  },
  // Path to the API docs
  apis: [__dirname + "/index.js"], // specify the file(s) containing the JSDoc annotations
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *   get:
 *     description: Returns a OK status message
 *     responses:
 *       200:
 *         description: A-OK
 */
app.get("/", (req, res) => {
  res.json({
    message: `OK`,
    status: 200,
  });
});

if (process.env.NODE_ENV !== "production") {
  /**
   * @swagger
   * /example:
   *   get:
   *     description: Returns an example captcha image
   *     responses:
   *       200:
   *         description: an image
   */
  app.get("/example", async (req, res) => {
    res.set({ "Content-Type": "image/png" });
    const img = await genCanvas("example");
    res.end(img);
  });

  /**
   * @swagger
   * /example-math:
   *   get:
   *     description: Example captcha image of "1 + 1"
   *     responses:
   *       200:
   *         description: an image
   */
  app.get("/example-math", async (req, res) => {
    res.set({ "Content-Type": "image/png" });
    const img = await genCanvas("1 + 1");
    res.end(img);
  });

  /**
   * @swagger
   * /example-gen-text:
   *   get:
   *     description: Returns a Json response with random text
   *     responses:
   *       200:
   *         description: JSON text response
   */
  app.get("/example-gen-text", (req, res) => {
    res.json({ text: genHardCaptcha() });
  });
}

/**
 * @swagger
 * /captcha/{id}/render:
 *   get:
 *     description: Renders a captcha
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The captcha ID
 *     responses:
 *       200:
 *         description: The captcha image
 *       404:
 *         description: The captcha was not found and returns 404.png
 */
app.get("/captcha/:id/render", async (req, res) => {
  const text = cached.get(Number(req.params.id));
  res.set({ "Content-Type": "image/png" });
  if (!text) return res.end(readFileSync("404.png"));
  const code = text.text;
  const img = await genCanvas(code);
  res.end(img);
});

/**
 * @swagger
 * /captcha/{id}/solve:
 *   post:
 *     description: Solves a captcha
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The captcha ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "0"
 *     responses:
 *       200:
 *         description: Correct
 *       400:
 *         description: Incorrect
 *       404:
 *         description: The captcha was not found
 */
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

/**
 * @swagger
 * /captcha:
 *   get:
 *     description: Generates a captcha
 *     responses:
 *       200:
 *         description: The captcha ID
 *       404:
 *         description: The captcha was not found
 */
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

/**
 * @swagger
 * /heartbeat:
 *   get:
 *     description: Heartbeat
 *     responses:
 *       200:
 *         description: OK
 */
app.get("/heartbeat", (req, res) => {
  res.json({ message: "OK" });
});

/**
 * @swagger
 * /demo:
 *   get:
 *     description: Demo page
 *     responses:
 *       200:
 *         description: OK
 */
app.get("/demo", (req, res) => {
  res.sendFile(join(__dirname, "views", "demo.html"));
});

export default app;
