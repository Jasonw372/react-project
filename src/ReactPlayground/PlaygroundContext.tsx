import {createContext, PropsWithChildren, useEffect, useState} from "react";
import {fileName2Language, uncompress, compress} from "./utils.ts";
import {initFiles} from "./files.ts";

export type Theme = 'light' | 'dark'

export interface File {
  name: string,
  value: string,
  language: string
}

export interface Files {
  [key: string]: File
}

export interface PlaygroundContext {
  files: Files,
  selectedFileName: string,
  theme: Theme
  setTheme: (theme: Theme) => void
  setSelectedFileName: (name: string) => void,
  setFiles: (files: Files) => void
  addFile: (name: string) => void
  removeFile: (name: string) => void
  updateFileName: (oldName: string, newName: string) => void
  checkName: (name: string, oldName: string) => boolean
}

export const PlaygroundContext = createContext<PlaygroundContext>({
  selectedFileName: "App.tsx"
} as PlaygroundContext)


export const PlaygroundProvider = ({children}: PropsWithChildren) => {

  const getFilesFromUrl = () => {
    let files: Files | undefined
    try {
      const hash = uncompress(window.location.hash.slice(1))
      files = JSON.parse(hash)
    } catch (e) {
      // console.error(e)
    }
    return files
  }
  const [theme, setTheme] = useState<Theme>("light")
  const [files, setFiles] = useState<Files>(getFilesFromUrl() || initFiles)
  const [selectedFileName, setSelectedFileName] = useState("App.tsx")
  const addFile = (name: string) => {
    files[name] = {
      name,
      language: fileName2Language(name),
      value: ''
    }
    setFiles({...files})
  }

  const removeFile = (name: string) => {
    delete files[name]
    setFiles({...files})
  }
  const checkName = (name: string, oldName: string) => {
    return Object.keys(files).some((key) => key !== oldName && key === name)
  }

  const updateFileName = (oldName: string, newName: string) => {
    if (!files[oldName] || newName === undefined || newName === null) return
    const {[oldName]: value, ...rest} = files
    const newFile = {
      [newName]: {
        ...value,
        language: fileName2Language(newName),
        name: newName
      }
    }
    setFiles({...rest, ...newFile})
  }

  useEffect(() => {
    const hash = JSON.stringify(files)
    window.location.hash = compress(hash)
  }, [files]);


  return (
    <PlaygroundContext.Provider
      value={{
        theme,
        setTheme,
        files,
        selectedFileName,
        setSelectedFileName,
        setFiles,
        addFile,
        removeFile,
        updateFileName,
        checkName
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  )
}