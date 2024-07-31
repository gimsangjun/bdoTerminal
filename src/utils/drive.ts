import fs from "fs";
import path from "path";
import readlineSync from "readline-sync";
import { google } from "googleapis";

// .env파일 업데이트
export function updateEnvFile(updatedValues: { [key: string]: string }) {
  const envFilePath = path.resolve(__dirname, "../../.env");
  const envVars = fs.readFileSync(envFilePath, "utf-8").split("\n");

  for (const [key, value] of Object.entries(updatedValues)) {
    const varIndex = envVars.findIndex((line) => line.startsWith(`${key}=`));
    if (varIndex !== -1) {
      envVars[varIndex] = `${key}=${value}`;
    } else {
      envVars.push(`${key}=${value}`);
    }
  }

  fs.writeFileSync(envFilePath, envVars.join("\n"));
}

// 인증후 로직 처리
export async function authenticateAndExecute(
  oAuth2Client: any,
  scopes: string[],
  executeFunction: (oAuth2Client: any) => Promise<void>,
) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
  });

  console.log("Authorize this app by visiting this url:", authUrl);

  const code = readlineSync.question("Enter the code from that page here: ");
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    const refreshToken = tokens.refresh_token;

    oAuth2Client.setCredentials({
      refresh_token: refreshToken,
      access_token: tokens.access_token,
    });

    console.log("Authentication successful!");

    updateEnvFile({ REFRESH_TOKEN: refreshToken });

    await executeFunction(oAuth2Client);
  } catch (error) {
    console.error("Error authenticating:", error);
  }
}
