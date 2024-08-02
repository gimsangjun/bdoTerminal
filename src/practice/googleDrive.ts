// Google Drive 연습용 예제
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import { google } from "googleapis";

dotenv.config();
const app = express();
const upload = multer({ dest: "uploads/" }); // Destination folder for uploaded files

// Configuration
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const scopes = ["https://www.googleapis.com/auth/drive"];

// 구글 드라이브 API토큰
const accessToken = process.env.ACCESS_TOKEN;
const refreshToken = process.env.REFRESH_TOKEN;

// Google Auth2 client 설정
const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri,
);

// authentication URL 생성
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline", // 'online' (default) or 'offline' (gets refresh_token)
  scope: scopes,
  include_granted_scopes: true, // Enable incremental authorization. Recommended as a best practice.
});

// 사용자 인증 URL로 redirect
app.get("/auth/google", (req, res) => {
  res.redirect(authUrl);
});

// Google Drive 클라이언트 설정
const drive = google.drive({
  version: "v3",
  auth: oAuth2Client,
});

// Google OAuth2 인증 콜백 처리
app.get("/auth/google/redirect", async (req, res) => {
  // 일회성 인증 코드, 이것을 활용하여 엑세스 토큰과 리프레쉬 토큰을 교환
  const code = req.query.code as string;

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    const accessToken = tokens.access_token; // Google API에 액세스할 수 있는 권한, 짧은 수명
    const refreshToken = tokens.refresh_token; // 새로운 토큰 얻을 때, 일반적으로 긴 수명
    // 자격 저장.
    oAuth2Client.setCredentials({
      refresh_token: refreshToken,
      access_token: accessToken,
    });

    // 액세스 토큰, 리프레쉬 토큰 저장 => express-session 필요.
    // req.session.accessToken = accessToken;
    // req.session.refreshToken = refreshToken;

    // Redirect the user to a success page or perform other actions
    res.send("Authentication successful!");
  } catch (error) {
    console.error("Error authenticating:", error);
    res.status(500).send("Authentication failed.");
  }
});

// Google Drive API를 활용하여 파일 목록 가져오기
app.get("/drive/files", async (req, res) => {
  try {
    // 액세스 토큰, 리프레쉬 토큰 저장
    oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const folderId = "1kqnCzc-BuILHAMNdU--ZaUaa9jo0l6sc"; // 저장할 폴더 ID

    const response = await drive.files.list({
      q: `'${folderId}' in parents`,
      pageSize: 10,
      fields: "nextPageToken, files(id, name)",
    });

    const files = response.data.files;
    if (files.length === 0) {
      res.send("No files found.");
    } else {
      res.send(response.data);
    }
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).send("Failed to fetch files.");
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
