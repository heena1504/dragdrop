"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ElementToolbar } from "@/components/element-toolbar"
import { EditorCanvas } from "@/components/editor-canvas"
import { PropertyPanel } from "@/components/property-panel"
import type { Element } from "@/lib/types"

export function WebsiteBuilder() {
  const [elements, setElements] = useState<Element[]>([])
  const [selectedElement, setSelectedElement] = useState<Element | null>(null)

  const handleAddElement = (element: Element) => {
    setElements([...elements, element])
  }

  const handleUpdateElement = (updatedElement: Element) => {
    setElements(elements.map((el) => (el.id === updatedElement.id ? updatedElement : el)))
  }

  const handleDeleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id))
    if (selectedElement?.id === id) {
      setSelectedElement(null)
    }
  }

  const handleSelectElement = (element: Element | null) => {
    setSelectedElement(element)
  }

  const handleMoveElement = (id: string, x: number, y: number) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, position: { x, y } } : el)))
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen overflow-hidden">
        <ElementToolbar onAddElement={handleAddElement} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-white">
            <h1 className="text-xl font-bold">Website Builder</h1>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <EditorCanvas
              elements={elements}
              selectedElement={selectedElement}
              onSelectElement={handleSelectElement}
              onMoveElement={handleMoveElement}
              onDeleteElement={handleDeleteElement}
            />
          </div>
        </div>
        <PropertyPanel selectedElement={selectedElement} onUpdateElement={handleUpdateElement} />
      </div>
    </DndProvider>
  )
}
