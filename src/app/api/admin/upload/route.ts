import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { v4 as uuidv4 } from "uuid"
import { put } from "@vercel/blob"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar se o usuário está autenticado e é um administrador
    if (!session || session.user?.email !== "admin@jondev.com") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Verificar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "O arquivo deve ser uma imagem" }, { status: 400 })
    }

    // Gerar um nome único para o arquivo
    const fileName = `${uuidv4()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`

    try {
      // Tentar fazer upload para o Vercel Blob
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(fileName, file, {
          access: "public",
          contentType: file.type,
        })

        // Retornar o URL da imagem
        return NextResponse.json({
          success: true,
          url: blob.url,
        })
      } else {
        // Fallback para salvar localmente
        // Criar diretório de uploads se não existir
        const uploadsDir = path.join(process.cwd(), "public/uploads")

        try {
          // Converter o arquivo para um buffer
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)

          // Salvar o arquivo no diretório public/uploads
          const filePath = path.join(uploadsDir, fileName)
          await writeFile(filePath, buffer)

          // Retornar o caminho relativo para o arquivo
          const fileUrl = `/uploads/${fileName}`

          return NextResponse.json({
            success: true,
            url: fileUrl,
          })
        } catch (fsError) {
          console.error("ERRO_SALVAR_ARQUIVO_LOCAL", fsError)
          throw new Error("Erro ao salvar arquivo localmente")
        }
      }
    } catch (uploadError) {
      console.error("ERRO_UPLOAD", uploadError)

      // Fallback para placeholder se o upload falhar
      let dimensions = "600x600"
      if (file.name.includes("banner")) {
        dimensions = "1200x400"
      } else if (file.name.includes("category")) {
        dimensions = "600x400"
      }

      const imageUrl = `/placeholder.svg?height=${dimensions.split("x")[0]}&width=${dimensions.split("x")[1]}&text=${encodeURIComponent(file.name)}`

      return NextResponse.json({
        success: true,
        url: imageUrl,
        fallback: true,
        error: uploadError instanceof Error ? uploadError.message : "Erro desconhecido no upload",
      })
    }
  } catch (error) {
    console.error("ERRO_UPLOAD_IMAGEM", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

