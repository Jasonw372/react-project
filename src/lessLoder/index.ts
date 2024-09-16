// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import lessRoot from "./less-browser/index.js"

const less = lessRoot()

export function renderLess(style: string): Promise<{ css: string }> {
  return less.render(style)
}
