"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { Toaster } from "@/components/toast"
import { useToast } from "@/hooks/use-toast"

interface ToastContextType {
  toast: (props: { title: string; description?: string; variant?: "default" | "destructive" }) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToastContext() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider")
  }
  return context
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, toast, dismiss } = useToast()

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toaster toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  )
}

