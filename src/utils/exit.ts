// utils/exitUtil.ts
import * as readlineSync from "readline-sync";

// 커스텀 예외 클래스 정의
export class ExitException extends Error {
  constructor() {
    super("Exit command received");
  }
}

export function exitUtil(prompt: string): string {
  const input = readlineSync.question(prompt);
  if (input.toLowerCase() === "exit") {
    throw new ExitException();
  }
  return input;
}
