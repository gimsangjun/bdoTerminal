import { Command } from ".";
import * as readlineSync from "readline-sync"; // 이것도, 객체화 시켜야할지도?
import { getPrice } from "../utils/api";

export class PriceCommand implements Command {
  name = "price";
  description = "Get the price of an item";

  constructor() {}

  execute = async (args: string[]): Promise<void> => {
    let itemName: string;
    while (true) {
      try {
        itemName = readlineSync.question("Enter the item name: ");
        const price = await getPrice(itemName);
        console.log(`"${itemName}"의 가격은 ${price}입니다.`);
        break;
      } catch (error) {
        console.error("Error:", error.message);
        console.log("Please enter a valid item name.");
      }
    }
  };
}
