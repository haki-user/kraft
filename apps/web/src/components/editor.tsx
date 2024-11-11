"use client";

import { Editor as MonacoEditor } from "@monaco-editor/react";
import { LangaugesDropdown } from "./languages-select";
import { useState } from "react";

interface IeditorProps {
  width?: number | string;
  height?: number | string;
}

export default function Editor({ width, height }: IeditorProps): JSX.Element {
  const languages = ["C++", "JavaScript", "TypeScript", "Go"];
  const [activeLanguage, setActiveLanguage] = useState("JavaScript");
  return (
    <div className="border-[1px] border-solid">
      <div className="flex">
        <LangaugesDropdown
          activeLanguage={activeLanguage}
          languages={languages}
          setActiveLanguage={setActiveLanguage}
        />
      </div>
      <div>
        <MonacoEditor
          defaultLanguage="javascript"
          defaultValue="// some comment"
          height={height || "90vh"}
          theme="vs-dark"
          width={width}
        />
      </div>
    </div>
  );
}
