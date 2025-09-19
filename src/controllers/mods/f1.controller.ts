import { Request, Response } from "express";
import F1 from "../../repositories/mods/f1.repository";

class f1 {
  public async getData(req: Request, res: Response) {
    res.json(await F1.getData());
    return;
  }
}

export default new f1();
