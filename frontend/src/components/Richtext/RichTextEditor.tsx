"use client";

import { Input } from "@mantine/core";
import { Link as RichTextLink, RichTextEditor as TipTapEditor } from "@mantine/tiptap";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMemo } from "react";

interface RichTextEditorProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: any;
}

const RichTextEditor = ({ label, value, onChange, error }: RichTextEditorProps) => {
  const parsedContent = useMemo(() => {
    try {
      return JSON.parse(value ?? "") as JSONContent;
    } catch (e) {
      console.error(e);
      return null;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const editor = useEditor({
    immediatelyRender: true,
    extensions: [
      StarterKit,
      RichTextLink,
      Underline,
      Highlight,
      Superscript,
      SubScript,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: parsedContent,

    onUpdate: ({ editor }) => {
      if (onChange) onChange(JSON.stringify(editor.getJSON()));
    },
  });

  return (
    <Input.Wrapper label={label} error={error}>
      <TipTapEditor editor={editor}>
        <TipTapEditor.Toolbar sticky stickyOffset={60}>
          <TipTapEditor.ControlsGroup>
            <TipTapEditor.Bold />
            <TipTapEditor.Italic />
            <TipTapEditor.Underline />
            <TipTapEditor.Strikethrough />
            <TipTapEditor.Highlight />
          </TipTapEditor.ControlsGroup>

          <TipTapEditor.ControlsGroup>
            <TipTapEditor.ClearFormatting />
          </TipTapEditor.ControlsGroup>

          <TipTapEditor.ControlsGroup>
            <TipTapEditor.H1 />
            <TipTapEditor.H2 />
            <TipTapEditor.H3 />
            <TipTapEditor.H4 />
            <TipTapEditor.H5 />
            <TipTapEditor.H6 />
          </TipTapEditor.ControlsGroup>

          <TipTapEditor.ControlsGroup>
            <TipTapEditor.Blockquote />
            <TipTapEditor.Hr />
            <TipTapEditor.BulletList />
            <TipTapEditor.OrderedList />
            <TipTapEditor.Subscript />
            <TipTapEditor.Superscript />
          </TipTapEditor.ControlsGroup>

          <TipTapEditor.ControlsGroup>
            <TipTapEditor.Link />
            <TipTapEditor.Unlink />
          </TipTapEditor.ControlsGroup>

          <TipTapEditor.ControlsGroup>
            <TipTapEditor.AlignLeft />
            <TipTapEditor.AlignCenter />
            <TipTapEditor.AlignRight />
            <TipTapEditor.AlignJustify />
          </TipTapEditor.ControlsGroup>

          <TipTapEditor.ControlsGroup>
            <TipTapEditor.ColorPicker
              colors={[
                "#25262b",
                "#868e96",
                "#fa5252",
                "#e64980",
                "#be4bdb",
                "#7950f2",
                "#4c6ef5",
                "#228be6",
                "#15aabf",
                "#12b886",
                "#40c057",
                "#82c91e",
                "#fab005",
                "#fd7e14",
              ]}
            />
          </TipTapEditor.ControlsGroup>
          <TipTapEditor.ControlsGroup>
            <TipTapEditor.Undo />
            <TipTapEditor.Redo />
          </TipTapEditor.ControlsGroup>
        </TipTapEditor.Toolbar>

        <TipTapEditor.Content />
      </TipTapEditor>
    </Input.Wrapper>
  );
};

export default RichTextEditor;
