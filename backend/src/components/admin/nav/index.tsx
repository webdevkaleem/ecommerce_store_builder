"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { slugToLabel } from "@/lib/helper-functions";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export default function Nav() {
  const pathnameOriginal = usePathname();

  const pathnameArr = pathnameOriginal
    .trim()
    .split("/")
    .filter((val) => val !== "")
    .slice(0, -1);

  return (
    <div className="flex h-10 items-center gap-x-2">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <Breadcrumb>
        <BreadcrumbList>
          {/* Showing initial breadcrumb */}
          {pathnameArr.length === 0 && (
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
          )}

          {/* Showing labels & separators */}
          {pathnameArr.length > 0 &&
            pathnameArr.map((pathname, i) => {
              const showSeparator = i < pathnameArr.length - 1;
              const linkToDisplay = pathnameArr.slice(0, i + 1).join("/");

              return (
                <Fragment key={`fragment-${pathname}`}>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/${linkToDisplay}`}>
                      {slugToLabel(pathname)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {showSeparator && <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
