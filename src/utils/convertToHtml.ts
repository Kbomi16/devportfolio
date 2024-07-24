export const convertToHtml = (text: string) => {
  return text.replace(/(?:\r\n|\r|\n)/g, '<br/>')
}
