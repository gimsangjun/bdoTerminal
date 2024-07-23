import { ShowCommand } from "./Show";
export interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => Promise<void>;
}

export { PriceCommand } from "./Price";
export { ListCommand } from "./List";
export { CreateCommand } from "./Create";
export { ReadCommand } from "./Read";
export { UpdateCommand } from "./Update";
export { DeleteCommand } from "./Delete";
export { ShowCommand } from "./Show";
