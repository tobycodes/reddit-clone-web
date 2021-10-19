import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMeQuery, User } from "@generated/graphql";

export function useIsAuth() {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    if (!fetching) {
      setLoading(false);
      setIsAuthenticated(!!data?.me.user);
      setUser(data?.me.user);

      if (!data?.me.user) {
        router.replace(`/login?redirect=${router.pathname}`);
      }
    }
  }, [data, fetching, router]);

  return { loading, isAuthenticated, user };
}
