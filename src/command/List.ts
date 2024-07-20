import { Command } from ".";

// 현재 명령어 목록 가져오기
export class ListCommand implements Command {
  name = "list";
  description = "Get the list of commands";
  private commands: Command[];

  constructor(commands: Command[]) {
    this.commands = commands;
  }

  execute = async (args: string[]): Promise<void> => {
    console.log("Available commands:");
    this.commands.forEach((command) => {
      console.log(`- ${command.name}: ${command.description}`);
    });
  };
}
