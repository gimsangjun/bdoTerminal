import { Command } from ".";
import { google } from "googleapis";
import dotenv from "dotenv";
import { authenticateAndExecute } from "../utils/drive";

dotenv.config();

export class DriveFilesCommand implements Command {
  name = "driveFiles";
  description = "Get the list of files in a Google Drive folder";

  constructor() {}

  execute = async (args: string[]): Promise<void> => {
    // Google Auth2 client 설정
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;
    const scopes = ["https://www.googleapis.com/auth/drive"];

    // 구글 드라이브 API토큰
    const refreshToken = process.env.REFRESH_TOKEN;
    // const accessToken = process.env.ACCESS_TOKEN; // refresh토큰을 통해 발급받을수 있음.

    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri,
    );

    // 이미 토큰이 있는 경우 유효성 검사 후 진행
    if (refreshToken) {
      oAuth2Client.setCredentials({
        refresh_token: refreshToken, // 보통 무기한 유효하나, 특정 조건에서 무효화
        //access_token: accessToken, // Access Token의 유효기간이 짧기 때문에, 새로고침 토큰을 사용하여 새로운 Access Token을 자동으로 발급받아 지속적인 API 접근을 가능
      });

      try {
        // 토큰 유효성 검사
        // refresh 토큰을 통해 accessToken을 가져옴.
        await oAuth2Client.getAccessToken();
        console.log("Using existing tokens for authentication");
        await listFiles(oAuth2Client);
      } catch (error) {
        console.error("Existing tokens are invalid, re-authenticating...");
        await authenticateAndExecute(oAuth2Client, scopes, listFiles);
      }
    } else {
      // 토큰이 없는 경우 인증 절차 시작
      await authenticateAndExecute(oAuth2Client, scopes, listFiles);
    }
  };
}

// 이미 유효한 토큰이 있으므로 바로 명령어 실행
async function listFiles(oAuth2Client: any) {
  // Google Drive API를 활용하여 파일 목록 가져오기
  const drive = google.drive({
    version: "v3",
    auth: oAuth2Client,
  });

  const folderId = process.env.FOLDER_ID; // 저장할 폴더 ID

  const response = await drive.files.list({
    q: `'${folderId}' in parents`,
    pageSize: 10,
    fields: "nextPageToken, files(id, name)",
  });

  const files = response.data.files;
  if (!files || files.length === 0) {
    console.log("No files found.");
  } else {
    console.log("Files:", files);
  }
}
