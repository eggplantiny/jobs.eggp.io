export function removeTags(html: string, tagNames: string[]): string {
  const regex = new RegExp(`<(${tagNames.join('|')})\\b[^<]*(?:(?!<\\/${tagNames.join('|')}>)<[^<]*)*<\\/${tagNames.join('|')}>`, 'gi')
  return html.replace(regex, '')
}

export function minimizeWhitespace(html: string): string {
  const regex = />(\s+)(?=<)/g
  const cleanedHtml = html.replace(regex, '>')
  return cleanedHtml.replace(/\s*\n\s*/g, '')
}

export function removeJavascriptComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
}

export function removeHtmlComments(code: string): string {
  return code.replace(/<!--[\s\S]*?-->/g, '')
}

export function removeAttributes(html: string, attributes: string[]): string {
  const attributeRegex = new RegExp(`\\b(${attributes.join('|')})="[^"]*"`, 'gi')
  return html.replace(attributeRegex, '')
}
