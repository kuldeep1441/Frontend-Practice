import { useRouter } from "next/router";
import { useEffect } from "react";
import { loginRoute } from "@/routes/login";
import { dashboardRoute } from "@/routes/dashboard";

export default function Home() {
  const { push } = useRouter();
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      push(loginRoute);
    } else {
      push(dashboardRoute);
    }
  }, []);
  return null;
}
