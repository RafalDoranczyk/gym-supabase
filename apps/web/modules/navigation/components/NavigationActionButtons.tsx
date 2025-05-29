import { logout } from "@/actions";
import { TooltipIconButton } from "@/components";

export function NavigationActionButtons() {
  return (
    <>
      <TooltipIconButton onClick={logout} variant="logout" />
    </>
  );
}
