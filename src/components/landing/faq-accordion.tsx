"use client"

import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FaqItem {
  question: string
  answer: string
}

interface FaqAccordionProps {
  items: FaqItem[]
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [mounted, setMounted] = useState(false)
  
  // Prevenir problemas de hidratação montando o componente apenas no cliente
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Renderizar um placeholder durante a hidratação
  if (!mounted) {
    return (
      <div className="w-full">
        {items.map((item, index) => (
          <div key={index} className="border-b last:border-b-0">
            <div className="py-4 font-medium">{item.question}</div>
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left font-medium">{item.question}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

