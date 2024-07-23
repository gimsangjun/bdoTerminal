import { Command } from ".";
import * as fs from "fs";
import * as path from "path";
import { exitUtil, ExitException } from "../utils/exit";
import { PriceAlert } from "../models/PriceAlert";

export class DeleteCommand implements Command {
  name = "delete";
  description = "Delete a price alert for an item";

  execute = async (): Promise<void> => {
    const dataDir = path.join(__dirname, "../datas");
    const dataFile = path.join(dataDir, "priceAlerts.json");

    if (!fs.existsSync(dataFile)) {
      console.log("No price alerts found.");
      return;
    }

    const fileContent = fs.readFileSync(dataFile, "utf-8");
    let alerts = JSON.parse(fileContent) as PriceAlert[];

    let itemName: string;

    try {
      while (true) {
        // 현재 priceAlert 리스트를 보여줌
        console.log("Current Price Alerts:");
        alerts.forEach((alert, index) => {
          console.log(
            `${index + 1}. Item: ${alert.itemName}, Target Price: ${
              alert.targetPrice
            }`,
          );
        });
        itemName = exitUtil(
          "Enter the item name to delete (or type 'exit' to quit): ",
        );
        const alertIndex = alerts.findIndex(
          (alert) => alert.itemName.toLowerCase() === itemName.toLowerCase(),
        );

        if (alertIndex !== -1) {
          alerts.splice(alertIndex, 1);
          break;
        } else {
          console.log("Item not found. Please enter a valid item name.");
        }
      }
    } catch (error) {
      if (error instanceof ExitException) {
        console.log("Operation cancelled by user.");
        return;
      }
      throw error;
    }

    fs.writeFileSync(dataFile, JSON.stringify(alerts, null, 2));
    console.log(`Price alert for ${itemName} has been deleted.`);
  };
}
