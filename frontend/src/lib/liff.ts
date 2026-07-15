import liff from "@line/liff";

export type Profile = {
  lineUserId: string;
  name: string;
};

const DEV_PROFILE: Profile = {
  lineUserId: "dev-user",
  name: "開発ユーザー",
};

// - VITE_LIFF_ID 未設定（ローカル開発）: devプロフィールで動かす
// - VITE_LIFF_ID 設定済み（本番）: LIFFで本人認証。失敗時はdevへフォールバックせずエラーにする
//   （フォールバックすると全員がdev-userとして入れてしまい共有が破綻するため）
export async function getProfile(): Promise<Profile> {
  const liffId = import.meta.env.VITE_LIFF_ID;
  if (!liffId) {
    return DEV_PROFILE;
  }

  await liff.init({ liffId });
  if (!liff.isLoggedIn()) {
    // LINEログイン画面へリダイレクト。戻ってきた後に再度この関数が走る。
    liff.login();
    // リダイレクトが走るため以降は実行されないが、型のためにPromiseを解決させない
    return new Promise<Profile>(() => {});
  }
  const p = await liff.getProfile();
  return { lineUserId: p.userId, name: p.displayName };
}
