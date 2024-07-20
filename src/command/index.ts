export interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => Promise<void>;
}

export { PriceCommand } from "./Price";
export { PriceAlertCommand } from "./PriceAlert";
export { ListCommand } from "./List";
