import { createEffect, onCleanup, onMount } from "solid-js";
import type { Component } from "solid-js";
import loader from "@monaco-editor/loader";
import type { editor as MonacoEditorNS } from "monaco-editor";

interface MonacoEditorProps {
  value?: string;
  language?: string;
  theme?: string;
  onChange?: (value: string) => void;
  options?: MonacoEditorNS.IStandaloneEditorConstructionOptions;
  class?: string;
}

const MonacoEditor: Component<MonacoEditorProps> = (props) => {
  let container: HTMLDivElement | undefined;
  let editorInstance: MonacoEditorNS.IStandaloneCodeEditor | undefined;
  let monaco: typeof import("monaco-editor") | undefined;
  let suppressChange = false;

  onMount(async () => {
    monaco = await loader.init();

    if (!container) {
      return;
    }

    editorInstance = monaco.editor.create(container, {
      value: props.value ?? "",
      language: props.language ?? "plaintext",
      theme: props.theme ?? "vs-dark",
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      smoothScrolling: true,
      wordWrap: "on",
      formatOnType: true,
      formatOnPaste: true,
      ...props.options,
    });

    const disposable = editorInstance.onDidChangeModelContent(() => {
      if (!editorInstance || suppressChange) return;
      const currentValue = editorInstance.getValue();
      props.onChange?.(currentValue);
    });

    onCleanup(() => {
      disposable.dispose();
      editorInstance?.dispose();
    });
  });

  createEffect(() => {
    if (!editorInstance || props.value === undefined) return;
    const editorValue = editorInstance.getValue();
    if (editorValue === props.value) return;

    suppressChange = true;
    const model = editorInstance.getModel();
    const selection = editorInstance.getSelection();
    if (model) {
      const range = model.getFullModelRange();
      editorInstance.executeEdits("set-value", [
        {
          range,
          text: props.value,
        },
      ]);
    } else {
      editorInstance.setValue(props.value);
    }
    if (selection) {
      editorInstance.setSelection(selection);
    }
    suppressChange = false;
  });

  createEffect(() => {
    if (!editorInstance || !monaco || !props.language) return;
    const model = editorInstance.getModel();
    if (!model) return;
    monaco.editor.setModelLanguage(model, props.language);
  });

  createEffect(() => {
    if (!editorInstance || !monaco || !props.theme) return;
    monaco.editor.setTheme(props.theme);
  });

  return (
    <div
      ref={(el) => {
        container = el;
      }}
      class={`${props.class ?? ""}`.trim()}
    />
  );
};

export default MonacoEditor;
