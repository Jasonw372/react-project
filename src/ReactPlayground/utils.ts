import {strFromU8, strToU8, unzipSync, unzlibSync, zlibSync} from "fflate";

export const fileName2Language = (fileName: string) => {
  const ext = fileName.split('.').pop()
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'typescript'
    case 'js':
    case 'jsx':
      return 'javascript'
    case 'less':
      return 'less'
    case 'css':
      return 'css'
    case 'json':
      return 'json'
    default:
      return 'plaintext'
  }
}

export function compress(data: string): string {
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, {level: 9})
  const binary = strFromU8(zipped, true)
  return btoa(binary)
}

export function uncompress(base64: string): string {
  const binary = atob(base64)
  const buffer = strToU8(binary, true)
  const unzipped = unzlibSync(buffer)
  return strFromU8(unzipped)
}