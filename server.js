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

fastify.get("/", (req, res) => { res.view("index.pug", { text: "text" }); });
// I dont want to mess around with infinite frameworks i dont need, ill just do this
fastify.get("/styles.css", (req, res) => { res.send(fs.ReadStream('./src/styles.css'), { text: "text/css" }); });
fastify.get("/favicon.ico", (req, res) => { res.send(fs.ReadStream('./src/assets/favicon.ico'), { text: "image/ico" }); });
fastify.get("/component/*", (req, res) => {
  const comp = req.url.split('/')[2]
  res.view(`includes/${comp}.pug`, { text: "text" });
})

// Needed to accept content-type:application/x-www-form-urlencoded; charset=UTF-8
fastify.register(require('@fastify/formbody'))

fastify.post("/component/*", (req, res) => {

})

fastify.delete("/del/url", (req, res) => {
  console.log('DELETE')
  return 200
})

// Run the server!
fastify.listen({ port: 3000, host: "10.1.1.240" }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})