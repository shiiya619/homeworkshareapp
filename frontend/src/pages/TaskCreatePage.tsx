import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { api } from "../lib/api";

// F-1: 課題登録フォーム (docs/requirements.md 6章)
export function TaskCreatePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !roomId) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.createTask({
        roomId,
        createdBy: user.id,
        title,
        description: description || undefined,
        // datetime-localの値をISO文字列に変換
        deadline: new Date(deadline).toISOString(),
      });
      navigate(`/rooms/${roomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "正常に共有されませんでした。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>課題を登録</h1>
      <form className="stack" onSubmit={handleSubmit}>
        <label>
          課題名
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          内容（任意）
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </label>
        <label>
          締切
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "登録中..." : "登録する"}
        </button>
      </form>
      <button className="link" onClick={() => navigate(`/rooms/${roomId}`)}>
        キャンセル
      </button>
    </div>
  );
}
