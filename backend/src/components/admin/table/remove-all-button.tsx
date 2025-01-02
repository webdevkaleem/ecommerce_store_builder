import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash } from "lucide-react";

export default function RemoveAllButton({ onClick }: { onClick: () => void }) {
  return (
    <DropdownMenuItem
      className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
      onClick={onClick}
    >
      <Trash />
      <span>Remove all files</span>
    </DropdownMenuItem>
  );
}
