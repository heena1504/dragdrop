"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { type Element, ElementType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import type { JSX } from "react/jsx-runtime"

interface CanvasElementProps {
  element: Element
  isSelected: boolean
  onSelect: () => void
  onMove: (id: string, x: number, y: number) => void
  onDelete: (id: string) => void
}

export function CanvasElement({ element, isSelected, onSelect, onMove, onDelete }: CanvasElementProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(element.position)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setPosition(element.position)
  }, [element.position])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSelected) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      setPosition({ x: newX, y: newY })
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      onMove(element.id, position.x, position.y)
    }
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragStart])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(element.id)
  }

  return (
    <div
      ref={ref}
      className={`absolute cursor-move ${isSelected ? "outline outline-2 outline-blue-500" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: isSelected ? 10 : 1,
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      <ElementRenderer element={element} />

      {isSelected && (
        <div className="absolute -top-8 right-0 flex gap-1">
          <Button variant="destructive" size="icon" className="h-6 w-6" onClick={handleDelete}>
            <Trash2 size={14} />
          </Button>
        </div>
      )}
    </div>
  )
}

interface ElementRendererProps {
  element: Element
}

function ElementRenderer({ element }: ElementRendererProps) {
  const { type, properties } = element

  switch (type) {
    case ElementType.Heading:
      return renderHeading(properties)
    case ElementType.Paragraph:
      return renderParagraph(properties)
    case ElementType.Image:
      return renderImage(properties)
    case ElementType.Button:
      return renderButton(properties)
    case ElementType.Container:
      return renderContainer(properties)
    case ElementType.List:
      return renderList(properties)
    case ElementType.Input:
      return renderInput(properties)
    default:
      return <div>Unknown element type</div>
  }
}

function renderHeading(props: any) {
  const { text, level, align } = props
  const Tag = level as keyof JSX.IntrinsicElements

  return (
    <Tag className={`font-bold text-${align}`} style={{ textAlign: align }}>
      {text}
    </Tag>
  )
}

function renderParagraph(props: any) {
  const { text, align } = props

  return (
    <p className="max-w-md" style={{ textAlign: align }}>
      {text}
    </p>
  )
}

function renderImage(props: any) {
  const { src, alt, width, height } = props

  return <Image src={src || "/placeholder.svg"} alt={alt} width={width} height={height} className="object-cover" />
}

function renderButton(props: any) {
  const { text, variant, size } = props

  return (
    <Button variant={variant} size={size}>
      {text}
    </Button>
  )
}

function renderContainer(props: any) {
  const { width, height, backgroundColor, padding } = props

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor,
        padding: `${padding}px`,
      }}
      className="border border-dashed border-gray-300"
    />
  )
}

function renderList(props: any) {
  const { items, type } = props
  const ListTag = type === "ordered" ? "ol" : "ul"

  return (
    <ListTag className={type === "ordered" ? "list-decimal" : "list-disc"}>
      {items.map((item: string, index: number) => (
        <li key={index}>{item}</li>
      ))}
    </ListTag>
  )
}

function renderInput(props: any) {
  const { placeholder, label, required } = props

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input type="text" placeholder={placeholder} className="px-3 py-2 border rounded w-full" />
    </div>
  )
}
