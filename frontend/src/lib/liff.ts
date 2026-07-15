import liff from "@line/liff";

export type Profile = {
  lineUserId: string;
  name: string;
};

const DEV_PROFILE: Profile = {
  lineUserId: "dev-user",
  name: "開発ユーザー",
};

// 本番はLIFFログイン、ローカル(VITE_LIFF_ID未設定 or init失敗)はdevプロフィールで動作させる
export async function getProfile(): Promise<Profile> {
  const liffId = import.meta.env.VITE_LIFF_ID;
  if (!liffId) {
    return DEV_PROFILE;
  }
  try {
    await liff.init({ liffId });
    if (!liff.isLoggedIn()) {
      liff.login();
      // login()でリダイレクトされるため、ここには実質戻らない
      return DEV_PROFILE;
    }
    const p = await liff.getProfile();
    return { lineUserId: p.userId, name: p.displayName };
  } catch (e) {
    console.warn("LIFF init failed, falling back to dev profile", e);
    return DEV_PROFILE;
  }
}
