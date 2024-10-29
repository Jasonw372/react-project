import MonacoEditor, {EditorProps, OnMount} from '@monaco-editor/react'
import { editor } from "monaco-editor";
import {createATA} from "./Editor/ata.ts";

export interface EditorFile {
  name: string,
  value: string,
  language: string
}

interface Props {
  file: EditorFile,
  onChange?: EditorProps['onChange'],
  options?: editor.IStandaloneEditorConstructionOptions
}

export default function Editor({file, onChange, options}: Props) {
  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction('editor.action.formatDocument')?.run().then(() => {
        const code = editor.getValue();
        const cleanedCode = code.replace(/^\s*[\r\n]/gm, '');
        editor.setValue(cleanedCode);
      })
      // let actions = editor.getSupportedActions().map((a) => a.id);
      // console.log(actions);
    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true,
    })

    const ata = createATA((code, path) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`)
    })

    editor.onDidChangeModelContent(() => {
      ata(editor.getValue());
    });

    ata(editor.getValue());
  }

  return <MonacoEditor
    height={'100%'}
    path={file.name}
    language={file.language}
    onMount={handleEditorMount}
    onChange={onChange}
    value={file.value}
    options={
      {
        fontSize: 16,
        fontFamily: "Consolas",
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false,
        },
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
        ...options
      }
    }
  />
}
