import dotenv from "dotenv";
import * as fs from "fs";
import axios from "axios";

dotenv.config();

export class ApiUtil {
  //  process.env.BDOMARKET_URL || "https://api.arsha.io/v2/kr";
  private BdoMarketUrl: string = process.env.BdoMarket_Url;

  private itemDataPath = "./src/itemsData.json";

  async getPrice(itemName: string) {
    const itemData = JSON.parse(fs.readFileSync(this.itemDataPath, "utf-8"));

    // 아이템 이름으로 ID 찾기
    const item = itemData.find(
      (item: { name: string }) =>
        item.name.toLowerCase() === itemName.toLowerCase(),
    );

    if (!item) {
      throw new Error(`Item "${itemName}" not found.`);
    }

    try {
      const requestBody = [item.id];
      // 아이템 가격 요청
      const response = await axios.post(
        `${this.BdoMarketUrl}/item?lang=kr`,
        requestBody,
      );

      return response.data;
    } catch (error) {
      console.error(`Failed to fetch price for item "${itemName}":`, error);
      throw error;
    }
  }
}
