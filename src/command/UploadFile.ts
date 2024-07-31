import { Command } from ".";
import { google } from "googleapis";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { authenticateAndExecute } from "../utils/drive";

dotenv.config();

export class UploadFileCommand implements Command {
  name = "uploadFile";
  description = "Upload a file to a Google Drive folder";

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
          await uploadFile(oAuth2Client);
        } else {
          throw new Error("Failed to get valid access token");
        }
      } catch (error) {
        console.error("Existing tokens are invalid, re-authenticating...");
        await authenticateAndExecute(oAuth2Client, scopes, uploadFile);
      }
    } else {
      await authenticateAndExecute(oAuth2Client, scopes, uploadFile);
    }
  };
}

// Google Drive에 파일 업로드
async function uploadFile(oAuth2Client: any) {
  const drive = google.drive({
    version: "v3",
    auth: oAuth2Client,
  });

  // 현재 작업 디렉토리 확인
  // const currentWorkingDir = process.cwd();
  // console.log("Current Working Directory:", currentWorkingDir);

  const filePath = "./src/datas/priceAlerts.json";
  const folderId = process.env.FOLDER_ID; // 업로드할 폴더 ID

  // 파일 메타데이터 설정
  const fileMetadata = {
    name: path.basename(filePath), // 업로드될 파일의 이름을 설정 (priceAlerts.json)
    parents: [folderId], // 파일이 업로드될 폴더 ID를 설정
  };

  // 파일 미디어 설정
  const media = {
    mimeType: "application/json", // 파일의 MIME 타입 설정
    body: fs.createReadStream(filePath), // 파일 스트림을 생성하여 파일 내용을 읽음
  };

  try {
    // Google Drive에 파일 업로드
    const file = await drive.files.create({
      requestBody: fileMetadata, // 파일 메타데이터 포함
      media: media, // 파일 데이터 포함
      fields: "id", // 응답으로 파일 ID만 포함
    });

    console.log(`File uploaded successfully. File ID: ${file.data.id}`);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}
