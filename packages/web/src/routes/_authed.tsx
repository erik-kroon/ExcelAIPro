import { auth } from "@/lib/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
  component: RouteComponent,
  loader: async ({ context: { qc } }) => {
    const { data } = await auth.getSession();

    if (!data) {
      throw redirect({
        to: "/login",
      });
    }
    return { session: data.session, user: data.user };
  },
});

function RouteComponent() {
  return <Outlet />;
}
