"use client";
/* eslint-disable react/jsx-pascal-case -- will refactor it later */

import { Editor as MonacoEditor, useMonaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Icons,
  Label,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@kraft/ui";

interface EditorSettings {
  keyBindings: "normal" | "vim";
  lineNumbers: "on" | "off" | "relative";
  tabSize: number;
  theme: "light" | "vs-dark" | "tomorrow-night";
  fontSize: number;
}

interface EditorProps {
  width?: number | string;
  height?: number | string;
  editorSettings?: EditorSettings;
  code: string;
  setCode: (code: string) => void;
  languages: string[];
  activeLanguage: string;
  setActiveLanguage: (language: string) => void;
}

const saveEditorSettingsLocal = (settings: EditorSettings): void => {
  localStorage.setItem("editorSettings", JSON.stringify(settings));
};

const getEditorSettingsLocal = (): EditorSettings | null => {
  const settings = localStorage.getItem("editorSettings");
  return settings ? (JSON.parse(settings) as EditorSettings) : null;
};

export default function Editor({
  width,
  height,
  editorSettings = {
    keyBindings: "normal",
    lineNumbers: "on",
    tabSize: 2,
    theme: "tomorrow-night",
    fontSize: 12,
  },
  code,
  setCode,
  languages,
  activeLanguage,
  setActiveLanguage,
}: EditorProps): JSX.Element {
  const monaco = useMonaco();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  // const languages = ["C++", "JavaScript", "TypeScript", "Go", "Python"];
  // const [activeLanguage, setActiveLanguage] = useState("JavaScript");
  // const [code, setCode] = useState<string>("");
  const [settings, setSettings] = useState<EditorSettings>(editorSettings);
  const [tempSettings, setTempSettings] = useState<EditorSettings>(settings);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const editorSettingsLocal = getEditorSettingsLocal();
    if (editorSettingsLocal) {
      setSettings(editorSettingsLocal);
      setTempSettings(editorSettingsLocal);
    }
  }, []);
  console.log({ settings });

  useEffect(() => {
    if (monaco) {
      const loadTheme = async (): Promise<void> => {
        if (settings.theme === "tomorrow-night") {
          const data = await import("monaco-themes/themes/Tomorrow-Night.json");
          monaco.editor.defineTheme("tomorrow-night", data as never);
          monaco.editor.setTheme("tomorrow-night");
        } else {
          monaco.editor.setTheme(settings.theme || "vs-dark");
        }
      };
      void loadTheme();
    }
  }, [monaco, settings.theme]);

  useEffect(() => {
    setTempSettings(settings);
  }, [open]);

  return (
    <div className="w-full h-full border-b-[1px] border-solid">
      <div className="flex px-1 gap-2 scale-y-90 justify-between">
        <Select
          defaultValue={activeLanguage}
          onValueChange={(value: string) => {
            setActiveLanguage(value);
          }}
        >
          <SelectTrigger className="w-[115px]">
            <SelectValue placeholder="Select a programming language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Programming Languages</SelectLabel>
              {languages.map((language) => {
                return (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger asChild>
            <Button variant="ghost">
              <Icons.settings />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="">
              <DialogTitle>Editor settings</DialogTitle>
              <DialogDescription>
                Make changes to editor here.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-5">
              <div className="flex gap-5 items-center justify-between">
                <Label
                  className="text-right text-nowrap"
                  htmlFor="select-line-numbers"
                >
                  Line numbers
                </Label>
                <Select
                  defaultValue={tempSettings.lineNumbers}
                  onValueChange={(value: "on" | "off" | "relative") => {
                    setTempSettings({ ...tempSettings, lineNumbers: value });
                  }}
                >
                  <SelectTrigger className="w-24" id="select-line-numbers">
                    <SelectValue placeholder="Line numbers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="on">On</SelectItem>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="relative">Relative</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-5 items-center justify-between">
                <Label className="text-right" htmlFor="select-key-bindings">
                  Key bindings
                </Label>
                <Select
                  defaultValue={tempSettings.keyBindings}
                  onValueChange={(value: "normal" | "vim") => {
                    setTempSettings({ ...tempSettings, keyBindings: value });
                  }}
                >
                  <SelectTrigger className="w-[110px]" id="select-key-bindings">
                    <SelectValue defaultValue={tempSettings.keyBindings} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="vim" disabled>
                        Vim
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-5 items-center justify-between">
                <Label
                  className="text-right text-nowrap"
                  htmlFor="input-editor-font-size"
                >
                  Font Size
                </Label>
                <Input
                  id="input-editor-font-size"
                  className="w-24"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setTempSettings({
                      ...tempSettings,
                      fontSize: parseInt(e.target.value),
                    });
                  }}
                  type="number"
                  value={tempSettings.fontSize}
                />
              </div>
              <div className="flex gap-5 items-center justify-between">
                <Label
                  className="text-right text-nowrap"
                  htmlFor="input-editor-tab-size"
                >
                  Tab size
                </Label>
                <Input
                  id="input-editor-tab-size"
                  className="w-24"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setTempSettings({
                      ...tempSettings,
                      tabSize: parseInt(e.target.value),
                    });
                  }}
                  type="number"
                  value={tempSettings.tabSize}
                />
              </div>

              <div className="flex gap-5 items-center justify-between">
                <Label className="text-right" htmlFor="select-editor-theme">
                  Editor Theme
                </Label>
                <Select
                  defaultValue={tempSettings.theme}
                  onValueChange={(
                    value: "light" | "vs-dark" | "tomorrow-night"
                  ) => {
                    setTempSettings({ ...tempSettings, theme: value });
                  }}
                >
                  <SelectTrigger className="w-[150px]" id="select-editor-theme">
                    <SelectValue defaultValue={tempSettings.theme} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="vs-dark">VS Dark</SelectItem>
                      <SelectItem value="tomorrow-night">
                        Tomorrow Night
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="">
              <Button
                onClick={() => {
                  setSettings(tempSettings);
                  saveEditorSettingsLocal(tempSettings);
                  setOpen(false);
                }}
                type="submit"
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="h-full w-full">
        <MonacoEditor
          defaultValue="// Write code here"
          height={height}
          language={activeLanguage.toLowerCase()}
          loading={<div>Loading...</div>}
          onChange={(value) => {
            setCode(value || "");
          }}
          onMount={(editor, _monaco) => {
            editorRef.current = editor;
          }}
          options={{
            tabSize: settings.tabSize,
            detectIndentation: false,
            minimap: {
              enabled: false,
            },
            scrollbar: {
              verticalScrollbarSize: 8,
            },
            lineNumbers: settings.lineNumbers,
            padding: {
              top: 10,
            },
            fontSize: settings.fontSize,
          }}
          theme={settings.theme}
          value={code}
          width={width}
        />
      </div>
    </div>
  );
}
