import {transform} from "@babel/standalone";
import {Files, File} from "../../PlaygroundContext.tsx";
import {ENTRY_FILE_NAME} from "../../files.ts";
import {PluginObj} from "@babel/core";
import {renderLess} from "../../../lessLoder";

export const beforeTransformCode = (filename: string, code: string) => {
  let _code = code
  const regexReact = /import\s+React/g
  if ((filename.endsWith('.jsx') || filename.endsWith('.tsx')) && !regexReact.test(code)) {
    _code = `import React from 'react';\n${code}`
  }
  return _code
}
export const babelTransform = (filename: string, code: string, files: Files) => {
  const _code = beforeTransformCode(filename, code);
  let result = transform(_code, {
    presets: ['react', 'typescript'],
    filename,
    plugins: [customResolver(files)],
    retainLines: true
  }).code!

  return result
}

const getModuleFile = (files: Files, modulePath: string): File => {
  let moduleName = modulePath.split("./").pop() || ""
  if (!moduleName.includes(".")) {
    const realModuleName = Object.keys(files).filter(key => {
      return key.endsWith('.ts')
        || key.endsWith('.tsx')
        || key.endsWith('.js')
        || key.endsWith('.jsx')
    }).find((key) => {
      return key.split(".").includes(moduleName)
    })
    if (realModuleName) {
      moduleName = realModuleName
    }
  }
  return files[moduleName]
}

const json2js = (file: File) => {
  const js = `export default ${file.value}`
  return URL.createObjectURL(new Blob([js], {type: "application/javascript"}))
}

const css2js = (file: File) => {
  const randomId = new Date().getTime()
  const js = `
(() => {
    const stylesheet = document.createElement('style')
    stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
    document.head.appendChild(stylesheet)

    const styles = document.createTextNode(\`${file.value}\`)
    stylesheet.innerHTML = ''
    stylesheet.appendChild(styles)
})()`
  return URL.createObjectURL(new Blob([js], {type: "application/javascript"}))
}
const less2js = (file: File) => {
  const randomId = new Date().getTime()
  const value = file.babelResult!.css
  const js = `
(() => {
    const stylesheet = document.createElement('style')
    stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
    document.head.appendChild(stylesheet)

    const styles = document.createTextNode(\`${value}\`)
    stylesheet.innerHTML = ''
    stylesheet.appendChild(styles)
})()`
  return URL.createObjectURL(new Blob([js], {type: "application/javascript"}))
}

function customResolver(files: Files): PluginObj {
  return {
    visitor: {
      ImportDeclaration(path) {
        const modulePath = path.node.source.value
        if (modulePath.startsWith(".")) {
          const file = getModuleFile(files, modulePath)
          if (!file) return
          if (file.name.endsWith(".less")) {
            path.node.source.value = less2js(file)
          } else if (file.name.endsWith(".css")) {
            path.node.source.value = css2js(file)
          } else if (file.name.endsWith(".json")) {
            path.node.source.value = json2js(file)
          } else {
            path.node.source.value = URL.createObjectURL(
              new Blob([babelTransform(file.name, file.value, files)], {
                type: 'application/javascript',
              })
            )
          }
        }
      },
    },
  }
}

async function prepareFiles(files: Files) {
  const processFiles = async (files: Files) => {
    const filePromises = Object.keys(files).map(async (name) => {
      if (name.endsWith(".less")) {
        files[name].babelResult = await renderLess(files[name].value);
      }
      return files[name];
    });

    await Promise.all(filePromises);
    return files;
  };
}

export const compile = async (files: Files) => {
  const main = files[ENTRY_FILE_NAME]
  await prepareFiles(files)
  return babelTransform(ENTRY_FILE_NAME, main.value, files)
}

self.addEventListener('message', async ({data}) => {
  try {
    const res = await compile(data)
    self.postMessage({
      type: 'COMPILED_CODE',
      data: res
    })
  } catch (e) {
    self.postMessage({type: 'ERROR', error: e})
  }
})
