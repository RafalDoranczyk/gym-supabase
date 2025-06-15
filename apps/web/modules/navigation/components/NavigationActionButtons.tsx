import { logout } from "@/actions/auth";
import { TooltipIconButton } from "@/components";

export function NavigationActionButtons() {
  return (
    <>
      <TooltipIconButton onClick={logout} variant="logout" />
    </>
  );
}
