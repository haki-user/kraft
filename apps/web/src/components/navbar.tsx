"use client";

/* eslint-disable react/jsx-pascal-case -- Icons.logo */

import * as React from "react";
import Link from "next/link";
import {
  useTheme,
  Icons,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  Button,
} from "@kraft/ui";
import { useAuthStore } from "@/store/auth-store";
import { verifyToken, logoutUser } from "@/services/auth-service";

const navLinks: { href: string; text: string; icon?: JSX.Element }[] = [
  {
    href: "/contest",
    text: "Contests",
    icon: <Icons.logo className="mr-2 h-4 w-4" />,
  },
  { href: "/problem", text: "Problems" },
  { href: "/docs", text: "Documentation" },
] as const;

const navLinkClass = `${navigationMenuTriggerStyle()} rounded-none`;

export function Navbar(): JSX.Element {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { user, logout, setAccessToken } = useAuthStore();

  // Run once on component mount
  React.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
    
    // Verify token once on initial load
    const runVerify = async () => {
      try {
        await verifyToken();
      } catch (error) {
        console.error("Error verifying token:", error);
      }
    };
    
    void runVerify();
    setMounted(true);
  }, []); // Empty dependency array - only runs once on mount

  // Memoize theme toggle handler
  const handleThemeToggle = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  // Memoize navigation menu items
  const navigationItems = React.useMemo(
    () =>
      navLinks.map(({ href, text, icon = null }) => (
        <NavigationMenuItem key={href} style={{ marginLeft: 0 }}>
          <Link href={href} legacyBehavior passHref>
            <NavigationMenuLink className={navLinkClass}>
              {icon}
              {text}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      )),
    []
  );

  // Memoize auth-related menu items to prevent unnecessary re-renders
  const authMenuItems = React.useMemo(() => {
    if (user) {
      return (
        <NavigationMenuItem className="hover:bg-destructive">
          <Link href="/auth" legacyBehavior passHref>
            <NavigationMenuLink 
              className={navLinkClass} 
              onClick={(e:any) => {
                e.preventDefault();
                logout();
                logoutUser();
                // Add redirection after logout if needed
                window.location.href = "/auth";
              }}
            >
              Logout
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      );
    }
    
    return (
      <NavigationMenuItem>
        <Link href="/auth" legacyBehavior passHref>
          <NavigationMenuLink className={navLinkClass}>
            Login
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    );
  }, [user, logout]); // Only re-render when user or logout changes

  return (
    <NavigationMenu className="rounded-none flex justify-between items-center min-w-full h-[2.25rem]">
      <NavigationMenuList className="rounded-none">
        {navigationItems}
      </NavigationMenuList>
      <NavigationMenuList>
        {authMenuItems}
        <NavigationMenuItem>
          {mounted ? (
            <Button
              className="rounded-none"
              onClick={handleThemeToggle}
              type="button"
              variant="ghost"
            >
              {resolvedTheme === "light" ? (
                <Icons.radixMoon fill="black" height={20} width={20} />
              ) : (
                <Icons.radixSun height={20} width={20} />
              )}
            </Button>
          ) : null}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}