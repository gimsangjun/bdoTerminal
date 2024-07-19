import { Command } from ".";
// TODO: 구현해야함.
export class ListCommand implements Command {
  name = "list";
  description = "Get the list of an commands";

  constructor() {}

  execute = async (args: string[]): Promise<void> => {};
}
