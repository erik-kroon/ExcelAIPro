import { createFileRoute } from "@tanstack/react-router";
import { ChatUI } from "@/components/chat-ui";

export const Route = createFileRoute("/_authed/chat")({
  component: ChatUI,
});
