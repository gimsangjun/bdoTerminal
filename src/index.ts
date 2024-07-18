import * as readlineSync from "readline-sync";
import { Command } from "./command";
import { PriceCommand } from "./command/price";
import { ApiUtil } from "./util/api";

// const name = readlineSync.question("What is your name? ");
// console.log(`Hello, ${name}!`);

class BdoTerminalApp {
  private commands: Command[];
  private apiUtil;

  constructor() {
    this.apiUtil = new ApiUtil();
    this.commands = [new PriceCommand(this.apiUtil)];
  }

  start() {
    this.commands[0].execute([]);
  }
}

const app = new BdoTerminalApp();
app.start();

// // 사용자로부터 아이템 이름 입력받기
// const itemName = readlineSync.question("Enter the item name: ");

// // 아이템 이름으로 ID 찾기
// const item = itemData.find(
//   (item: { name: string }) =>
//     item.name.toLowerCase() === itemName.toLowerCase(),
// );

// if (item) {
//   console.log(`The ID of the item "${itemName}" is ${item.id}`);
// } else {
//   console.log(`Item "${itemName}" not found.`);
// }
