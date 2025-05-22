"use client"

import type React from "react"

import { useDrop } from "react-dnd"
import type { Element } from "@/lib/types"
import { CanvasElement } from "@/components/canvas-element"

interface EditorCanvasProps {
  elements: Element[]
  selectedElement: Element | null
  onSelectElement: (element: Element | null) => void
  onMoveElement: (id: string, x: number, y: number) => void
  onDeleteElement: (id: string) => void
}

export function EditorCanvas({
  elements,
  selectedElement,
  onSelectElement,
  onMoveElement,
  onDeleteElement,
}: EditorCanvasProps) {
  const [, drop] = useDrop(() => ({
    accept: "element",
    drop: (_, monitor) => {
      const offset = monitor.getClientOffset()
      const canvasRect = document.getElementById("canvas")?.getBoundingClientRect()

      if (offset && canvasRect) {
        return {
          x: offset.x - canvasRect.left,
          y: offset.y - canvasRect.top,
        }
      }
      return { x: 0, y: 0 }
    },
  }))

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      onSelectElement(null)
    }
  }

  return (
    <div
      id="canvas"
      ref={drop}
      className="relative w-full h-full min-h-[600px] bg-white border rounded-lg shadow-sm overflow-auto"
      onClick={handleCanvasClick}
    >
      {elements.map((element) => (
        <CanvasElement
          key={element.id}
          element={element}
          isSelected={selectedElement?.id === element.id}
          onSelect={() => onSelectElement(element)}
          onMove={onMoveElement}
          onDelete={onDeleteElement}
        />
      ))}
    </div>
  )
}
