export class PriceAlert {
  id: number;
  sid: number;
  itemName: string;
  targetPrice: number;
  isActive: boolean;

  constructor(
    id: number,
    sid: number,
    itemName: string,
    targetPrice: number,
    isActive: boolean = true,
  ) {
    this.id = id;
    this.sid = sid;
    this.itemName = itemName;
    this.targetPrice = targetPrice;
    this.isActive = isActive;
  }

  // 아이템의 현재 가격과 targetPrice를 비교하여 알려줌
  isTargetPriceReached(currentPrice: number): boolean {
    return currentPrice <= this.targetPrice;
  }
}
