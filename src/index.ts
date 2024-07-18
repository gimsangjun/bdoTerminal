import * as readlineSync from "readline-sync";
import { Command } from "./command";
import { PriceCommand } from "./command/price";
import { ApiUtil } from "./util/api";

class BdoTerminalApp {
  private commands: Command[];
  private apiUtil: ApiUtil;

  constructor() {
    this.apiUtil = new ApiUtil();
    this.commands = [new PriceCommand(this.apiUtil)];
  }

  async start() {
    let commandInput: string;
    let command: Command | undefined;

    while (true) {
      console.log();
      commandInput = readlineSync.question("Enter the command: ");
      command = this.commands.find(
        (cmd) => cmd.name.toLowerCase() === commandInput.toLowerCase(),
      );

      if (command) {
        await command.execute([]);
      } else {
        console.log(`Command "${commandInput}" not found. Please try again.`);
      }
    }
  }
}

const app = new BdoTerminalApp();
app.start();
