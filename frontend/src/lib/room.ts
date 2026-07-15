// 直近に入室したRoomをlocalStorageに保持し、次回起動時に一覧へ戻れるようにする
const KEY = "currentRoomId";

export function getCurrentRoomId(): string | null {
  return localStorage.getItem(KEY);
}

export function setCurrentRoomId(roomId: string): void {
  localStorage.setItem(KEY, roomId);
}

export function clearCurrentRoomId(): void {
  localStorage.removeItem(KEY);
}
