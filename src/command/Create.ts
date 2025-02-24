import { Command } from ".";
import { PriceAlert } from "../models/PriceAlert";
import * as fs from "fs";
import * as path from "path";
import readlineSync from "readline-sync";
import { exitUtil, ExitException } from "../utils/exit";
import {
  Item,
  findItemId,
  getPrice,
  transformAndPrintItems,
} from "../utils/api";
import { parseKoreanCurrency } from "../utils/parseKorPrice";

export class CreateCommand implements Command {
  name = "create";
  description = "create a price alert for an item";

  execute = async (): Promise<void> => {
    let itemName: string;
    let targetPrice: number;
    let itemId: number;
    let selectedItem: Item;
    let alertCondition: "above" | "below";

    try {
      while (true) {
        // 사용자로부터 아이템 이름 입력받음
        itemName = exitUtil("Enter the item name (or type 'exit' to quit): ");
        try {
          // itemName이 없으면 예외 발생
          itemId = findItemId(itemName);

          // 사용자가 입력한 아이템 가격을 보여줌. 만약 response.data가 list라면 그 중에 하나만 사용자가 선택함.
          const res = await getPrice(itemName);
          if (Array.isArray(res)) {
            transformAndPrintItems(res);
            const selectedIndex = readlineSync.questionInt(
              "Select an item by number: ",
            );
            selectedItem = res[selectedIndex - 1];
          } else {
            selectedItem = res;
          }
          console.log("현재 선택된 아이템");
          transformAndPrintItems([selectedItem]);

          break;
        } catch (error) {
          console.log("Item not found. Please enter a valid item name.");
        }
      }

      while (true) {
        const targetPriceInput = exitUtil(
          "Enter the target price (or type 'exit' to quit): ",
        );
        targetPrice = parseKoreanCurrency(targetPriceInput);

        if (!isNaN(targetPrice)) {
          break;
        } else {
          console.log("Invalid price. Please provide a valid number.");
        }
      }

      while (true) {
        const conditionInput = exitUtil(
          "Enter the alert condition ('above' for price above target, 'below' for price below target): ",
        ).toLowerCase();
        if (conditionInput === "above" || conditionInput === "below") {
          alertCondition = conditionInput as "above" | "below"; // TODO: 이런식으로 입력값을 조절할수 잇다.
          break;
        } else {
          console.log("Invalid condition. Please enter 'above' or 'below'.");
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
    const priceAlert = new PriceAlert(
      itemId,
      selectedItem.sid,
      itemName,
      targetPrice,
      alertCondition,
      true,
    );

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
