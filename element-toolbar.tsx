"use client"

import type React from "react"

import { useDrag } from "react-dnd"
import { Type, ImageIcon, Square, MousePointer, Heading, ListOrdered, FormInput } from "lucide-react"
import { ElementType, type Element } from "@/lib/types"
import { generateId } from "@/lib/utils"

interface ElementToolbarProps {
  onAddElement: (element: Element) => void
}

export function ElementToolbar({ onAddElement }: ElementToolbarProps) {
  return (
    <div className="w-64 border-r bg-white p-4 flex flex-col gap-2 overflow-y-auto">
      <h2 className="font-semibold mb-2">Elements</h2>
      <DraggableElement
        type={ElementType.Heading}
        icon={<Heading size={16} />}
        label="Heading"
        onAddElement={onAddElement}
      />
      <DraggableElement
        type={ElementType.Paragraph}
        icon={<Type size={16} />}
        label="Paragraph"
        onAddElement={onAddElement}
      />
      <DraggableElement
        type={ElementType.Image}
        icon={<ImageIcon size={16} />}
        label="Image"
        onAddElement={onAddElement}
      />
      <DraggableElement
        type={ElementType.Button}
        icon={<MousePointer size={16} />}
        label="Button"
        onAddElement={onAddElement}
      />
      <DraggableElement
        type={ElementType.Container}
        icon={<Square size={16} />}
        label="Container"
        onAddElement={onAddElement}
      />
      <DraggableElement
        type={ElementType.List}
        icon={<ListOrdered size={16} />}
        label="List"
        onAddElement={onAddElement}
      />
      <DraggableElement
        type={ElementType.Input}
        icon={<FormInput size={16} />}
        label="Input"
        onAddElement={onAddElement}
      />
    </div>
  )
}

interface DraggableElementProps {
  type: ElementType
  icon: React.ReactNode
  label: string
  onAddElement: (element: Element) => void
}

function DraggableElement({ type, icon, label, onAddElement }: DraggableElementProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "element",
    item: { type },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ x: number; y: number }>()
      if (item && dropResult) {
        const newElement: Element = {
          id: generateId(),
          type,
          position: { x: dropResult.x, y: dropResult.y },
          properties: getDefaultProperties(type),
        }
        onAddElement(newElement)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`flex items-center gap-2 p-2 border rounded cursor-move hover:bg-slate-50 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  )
}

function getDefaultProperties(type: ElementType) {
  switch (type) {
    case ElementType.Heading:
      return { text: "Heading", level: "h2", align: "left" }
    case ElementType.Paragraph:
      return { text: "This is a paragraph of text.", align: "left" }
    case ElementType.Image:
      return { src: "/placeholder.svg?height=200&width=300", alt: "Image", width: 300, height: 200 }
    case ElementType.Button:
      return { text: "Button", variant: "default", size: "default" }
    case ElementType.Container:
      return { width: 400, height: 200, backgroundColor: "#f8f9fa", padding: 16 }
    case ElementType.List:
      return { items: ["Item 1", "Item 2", "Item 3"], type: "unordered" }
    case ElementType.Input:
      return { placeholder: "Enter text...", label: "Input", required: false }
    default:
      return {}
  }
}
