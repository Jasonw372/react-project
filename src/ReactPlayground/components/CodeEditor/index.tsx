import Editor from "./Editor";
import FileNameList from "./FileNameList";
import {useContext, useEffect, useState} from "react";
import {PlaygroundContext} from "../../PlaygroundContext.tsx";
import {debounce} from "lodash-es";

export default function CodeEditor() {
  const {files, selectedFileName, setFiles} = useContext(PlaygroundContext)
  const file = files[selectedFileName]

  function onEditorChange(value?: string) {
    files[file.name].value = value!
    setFiles({...files})
  }

  const {theme} = useContext(PlaygroundContext)

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <FileNameList/>
      <Editor file={file} onChange={debounce(onEditorChange, 500)} options={{
        theme: `vs-${theme}`
      }}/>
    </div>
  )
}
