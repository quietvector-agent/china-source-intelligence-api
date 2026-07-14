import { createApp } from "./app.js";

const port = Number(process.env.PORT || 4021);
createApp().listen(port, () => {
  console.log(`QuietVector China Source Intelligence listening on ${port}`);
});
