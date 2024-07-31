import * as readlineSync from "readline-sync";
import {
  Command,
  PriceCommand,
  ListCommand,
  CreateCommand,
  ReadCommand,
  UpdateCommand,
  DeleteCommand,
  ShowCommand,
  DriveFilesCommand,
  UploadFileCommand,
  UpdateFileCommand,
} from "./command";

class BdoTerminalApp {
  private commands: Command[];

  constructor() {
    this.commands = [
      new PriceCommand(),
      new CreateCommand(),
      new ReadCommand(),
      new UpdateCommand(),
      new DeleteCommand(),
      new ShowCommand(),
      // Google Drive
      new DriveFilesCommand(),
      new UploadFileCommand(),
      new UpdateFileCommand(),
    ];
    const listCommand = new ListCommand(this.commands);
    this.commands.push(listCommand);
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
