import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useRouteHistory = () => {
  const router = useRouter();
  const [routeHistory, setRouteHistory] = useState<string>();

  useEffect(() => {
    if (router.asPath !== "/" && router.asPath !== routeHistory) {
      setRouteHistory(router.asPath);
    } else {
      setRouteHistory(undefined);
    }
  }, [router.asPath]);

  return routeHistory;
};
