import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { initLiff } from "./lib/liff";
import { RoomCreatePage } from "./pages/RoomCreatePage";
import { RoomJoinPage } from "./pages/RoomJoinPage";
import { TaskCreatePage } from "./pages/TaskCreatePage";
import { TaskListPage } from "./pages/TaskListPage";
import { TaskSubmitPage } from "./pages/TaskSubmitPage";

export function App() {
  const [liffReady, setLiffReady] = useState(false);

  useEffect(() => {
    initLiff().then(() => setLiffReady(true));
  }, []);

  if (!liffReady) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<TaskListPage />} />
      <Route path="/rooms/new" element={<RoomCreatePage />} />
      <Route path="/rooms/join" element={<RoomJoinPage />} />
      <Route path="/tasks/new" element={<TaskCreatePage />} />
      <Route path="/tasks/:taskId/submit" element={<TaskSubmitPage />} />
    </Routes>
  );
}
