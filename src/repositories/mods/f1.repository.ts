import fs from "fs/promises";
import path from "path";
import { f1 } from "../../models/mods/f1.model";

class F1 {
  private dataPath: string = path.join(
    __dirname,
    "..",
    "..",
    "data",
    "mods",
    "f1.json"
  );
  private cache?: f1[];

  private async readData(): Promise<f1[]> {
    if (this.cache) return this.cache;
    const data = await fs.readFile(this.dataPath, "utf-8");
    const result: f1[] = JSON.parse(data);
    this.cache = result;
    return result;
  }

  public async getData(): Promise<f1[]> {
    const data = await this.readData();
    return data;
  }
}

export default new F1();
