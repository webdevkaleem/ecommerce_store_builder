// Global Imports
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Local Imports
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Box,
  BringToFront,
  ChartNoAxesCombined,
  ChevronUp,
  CircleUserRound,
  Container,
  Images,
  LayoutDashboard,
  SatelliteDish,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import ThemeSwitch from "./theme-switch";
import { cn } from "@/lib/utils";

// Body
const sideNavs: {
  id: string;
  label: string;
  href: string;
  links: {
    id: string;
    label: string;
    href: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  }[];
}[] = [
  {
    id: "1",
    label: "Store",
    href: "",
    links: [
      {
        id: "1",
        label: "Dashboard",
        href: "/",
        icon: <LayoutDashboard />,
      },
      {
        id: "2",
        label: "Statistics",
        href: "/statistics",
        icon: <ChartNoAxesCombined />,
        disabled: true,
      },
      {
        id: "3",
        label: "Orders",
        href: "/orders",
        icon: <BringToFront />,
        disabled: true,
      },
      {
        id: "4",
        label: "Announcements",
        href: "/announcements",
        icon: <SatelliteDish />,
        disabled: true,
      },
    ],
  },
  {
    id: "2",
    label: "Application",
    href: "",
    links: [
      {
        id: "1",
        label: "Categories",
        href: "/categories",
        icon: <Container />,
      },
      {
        id: "2",
        label: "Sub Categories",
        href: "/sub-categories",
        icon: <Box />,
      },
      {
        id: "3",
        label: "Media",
        href: "/media",
        icon: <Images />,
      },
      {
        id: "4",
        label: "Products",
        href: "/products",
        icon: <BringToFront />,
        disabled: true,
      },
    ],
  },
  {
    id: "3",
    label: "Backend",
    href: "",
    links: [
      {
        id: "1",
        label: "Settings",
        href: "/settings",
        disabled: true,
      },
      {
        id: "2",
        label: "Usage",
        href: "/usage",
        disabled: true,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarContent className="py-4">
        {sideNavs.map((sideNav) => {
          return (
            <SidebarGroup key={sideNav.id}>
              <SidebarGroupLabel>{sideNav.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sideNav.links.map((link) => {
                    return (
                      <SidebarMenuSub
                        key={link.id}
                        className={cn({
                          "pointer-events-none cursor-none opacity-50":
                            link.disabled,
                        })}
                      >
                        <SidebarMenuSubButton
                          onClick={() => setOpenMobile(false)}
                          asChild
                          isActive={
                            link.href === "/"
                              ? pathname === link.href
                              : pathname.includes(link.href)
                          }
                        >
                          <Link href={link.href}>
                            {link.icon && link.icon}
                            <span>{link.label}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSub>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <CircleUserRound />
                  <span>Username</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <ThemeSwitch />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
