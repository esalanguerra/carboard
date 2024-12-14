class Server {
  start() {
    console.log("ok");
  }
}

const server = new Server();

(async () => {
  server.start();
})();
