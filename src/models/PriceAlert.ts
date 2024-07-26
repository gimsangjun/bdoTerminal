export class PriceAlert {
  id: number;
  sid: number;
  itemName: string;
  targetPrice: number;
  isActive: boolean;
  alertCondition: "above" | "below"; // 알림 조건 변수 추가

  constructor(
    id: number,
    sid: number,
    itemName: string,
    targetPrice: number,
    alertCondition: "above" | "below", // 특정 가격보다 높을때, 낮을때 알람
    isActive: boolean = true,
  ) {
    this.id = id;
    this.sid = sid;
    this.itemName = itemName;
    this.targetPrice = targetPrice;
    this.alertCondition = alertCondition;
    this.isActive = isActive;
  }

  // 아이템의 현재 가격과 targetPrice를 비교하여 알려줌
  isTargetPriceReached(currentPrice: number): boolean {
    if (this.alertCondition === "above") {
      return currentPrice >= this.targetPrice;
    } else {
      return currentPrice <= this.targetPrice;
    }
  }
}
