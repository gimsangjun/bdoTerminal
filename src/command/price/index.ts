import { ApiUtil } from "./../../util/api";
import { Command } from "..";
export class PriceCommand implements Command {
  private apiUtil;

  name = "price";
  description = "Get the price of an item";

  constructor(util: ApiUtil) {
    this.apiUtil = util;
  }

  execute = (args: string[]) => {
    this.apiUtil.getPrice("감자");
  };
}
