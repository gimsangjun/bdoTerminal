import { Command } from ".";
import * as fs from "fs";
import * as path from "path";
import { exitUtil, ExitException } from "../utils/exit";
import { findItemId } from "../utils/api";
import { PriceAlert } from "../models/PriceAlert";

export class UpdateCommand implements Command {
  name = "update";
  description = "Update a price alert for an item";

  execute = async (): Promise<void> => {
    const dataDir = path.join(__dirname, "../datas");
    const dataFile = path.join(dataDir, "priceAlerts.json");

    if (!fs.existsSync(dataFile)) {
      console.log("No price alerts found.");
      return;
    }

    const fileContent = fs.readFileSync(dataFile, "utf-8");
    const alerts = JSON.parse(fileContent) as PriceAlert[];

    let itemName: string;
    let targetPrice: number;

    try {
      while (true) {
        itemName = exitUtil(
          "Enter the item name to update (or type 'exit' to quit): ",
        );
        const alert = alerts.find(
          (alert) => alert.itemName.toLowerCase() === itemName.toLowerCase(),
        );

        if (alert) break;
        else console.log("Item not found. Please enter a valid item name.");
      }

      while (true) {
        const targetPriceInput = exitUtil(
          "Enter the new target price (or type 'exit' to quit): ",
        );
        targetPrice = parseFloat(targetPriceInput);

        if (!isNaN(targetPrice)) break;
        else console.log("Invalid price. Please provide a valid number.");
      }
    } catch (error) {
      if (error instanceof ExitException) {
        console.log("Operation cancelled by user.");
        return;
      }
      throw error;
    }

    const alert = alerts.find(
      (alert) => alert.itemName.toLowerCase() === itemName.toLowerCase(),
    );
    if (alert) {
      alert.targetPrice = targetPrice;

      fs.writeFileSync(dataFile, JSON.stringify(alerts, null, 2));
      console.log(`Price alert for ${itemName} updated to ${targetPrice}.`);
    }
  };
}
