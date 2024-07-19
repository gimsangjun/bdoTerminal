import dotenv from "dotenv";
import * as fs from "fs";
import axios from "axios";

dotenv.config();

const BdoMarketUrl = process.env.BDOMARKET_URL || "https://api.arsha.io/v2/kr";
const itemDataPath = "./src/itemsData.json";

// 아이템 이름으로 ID 찾기
function findItemId(itemName: string): number {
  const itemData = JSON.parse(fs.readFileSync(itemDataPath, "utf-8"));

  const item = itemData.find(
    (item: { name: string }) =>
      item.name.toLowerCase() === itemName.toLowerCase(),
  );

  if (!item) {
    throw new Error(`Item "${itemName}" not found.`);
  }

  return item.id;
}

// 아이템 가격 가져오기
async function getPrice(itemName: string): Promise<number> {
  try {
    const itemId = findItemId(itemName);
    const requestBody = [itemId];

    // 아이템 가격 요청
    const response = await axios.post(
      `${BdoMarketUrl}/item?lang=kr`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const price = Math.max(
      response.data.basePrice,
      response.data.lastSoldPrice,
    );

    return price;
  } catch (error) {
    console.error(`Failed to fetch price for item "${itemName}":`, error);
    throw error;
  }
}

export { findItemId, getPrice };
