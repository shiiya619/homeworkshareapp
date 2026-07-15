import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { api, type Task } from "../lib/api";
import { clearCurrentRoomId, setCurrentRoomId } from "../lib/room";

// F-2: 課題共有閲覧ページ (docs/requirements.md 6章)
export function TaskListPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!roomId) return;
    try {
      const data = await api.listTasks(roomId);
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "正常にデータ取得できませんでした。");
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) setCurrentRoomId(roomId);
    reload();
  }, [roomId, reload]);

  async function handleReact(taskId: string, reactionType: "in_progress" | "done") {
    if (!user) return;
    try {
      await api.react({ taskId, userId: user.id, reactionType });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "リアクションに失敗しました。");
    }
  }

  function leaveRoom() {
    clearCurrentRoomId();
    navigate("/");
  }

  if (loading) return <div className="center">読み込み中...</div>;

  return (
    <div>
      <div className="row space-between">
        <h1>課題一覧</h1>
        <Link className="btn" to={`/rooms/${roomId}/tasks/new`}>
          ＋課題を登録
        </Link>
      </div>

      <p className="muted">
        Room ID: <code>{roomId}</code>（メンバーに共有して招待）
      </p>

      {error && <p className="error">{error}</p>}

      {tasks.length === 0 ? (
        <p className="muted">まだ課題がありません。「＋課題を登録」から追加しましょう。</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => {
            const myReaction = task.reactions.find((r) => r.user.id === user?.id);
            return (
              <li key={task.id} className="task-card">
                <div className="task-head">
                  <strong>{task.title}</strong>
                  <span className="deadline">〆 {formatDeadline(task.deadline)}</span>
                </div>
                {task.description && <p className="desc">{task.description}</p>}
                <p className="muted small">登録者: {task.createdBy.name}</p>

                <div className="reactions">
                  <button
                    className={`chip ${myReaction?.reactionType === "in_progress" ? "active" : ""}`}
                    onClick={() => handleReact(task.id, "in_progress")}
                  >
                    着手中
                  </button>
                  <button
                    className={`chip ${myReaction?.reactionType === "done" ? "active done" : ""}`}
                    onClick={() => handleReact(task.id, "done")}
                  >
                    完了
                  </button>
                </div>

                {task.reactions.length > 0 && (
                  <p className="muted small">
                    {task.reactions
                      .map((r) => `${r.user.name}: ${labelOf(r.reactionType)}`)
                      .join(" / ")}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <button className="link" onClick={leaveRoom}>
        別のRoomへ
      </button>
    </div>
  );
}

function labelOf(type: "in_progress" | "done") {
  return type === "done" ? "完了" : "着手中";
}

function formatDeadline(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")}`;
}
