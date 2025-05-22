export enum ElementType {
  Heading = "heading",
  Paragraph = "paragraph",
  Image = "image",
  Button = "button",
  Container = "container",
  List = "list",
  Input = "input",
}

export interface Element {
  id: string
  type: ElementType
  position: {
    x: number
    y: number
  }
  properties: any
}
