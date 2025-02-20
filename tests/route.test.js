import request from "supertest";
import app from "../src/index.js";
describe("GET /", () => {
  it("should return 200 OK", (done) => {
    request(app).get("/").expect(200, done);
  });
});

describe("GET /example", () => {
  it("should return 200 OK", (done) => {
    request(app).get("/example").expect(200, done);
  });
  it("should return image/png", (done) => {
    request(app).get("/example").expect("Content-Type", "image/png", done);
  });
});

describe("Pretty much fail a captcha", () => {
  it("Should be able to get the captcha", async () => {
    const r = await request(app).get("/captcha");
    expect(r.body.id).toBeDefined();
  });
  it("Should be able to render the captcha", async () => {
    const r = await request(app).get("/captcha/0/render");
    expect(r.status).toBe(200);
    expect(r.headers["content-type"]).toBe("image/png");
    expect(r.body).toBeDefined();
  });
  it("Should fail solving for captcha 0", () => {
    return request(app)
      .post("/captcha/0/solve")
      .send({ text: "wrong" })
      .expect(400);
  });
});
