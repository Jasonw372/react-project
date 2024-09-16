import importMap from './template/import-map.json?raw'
import AppLess from './template/App.less?raw'
import App from './template/App.tsx?raw'
import main from './template/main.tsx?raw'
import {Files} from "./PlaygroundContext.tsx";
import {fileName2Language} from "./utils.ts";

export const APP_COMPONENT_FILE_NAME = "App.tsx"
export const IMPORT_MAP_FILE_NAME = "import-map.json"
export const ENTRY_FILE_NAME = "main.tsx"

export const initFiles: Files = {
  [ENTRY_FILE_NAME]: {
    name: ENTRY_FILE_NAME,
    language: fileName2Language(ENTRY_FILE_NAME),
    value: main
  },
  [APP_COMPONENT_FILE_NAME]: {
    name: APP_COMPONENT_FILE_NAME,
    language: fileName2Language(APP_COMPONENT_FILE_NAME),
    value: App,
  },
  'App.less': {
    name: 'App.less',
    language: 'less',
    value: AppLess,
  },
  [IMPORT_MAP_FILE_NAME]: {
    name: IMPORT_MAP_FILE_NAME,
    language: fileName2Language(IMPORT_MAP_FILE_NAME),
    value: importMap,
  },
}