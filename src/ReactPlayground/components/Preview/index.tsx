import {useContext, useEffect, useRef, useState} from "react";
import {PlaygroundContext} from "../../PlaygroundContext.tsx";
import CompilerWorker from "./compiler.worker?worker"
import Editor from "../CodeEditor/Editor.tsx";
import iframeRaw from "./iframe.html?raw"
import {IMPORT_MAP_FILE_NAME} from "../../files.ts";
import {Message} from "../Message";

interface MessageData {
  data: {
    type: string
    message: string
  }
}

export default function Preview() {

  const {files} = useContext(PlaygroundContext)
  const [compiledCode, setCompiledCode] = useState('')
  const getIframeUrl = () => {
    const res = iframeRaw.replace(
      '<script type="importmap"></script>',
      `<script type="importmap">${
        files[IMPORT_MAP_FILE_NAME].value
      }</script>`
    ).replace(
      '<script type="module" id="appSrc"></script>',
      `<script type="module" id="appSrc">${compiledCode}</script>`,
    )
    return URL.createObjectURL(new Blob([res], {type: 'text/html'}))
  }
  const [iframeUrl, setIframeUrl] = useState(getIframeUrl())
  const [error, setError] = useState("")
  const handleMessage = (msg: MessageData) => {
    const {type, message} = msg.data
    if (type === 'ERROR') {
      setError(message)
    } else if (type === "LOADED") {
      setError("")
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, []);
  const compilerWorkerRef = useRef<Worker>()
  useEffect(() => {
    if (!compilerWorkerRef.current) {
      compilerWorkerRef.current = new CompilerWorker()
      compilerWorkerRef.current?.addEventListener("message", ({data}) => {
        if (data.type === "COMPILED_CODE") {
          setCompiledCode(data.data)
        } else if (data.type === "ERROR") {
          setError(data.error)
        }
      })
    }
  }, [])

  useEffect(() => {
    // const res = compile(files);
    // setCompiledCode(res);
    compilerWorkerRef.current?.postMessage(files)
  }, [files]);

  useEffect(() => {
    setIframeUrl(getIframeUrl())
    // eslint-disable-next-line
  }, [files[IMPORT_MAP_FILE_NAME].value, compiledCode]);


  return <div style={{height: "100%"}}>
    <iframe
      src={iframeUrl}
      style={{
        width: '100%',
        height: '100%',
        padding: 0,
        border: 'none',
      }}
    />
    <Message type={"error"} content={error}/>
    {/* <Editor file={{
            name: 'dist.js',
            value: compiledCode,
            language: 'javascript'
        }}/> */}
  </div>
}
