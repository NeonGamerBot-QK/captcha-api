import {} from "express-tests";
beforeAll(() => {
  app = require("../src/index");
});
describe("GET /", () => {
  it("should return 200 OK", (done) => {
    request(app).get("/").expect(200, done);
  });
});
