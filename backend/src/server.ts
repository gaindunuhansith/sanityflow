import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";
import Logger from "./utils/logger.js";
import { initSentry } from "./config/sentry.js";

initSentry();

const startServer = async () => {

  app.listen(env.PORT, async() => {
    Logger.info(`Server is running on ${env.BACKEND_APP_ORIGIN}:${env.PORT}`);

    await connectDB();
  });
};

startServer();
