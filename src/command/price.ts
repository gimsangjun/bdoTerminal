import { ApiUtil } from "../util/api";
import { Command } from ".";
import axios from "axios";
import * as readlineSync from "readline-sync"; // 이것도, 객체화 시켜야할지도?

export class PriceCommand implements Command {
  private apiUtil;

  name = "price";
  description = "Get the price of an item";

  constructor(util: ApiUtil) {
    this.apiUtil = util;
  }

  execute = async (args: string[]) => {
    let itemName: string;
    while (true) {
      try {
        itemName = readlineSync.question("Enter the item name: ");
        await this.apiUtil.getPrice(itemName);
        break;
      } catch (error) {
        console.error("Error:", error.message);
        console.log("Please enter a valid item name.");
      }
    }
  };
}
