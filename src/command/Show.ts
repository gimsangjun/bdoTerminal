import { Command } from ".";
import * as fs from "fs";
import * as path from "path";
import { getPricesByIds } from "../utils/api";
import { PriceAlert } from "../models/PriceAlert";

export class ShowCommand implements Command {
  name = "show";
  description = "Show the list of price alerts";

  execute = async (args: string[]): Promise<void> => {
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
      return;
    }

    const itemIds = alerts.map((alert) => alert.id);
    try {
      const prices = await getPricesByIds(itemIds);
      alerts.forEach((alert, index) => {
        const currentPrice = prices[index];
        // currentPrice가 targetPrice보다 작을 경우에만 특정 가격에 도달했다고 알림
        if (currentPrice <= alert.targetPrice) {
          console.log(
            `Item: ${alert.itemName}, Target Price: ${alert.targetPrice}, Current Price: ${currentPrice} - Target price reached or below!`,
          );
        } else {
          console.log(
            `Item: ${alert.itemName}, Target Price: ${alert.targetPrice}, Current Price: ${currentPrice}`,
          );
        }
      });
    } catch (error) {
      console.error("Failed to fetch prices:", error);
    }
  };
}
