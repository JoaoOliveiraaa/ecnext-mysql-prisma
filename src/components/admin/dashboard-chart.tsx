"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Dados de exemplo para o gráfico
const demoData = [
  { date: "01/03", sales: 1200 },
  { date: "02/03", sales: 1800 },
  { date: "03/03", sales: 1600 },
  { date: "04/03", sales: 2200 },
  { date: "05/03", sales: 1900 },
  { date: "06/03", sales: 2400 },
  { date: "07/03", sales: 2100 },
  { date: "08/03", sales: 2800 },
  { date: "09/03", sales: 2600 },
  { date: "10/03", sales: 3100 },
  { date: "11/03", sales: 2900 },
  { date: "12/03", sales: 3300 },
  { date: "13/03", sales: 3200 },
  { date: "14/03", sales: 3500 },
  { date: "15/03", sales: 3800 },
  { date: "16/03", sales: 3600 },
  { date: "17/03", sales: 4000 },
  { date: "18/03", sales: 3900 },
  { date: "19/03", sales: 4200 },
  { date: "20/03", sales: 4100 },
  { date: "21/03", sales: 4500 },
  { date: "22/03", sales: 4300 },
  { date: "23/03", sales: 4700 },
  { date: "24/03", sales: 4600 },
  { date: "25/03", sales: 5000 },
  { date: "26/03", sales: 4800 },
  { date: "27/03", sales: 5200 },
  { date: "28/03", sales: 5100 },
  { date: "29/03", sales: 5500 },
  { date: "30/03", sales: 5300 },
]

export default function DashboardChart() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-[300px] flex items-center justify-center">Carregando gráfico...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={demoData}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `R$${value}`}
        />
        <Tooltip formatter={(value: number) => [`R$${value}`, "Vendas"]} labelFormatter={(label) => `Data: ${label}`} />
        <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

