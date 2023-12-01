import "dotenv/config";

import { App } from "./app";

const app = new App();

void (async () => {
  await app.initServer();
})();
