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

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

  return (
    <NavigationMenu className="rounded-none flex justify-between items-center min-w-full h-[2.25rem]">
      <NavigationMenuList className="rounded-none">
        {navigationItems}
      </NavigationMenuList>
      <NavigationMenuList>
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
      </NavigationMenuList>
    </NavigationMenu>
  );
}
