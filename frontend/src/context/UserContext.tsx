import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, type User } from "../lib/api";
import { getProfile } from "../lib/liff";

type UserContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  error: null,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfile();
        const u = await api.upsertUser({
          lineUserId: profile.lineUserId,
          name: profile.name,
        });
        setUser(u);
      } catch (e) {
        setError(e instanceof Error ? e.message : "ログインに失敗しました");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
