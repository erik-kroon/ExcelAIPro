import { auth } from "@/lib/auth";
import {
  createFileRoute,
  Outlet,
  redirect,
  useLoaderData,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_unauthed")({
  component: RouteComponent,
  loader: async () => {
    const { data } = await auth.getSession();

    if (data) {
      throw redirect({
        to: "/chat",
      });
    }
  },
});

function RouteComponent({}) {
  const data = useLoaderData({ from: "__root__" });
  console.log(data);

  return <Outlet />;
}
