import dotenv from "dotenv";
import * as fs from "fs";
import axios from "axios";
import readlineSync from "readline-sync";

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

// 아이템 가격 가져오기 api 요청 리턴.
async function getPrice(itemName: string): Promise<any> {
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
    return response.data;
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

export interface Item {
  id: number;
  sid: number;
  basePrice: number;
  lastSoldPrice: number;
}

// TODO: 따로 정리, return을 or로 할수 있음.
export function transformAndPrintItems(items: Item | Item[]): void {
  if (!Array.isArray(items)) {
    items = [items];
  }

  items.forEach((item, index) => {
    const maxPrice = Math.max(item.basePrice, item.lastSoldPrice);
    const formattedPrice = formatKoreanCurrency(maxPrice);
    console.log(
      `${index + 1}: id=${item.id}, sid=${
        item.sid
      }, maxPrice=${formattedPrice}`,
    );
  });
}

function formatKoreanCurrency(value: number): string {
  if (value >= 100000000) {
    return (value / 100000000).toFixed(2) + "억 원";
  } else if (value >= 10000) {
    return (value / 10000).toFixed(2) + "만 원";
  } else {
    return value.toLocaleString() + "원";
  }
}

export { findItemId, getPrice, getPricesByIds };
