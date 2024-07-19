import * as readlineSync from "readline-sync";
import { Command } from "./command";
import { PriceCommand } from "./command/Price";
import { PriceAlertCommand } from "./command/PriceAlert";

class BdoTerminalApp {
  private commands: Command[];

  constructor() {
    this.commands = [new PriceCommand(), new PriceAlertCommand()];
  }

  async start() {
    let commandInput: string;
    let command: Command | undefined;

    while (true) {
      console.log();
      commandInput = readlineSync.question("Enter the command: ");
      // command 찾기
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
