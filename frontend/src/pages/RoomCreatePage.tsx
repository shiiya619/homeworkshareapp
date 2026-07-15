import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { api } from "../lib/api";
import { setCurrentRoomId } from "../lib/room";

// F-4: Room作成フォーム (docs/requirements.md 6章)
export function RoomCreatePage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [roomPass, setRoomPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      const room = await api.createRoom({ roomName, roomPass, userId: user.id });
      setCurrentRoomId(room.id);
      navigate(`/rooms/${room.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "正常に作成されませんでした。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Room作成</h1>
      <form className="stack" onSubmit={handleSubmit}>
        <label>
          Room名
          <input value={roomName} onChange={(e) => setRoomName(e.target.value)} required />
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
          {submitting ? "作成中..." : "作成する"}
        </button>
      </form>
      <BackLink />
    </div>
  );
}

function BackLink() {
  const navigate = useNavigate();
  return (
    <button className="link" onClick={() => navigate("/rooms/join")}>
      既存のRoomに入室する
    </button>
  );
}
