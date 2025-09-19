import { Router } from "express";
import f1Controller from "../../controllers/mods/f1.controller";

const f1 = Router();

f1.get("/", f1Controller.getData);

export default f1;
