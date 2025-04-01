/** @format */

import { databaseSetup } from "./setup";
import { backendSetup } from "./setup/backend.setup";
import { Logger, MESSAGES } from "./utils";

const setupServer = async () => {
  try {
    await databaseSetup();
    Logger.info(MESSAGES.CONNECTED_DATABASE);
  } catch (err) {
    Logger.error(err);
    Logger.info(MESSAGES.FAILED_TO_CONNECT_DATABASE);
  }

  try {
    await backendSetup();
    Logger.info(MESSAGES.SERVER_RUNNING);
  } catch (err) {
    Logger.error(err);
    Logger.info(MESSAGES.SERVER_RUNNING_FAILED);
  }
};

setupServer();
