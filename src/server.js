import app from "./index.js";
app.listen(process.env.SERVER_PORT || 3000, () => {
  console.log(`Listening on port ::3000`);
});
