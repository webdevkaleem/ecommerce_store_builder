import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4">
      <h2>Not Found</h2>
      <p>Could not find the requested resource</p>
      <Button asChild>
        <Link href={"/"} className="w-fit">
          <LayoutDashboard />
          <span>Dashboard</span>
        </Link>
      </Button>
    </div>
  );
}
