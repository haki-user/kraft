"use client";

import * as React from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@kraft/ui";

export function LangaugesDropdown({
  activeLanguage,
  languages,
  setActiveLanguage,
}: {
  activeLanguage: string;
  setActiveLanguage: (lang: string) => void;
  languages: string[];
}): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-20" size="sm" variant="outline">
          {activeLanguage}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {/* <DropdownMenuLabel>Choose Language</DropdownMenuLabel> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuRadioGroup
          onValueChange={setActiveLanguage}
          value={activeLanguage}
        >
          {languages.map((lang) => (
            <DropdownMenuRadioItem key={lang} value={lang}>
              {lang}
            </DropdownMenuRadioItem>
          ))}
          {/* <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem> */}
          {/* <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem> */}
          {/* <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem> */}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
