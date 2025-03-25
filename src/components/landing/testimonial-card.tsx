import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Quote } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
}

export default function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6">
        <Quote className="h-8 w-8 text-muted-foreground/50 mb-2" />
        <p className="text-sm leading-relaxed">{quote}</p>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-4">
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </CardFooter>
    </Card>
  )
}

