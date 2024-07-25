import { Command } from ".";
import * as fs from "fs";
import * as path from "path";
import { PriceAlert } from "../models/PriceAlert";

export class ReadCommand implements Command {
  name = "read";
  description = "Read all price alerts";

  execute = async (): Promise<void> => {
    const dataDir = path.join(__dirname, "../datas");
    const dataFile = path.join(dataDir, "priceAlerts.json");

    if (!fs.existsSync(dataFile)) {
      console.log("No price alerts found.");
      return;
    }

    const fileContent = fs.readFileSync(dataFile, "utf-8");
    const alerts = JSON.parse(fileContent) as PriceAlert[];

    if (alerts.length === 0) {
      console.log("No price alerts found.");
    } else {
      console.log("Price alerts:");
      alerts.forEach((alert) => {
        console.log(
          `- Item: ${alert.itemName}, sid: ${alert.sid}, Target Price: ${alert.targetPrice}`,
        );
      });
    }
  };
}
