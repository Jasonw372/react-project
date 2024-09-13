import {useContext, useEffect, useState} from "react";
import {PlaygroundContext} from "../../PlaygroundContext.tsx";
import {FileNameItem} from "./FileNameItem.tsx";
import styles from './index.module.scss'
import {APP_COMPONENT_FILE_NAME, ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME} from "../../files.ts";
import {message} from "antd";

export default function FileNameList() {
  const {
    files,
    selectedFileName,
    removeFile,
    addFile,
    updateFileName,
    setSelectedFileName
  } = useContext(PlaygroundContext)

  const [tabs, setTabs] = useState([''])

  useEffect(() => {
      setTabs(Object.keys(files))
    }, [files]
  )

  const handleEditComplete = (name: string, prevName: string) => {
    updateFileName(prevName, name)
    setSelectedFileName(name)
    setCreating(false)
  }

  const [creating, setCreating] = useState(false)

  const addTab = () => {
    addFile(`Comp${Math.random().toString().slice(2, 6)}.tsx`)
    setCreating(true)
  }

  const handleRemove = (name: string) => {
    removeFile(name)
    setSelectedFileName(ENTRY_FILE_NAME)
  }

  const readonlyFileNames = [ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME, APP_COMPONENT_FILE_NAME]

  return <div className={styles.tabs}>{
    tabs.map((name, index, arr) => <FileNameItem
      key={name + index}
      value={name}
      activated={selectedFileName === name}
      readonly={readonlyFileNames.includes(name)}
      onClick={() => setSelectedFileName(name)}
      onEditComplete={(newName: string) => handleEditComplete(newName, name)}
      creating={creating && index === arr.length - 1}
      onRemove={() => {
        handleRemove(name)
      }}
    >
    </FileNameItem>)
  }
    <div className={styles.add} onClick={addTab}>
      +
    </div>
  </div>
}
