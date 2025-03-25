"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Banner as BannerType } from "@/types"
import { useState } from "react"

interface BannerProps {
  data: BannerType
}

export default function Banner({ data }: BannerProps) {
  const [imageError, setImageError] = useState(false)

  // Se data for null ou undefined, use um banner padrão
  const bannerData = data || {
    title: "Spring Collection",
    description: "Discover our new arrivals with up to 30% off. Limited time offer.",
    imageUrl: "/placeholder.svg?height=300&width=500",
    primaryButtonText: "Shop Now",
    primaryButtonLink: "/shop",
    secondaryButtonText: "Learn More",
    secondaryButtonLink: "/about",
  }

  const imageSrc = imageError
    ? "/placeholder.svg?height=300&width=500"
    : bannerData.imageUrl || "/placeholder.svg?height=300&width=500"

  return (
    <div className="w-full max-w-7xl px-4 py-6">
      <div className="relative w-full rounded-lg bg-muted overflow-hidden">
        <div className="flex flex-col md:flex-row items-center">
          <div className="p-8 md:p-12 space-y-4 md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold">{bannerData.title}</h1>
            <p className="text-muted-foreground">{bannerData.description}</p>
            <div className="flex gap-4">
              <Button asChild variant="default">
                <Link href={bannerData.primaryButtonLink}>{bannerData.primaryButtonText}</Link>
              </Button>
              {bannerData.secondaryButtonText && bannerData.secondaryButtonLink && (
                <Button asChild variant="outline">
                  <Link href={bannerData.secondaryButtonLink}>{bannerData.secondaryButtonText}</Link>
                </Button>
              )}
            </div>
          </div>
          {bannerData.imageUrl && (
            <div className="md:w-1/2 flex justify-center">
              <div className="relative h-[300px] w-full max-w-[500px]">
                <Image
                  src={imageSrc || "/placeholder.svg"}
                  alt={bannerData.title}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

