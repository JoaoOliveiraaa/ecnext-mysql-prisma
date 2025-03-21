import Image from "next/image"
import Link from "next/link"
import type { Category } from "@/types"

interface StyleSectionProps {
  categories: Category[]
}

export default function StyleSection({ categories }: StyleSectionProps) {
  return (
    <section className="w-full py-8">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.slice(0, 3).map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group relative overflow-hidden rounded-lg"
          >
            <div className="aspect-[4/3] w-full">
              <Image
                src={category.imageUrl || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h3 className="text-white text-xl font-bold">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

