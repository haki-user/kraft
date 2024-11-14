"use client";

import { Editor as MonacoEditor } from "@monaco-editor/react";
import { useState } from "react";
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

interface EditorProps {
  width?: number | string;
  height?: number | string;
  editorSettings?: EditorSettings;
}

interface EditorSettings {
  keyBindings: "normal" | "vim";
  lineNumbers: "on" | "off" | "relative";
  tabSize: number;
}

export default function Editor({
  width,
  height,
  editorSettings = { keyBindings: "normal", lineNumbers: "on", tabSize: 2 },
}: EditorProps): JSX.Element {
  const languages = ["C++", "JavaScript", "TypeScript", "Go", "Python"];
  const [activeLanguage, setActiveLanguage] = useState("JavaScript");
  const [code, setCode] = useState<string>("");
  const [settings, setSettings] = useState<EditorSettings>(editorSettings);
  const [tempSettings, setTempSettings] = useState<EditorSettings>(settings);
  const [open, setOpen] = useState(false);
  console.log(editorSettings, tempSettings);

  return (
    <div className="border-[1px] border-solid">
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
              {/* eslint-disable-next-line react/jsx-pascal-case -- figure out solution for it */}
              <Icons.settings />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
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
                      <SelectItem value="vim">Vim</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-5 items-center justify-between">
                <Label
                  className="text-right text-nowrap"
                  htmlFor="select-key-bindings"
                >
                  Tab size
                </Label>
                <Input
                  className="w-24"
                  onChange={(e) => {
                    setTempSettings({
                      ...tempSettings,
                      tabSize: parseInt(e.target.value),
                    });
                  }}
                  type="number"
                  value={tempSettings.tabSize}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  setSettings(tempSettings);
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
      <div>
        <MonacoEditor
          beforeMount={(monaco) => {
            void import("monaco-themes/themes/Tomorrow-Night.json").then(
              (data) => {
                monaco.editor.defineTheme("tomorrow-night", data as never);
                monaco.editor.setTheme("tomorrow-night");
              }
            );
          }}
          defaultLanguage="javascript"
          defaultValue="// Write code here"
          height={height || "90vh"}
          // language={activeLanguage.toLowerCase()}
          onChange={(value) => {
            setCode(value || "");
          }}
          options={{
            tabSize: settings.tabSize,
            detectIndentation: false,
            theme: "tomorrow-night",
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
            // fontSize: 14,
            // fontFamily: "Fira Code",
          }}
          theme="tomorrow-night"
          value={code}
          width={width}
        />
      </div>
    </div>
  );
}
