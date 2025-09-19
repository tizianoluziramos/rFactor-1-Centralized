import express, { Application } from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import f1 from "./routes/mods/f1.route";

dotenv.config({
  path: `${__dirname}\\..\\.env`,
});

class Server {
  private App: Application;
  private PORT: number = Number(process.env.PORT);
  constructor() {
    this.App = express();
    this.requirements();
  }

  private requirements() {
    this.App.use(express.static(path.join(__dirname, "..", "public")));
    this.App.use("/api/mods/f1", f1);
    this.App.use(express.json());
    this.App.use(cors());
  }

  public start(): void {
    this.App.listen(this.PORT, () => {
      console.log("Servidor iniciado en el puerto: " + this.PORT);
    });
  }
}

const server = new Server();
server.start();
