import logoSVG from "./icons/logo.svg"
import styles from "./index.module.scss"
import {DownloadOutlined, MoonOutlined, ShareAltOutlined, SunOutlined} from "@ant-design/icons"
import {useContext} from "react";
import {Files, PlaygroundContext} from "../../PlaygroundContext.tsx";
import copy from "copy-to-clipboard";
import {message} from "antd";
import JSZip from "jszip";
import {saveAs} from "file-saver";

export default function Header() {

  const {theme, setTheme, files} = useContext(PlaygroundContext)

  const downloadFiles = async (files: Files) => {
    const zip = new JSZip()

    Object.keys(files).forEach(name => {
      zip.file(name, files[name].value)
    })

    const blob = await zip.generateAsync({type: "blob"})
    saveAs(blob, `code${Math.random().toString().slice(2, 8)}.zip`)
  }

  return <div className={styles.header}>
    <div className={styles.logo}>
      <img src={logoSVG} alt="logo"/>
      <span>React Playground</span>
    </div>
    <div className={styles.links}>
      {theme === 'light' && (
        <MoonOutlined
          title='切换暗色主题'
          className={styles.theme}
          onClick={() => setTheme('dark')}
        />
      )}
      {theme === 'dark' && (
        <SunOutlined
          title='切换亮色主题'
          className={styles.theme}
          onClick={() => setTheme('light')}
        />
      )}
      <ShareAltOutlined
        style={{marginLeft: '10px'}}
        onClick={() => {
          copy(window.location.href);
          message.success('分享链接已复制。')
        }}
      />
      <DownloadOutlined
        style={{marginLeft: '10px'}}
        onClick={async () => {
          await downloadFiles(files)
          message.success("下载成功")
        }}
      >
      </DownloadOutlined>
    </div>
  </div>
}
