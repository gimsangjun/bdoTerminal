import { Command } from ".";
import { PriceAlert } from "../models/PriceAlert";
import * as fs from "fs";
import * as path from "path";
import { exitUtil, ExitException } from "../utils/exit";
import { findItemId } from "../utils/api";

export class CreateCommand implements Command {
  name = "create";
  description = "create a price alert for an item";

  execute = async (): Promise<void> => {
    let itemName: string;
    let targetPrice: number;
    let itemId: number;

    try {
      while (true) {
        // 사용자로부터 아이템 이름 입력받음
        itemName = exitUtil("Enter the item name (or type 'exit' to quit): ");
        try {
          // itemName이 없으면 예외 발생
          itemId = findItemId(itemName);
          break;
        } catch (error) {
          console.log("Item not found. Please enter a valid item name.");
        }
      }

      while (true) {
        const targetPriceInput = exitUtil(
          "Enter the target price (or type 'exit' to quit): ",
        );
        targetPrice = parseFloat(targetPriceInput);

        if (!isNaN(targetPrice)) {
          break;
        } else {
          console.log("Invalid price. Please provide a valid number.");
        }
      }
    } catch (error) {
      // 밖으로 나가기
      if (error instanceof ExitException) {
        console.log("Operation cancelled by user.");
        return;
      }
      throw error; // 다른 예외는 다시 던집니다.
    }

    // 모델 PriceAlert에 데이터 넣기
    const priceAlert = new PriceAlert(itemId, itemName, targetPrice);

    // ../datas 폴더에 데이터를 저장
    const dataDir = path.join(__dirname, "../datas");
    const dataFile = path.join(dataDir, "priceAlerts.json");

    // 데이터 디렉토리가 존재하지 않으면 생성
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    // 기존 데이터를 로드하거나 새로운 배열 생성
    let alerts: PriceAlert[] = [];
    if (fs.existsSync(dataFile)) {
      const fileContent = fs.readFileSync(dataFile, "utf-8");
      alerts = JSON.parse(fileContent) as PriceAlert[];
    }

    // 새로운 알람 추가
    alerts.push(priceAlert);

    // 데이터를 JSON 형식으로 파일에 저장
    fs.writeFileSync(dataFile, JSON.stringify(alerts, null, 2));

    console.log(`Price alert for ${itemName} at ${targetPrice} has been set.`);
  };
}
