import express from "express";

export class Server {
  public readonly app: express.Application;

  constructor() {
    this.app = express();
  }

  public async start() {
    this.app.listen(process.env.APP_PORT || 3333, async () => {
      console.log(
        `Main server has ben started on port *${process.env.APP_PORT}`
      );
    });
  }
}
