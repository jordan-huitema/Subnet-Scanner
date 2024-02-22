// Setup
const fastify = require('fastify')({ logger: true })
const path = require('path');
const fs = require('node:fs')

fastify.register(import("@fastify/view"), {
    engine: {
      pug: require("pug"),
    },
    root: path.join(__dirname, "src")
  });

// GETs
fastify.get("/", (req, reply) => {
    reply.view("index.pug", { text: "text" });
  });
  // I dont want to mess around with infinite frameworks i dont need, ill just do this
  fastify.get("/styles.css", (req, reply) => {
    reply.send(fs.ReadStream('./src/styles.css'), { text: "text/css" });
  });
  fastify.get("/favicon.ico", (req, reply) => {
    reply.send(fs.ReadStream('./src/assets/favicon.ico'), { text: "image/ico" });
  });

// Run the server!
fastify.listen({ port: 3000, host:"10.1.1.240" }, (err) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  })