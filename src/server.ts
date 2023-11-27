import "dotenv/config";

import { App } from "./app";

const app = new App();

(async () => {
  await app.initServer();
})();
