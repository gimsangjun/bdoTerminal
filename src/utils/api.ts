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

// itemId가 List로 넘어오면 아이템 가격 요청하는 함수
async function getPricesByIds(itemIds: number[]): Promise<number[]> {
  try {
    const requestBody = itemIds;

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

    let responseData = response.data;

    // response.data가 리스트가 아닌 경우 리스트로 감싸기
    if (!Array.isArray(responseData)) {
      responseData = [responseData];
    }

    const prices = responseData.map(
      (item: { basePrice: number; lastSoldPrice: number }) => {
        return Math.max(item.basePrice, item.lastSoldPrice);
      },
    );

    return prices;
  } catch (error) {
    console.error(`Failed to fetch prices for item IDs "${itemIds}":`, error);
    throw error;
  }
}

export { findItemId, getPrice, getPricesByIds };
