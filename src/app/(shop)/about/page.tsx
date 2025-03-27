import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sobre | MINISHOP",
  description: "Conheça nossa história e missão"
}

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sobre o MINISHOP</h1>
        
        <section className="bg-card p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Nossa História</h2>
          <p className="text-muted-foreground mb-4">
            O MINISHOP foi fundado em 2023 com uma missão clara: revolucionar o comércio eletrônico, oferecendo uma plataforma onde qualquer pessoa pode criar sua própria loja online em minutos, sem a necessidade de conhecimentos técnicos avançados.
          </p>
          <p className="text-muted-foreground">
            Nossa equipe é composta por especialistas apaixonados por tecnologia e comércio digital, sempre buscando inovar e oferecer as melhores soluções para vendedores e compradores.
          </p>
        </section>
        
        <section className="bg-card p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Nossa Missão</h2>
          <p className="text-muted-foreground">
            Democratizar o acesso ao comércio eletrônico, permitindo que pequenos empreendedores possam competir no mercado digital com as mesmas ferramentas e recursos das grandes empresas.
          </p>
        </section>
        
        <section className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Nossos Valores</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Simplicidade: Tornar tecnologias complexas acessíveis a todos</li>
            <li>Inovação: Buscar constantemente novas soluções e melhorias</li>
            <li>Transparência: Comunicação clara e honesta com clientes e parceiros</li>
            <li>Comunidade: Criar um ecossistema onde todos possam crescer juntos</li>
            <li>Qualidade: Compromisso com a excelência em todos os aspectos</li>
          </ul>
        </section>
      </div>
    </div>
  )
} 