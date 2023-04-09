"use strict";

import fs from "fs";
import path from "path";
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { logger } from "./monitoring";

(async () => {
  const app = fastify({
    logger,
    http2: true,
    https: {
      key: fs.readFileSync(
        path.join(__dirname, "..", "cert", "private_key.pem")
      ),
      cert: fs.readFileSync(
        path.join(__dirname, "..", "cert", "certificate.crt")
      ),
    },
  });

  app.register(fastifyCors);

  app.get("/status", async (request, response) =>
    response.status(200).send({})
  );

  app.listen({ port: 3000 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(`Server listning on port:: ${address}`);
  });

  process.on("uncaughtException", (e) => {
    logger.error(e, "uncaught exception");
    process.exit(1);
  });

  process.on("SIGTERM", async () => {
    try {
      await app.close();
      process.exit(0);
    } catch (e) {
      logger.error("shutdown error", { error: e });
      process.exit(1);
    }
  });
})();
