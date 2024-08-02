import { Command } from ".";
import { google } from "googleapis";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import readlineSync from "readline-sync";
import { authenticateAndExecute } from "../utils/drive";

dotenv.config();

export class UpdateFileCommand implements Command {
  name = "updateFile";
  description =
    "Download a data file from a Google Drive folder and update the local file.";

  constructor() {}

  execute = async (args: string[]): Promise<void> => {
    // Google Auth2 client 설정
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;
    const scopes = ["https://www.googleapis.com/auth/drive"];

    // 구글 드라이브 API 토큰
    const refreshToken = process.env.REFRESH_TOKEN;

    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri,
    );

    if (refreshToken) {
      oAuth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      try {
        const tokenInfo = await oAuth2Client.getAccessToken();
        if (tokenInfo.token) {
          console.log("Using existing tokens for authentication");
          await updateFileFromDrive(oAuth2Client);
        } else {
          throw new Error("Failed to get valid access token");
        }
      } catch (error) {
        console.error("Existing tokens are invalid, re-authenticating...");
        await authenticateAndExecute(oAuth2Client, scopes, updateFileFromDrive);
      }
    } else {
      await authenticateAndExecute(oAuth2Client, scopes, updateFileFromDrive);
    }
  };
}

// Google Drive에 파일 업데이트
// TODO: fs, pasth 모듈 사용법 노션
async function updateFileFromDrive(oAuth2Client: any) {
  const drive = google.drive({
    version: "v3",
    auth: oAuth2Client,
  });

  const localFilePath = path.join(__dirname, "../datas/priceAlerts.json");
  const folderId = process.env.FOLDER_ID; // 업데이트할 폴더 ID
  // const fileId = process.env.FILE_ID; // 업데이트할 파일 ID

  // 파일 메타데이터 가져오기
  try {
    // Google Drive에서 priceAlerts.json 파일의 fileId 가져오기
    const listResponse = await drive.files.list({
      // TODO: 아래와 같은 정보들은 어디서 확인하는지 검색해보기
      q: `name='priceAlerts.json' and '${folderId}' in parents`,
      fields: "files(id, name, modifiedTime)",
      spaces: "drive",
    });

    const file = listResponse.data.files && listResponse.data.files[0];
    if (!file) {
      console.log("File not found.");
      return;
    }

    const fileId = file.id;
    const modifiedTime = file.modifiedTime;
    console.log(`Last modified time of the file: ${modifiedTime}`);

    // 사용자로부터 업데이트 여부 확인
    const userResponse = readlineSync.question(
      "Do you want to update the file? (y/n): ",
    );
    if (userResponse.toLowerCase() !== "y") {
      console.log("File update canceled.");
      return;
    }

    // Google Drive에서 파일 다운로드 및 로컬 파일 덮어쓰기
    // TODO: 어떤 구조로 쓰여진 코드인지 확인
    const dest = fs.createWriteStream(localFilePath);
    await drive.files
      .get({ fileId: fileId, alt: "media" }, { responseType: "stream" })
      .then((res) => {
        return new Promise((resolve, reject) => {
          res.data
            .on("end", () => {
              console.log(
                "Downloaded and overwrote the file to",
                localFilePath,
              );
              resolve(true);
            })
            .on("error", (err) => {
              console.error("Error downloading file:", err);
              reject(err);
            })
            .pipe(dest);
        });
      });
  } catch (error) {
    console.error("Error updating file:", error);
  }
}
