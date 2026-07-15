import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { api } from "../lib/api";
import { setCurrentRoomId } from "../lib/room";

// F-5: Room検索・入室フォーム (docs/requirements.md 6章)
export function RoomJoinPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [roomPass, setRoomPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      const room = await api.joinRoom({ roomId, roomPass, userId: user.id });
      setCurrentRoomId(room.id);
      navigate(`/rooms/${room.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "入室できませんでした。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Room入室</h1>
      <form className="stack" onSubmit={handleSubmit}>
        <label>
          Room ID
          <input value={roomId} onChange={(e) => setRoomId(e.target.value)} required />
        </label>
        <label>
          Roomパスワード
          <input
            type="password"
            value={roomPass}
            onChange={(e) => setRoomPass(e.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "入室中..." : "入室する"}
        </button>
      </form>
      <button className="link" onClick={() => navigate("/rooms/new")}>
        新しくRoomを作成する
      </button>
    </div>
  );
}
