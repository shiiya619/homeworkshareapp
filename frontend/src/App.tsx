import { Navigate, Route, Routes } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import { getCurrentRoomId } from "./lib/room";
import { HomePage } from "./pages/HomePage";
import { RoomCreatePage } from "./pages/RoomCreatePage";
import { RoomJoinPage } from "./pages/RoomJoinPage";
import { TaskCreatePage } from "./pages/TaskCreatePage";
import { TaskListPage } from "./pages/TaskListPage";

function AppRoutes() {
  const { loading, error } = useUser();

  if (loading) return <div className="center">ログイン中...</div>;
  if (error) return <div className="center error">{error}</div>;

  const currentRoomId = getCurrentRoomId();

  return (
    <Routes>
      <Route
        path="/"
        element={currentRoomId ? <Navigate to={`/rooms/${currentRoomId}`} replace /> : <HomePage />}
      />
      <Route path="/rooms/new" element={<RoomCreatePage />} />
      <Route path="/rooms/join" element={<RoomJoinPage />} />
      <Route path="/rooms/:roomId" element={<TaskListPage />} />
      <Route path="/rooms/:roomId/tasks/new" element={<TaskCreatePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <UserProvider>
      <div className="container">
        <AppRoutes />
      </div>
    </UserProvider>
  );
}
