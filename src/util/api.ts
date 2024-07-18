import dotenv from "dotenv";
import * as fs from "fs";

export class ApiUtil {
  private BdoMarketUrl: string = process.env.BdoMarket_Url;
  private itemDataPath = "./src/itemsData.json";

  async getPrice(itemName: string) {
    const itemData = JSON.parse(fs.readFileSync(this.itemDataPath, "utf-8"));

    // // 사용자로부터 아이템 이름 입력받기
    // const itemName = readlineSync.question("Enter the item name: ");

    // 아이템 이름으로 ID 찾기
    const item = itemData.find(
      (item: { name: string }) =>
        item.name.toLowerCase() === itemName.toLowerCase(),
    );

    if (item) {
      console.log(`The ID of the item "${itemName}" is ${item.id}`);
    } else {
      console.log(`Item "${itemName}" not found.`);
    }

    // const response = await fetch(url);
    // const data = await response.json();
    // return data;
  }
}
