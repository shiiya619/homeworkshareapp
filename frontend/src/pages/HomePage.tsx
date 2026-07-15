import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

export function HomePage() {
  const { user } = useUser();

  return (
    <div>
      <h1>ToDo共有アプリ</h1>
      <p className="muted">ようこそ、{user?.name} さん</p>
      <div className="stack">
        <Link className="btn" to="/rooms/new">
          Roomを作成する
        </Link>
        <Link className="btn secondary" to="/rooms/join">
          Roomに入室する
        </Link>
      </div>
    </div>
  );
}
