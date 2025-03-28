import { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, ShoppingCart, Package, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { getRecentOrders, getTopProducts, getDashboardStats } from "@/lib/admin-data"
import DashboardChart from "@/components/admin/dashboard-chart"
import RecentOrdersTable from "@/components/admin/recent-orders-table"
import TopProductsTable from "@/components/admin/top-products-table"
import MigrationGuide from "@/components/migration-guide"
import SetupGuide from "@/components/setup-guide"
import MigrateDbButton from "@/components/admin/migrate-db-button"

export const metadata: Metadata = {
  title: "Admin Dashboard | MINISHOP",
  description: "Painel administrativo da loja MINISHOP",
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  const isSuperAdmin = session?.user?.role === "superadmin"

  // Adicionando tratamento de erro para as funções
  let stats = {
    totalSales: 0,
    salesGrowth: 0,
    totalOrders: 0,
    ordersGrowth: 0,
    totalProducts: 0,
    activeProducts: 0,
    totalUsers: 0,
    usersGrowth: 0,
  }

  let recentOrders = []
  let topProducts = []

  try {
    stats = await getDashboardStats()
  } catch (error) {
    console.error("Erro ao carregar estatísticas:", error)
  }

  try {
    recentOrders = await getRecentOrders()
  } catch (error) {
    console.error("Erro ao carregar pedidos recentes:", error)
  }

  try {
    topProducts = await getTopProducts()
  } catch (error) {
    console.error("Erro ao carregar produtos populares:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {isSuperAdmin && process.env.NODE_ENV !== "production" && (
          <div className="flex justify-end">
            <MigrateDbButton />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <MigrationGuide />
        <SetupGuide />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vendas Totais</p>
                <h3 className="text-2xl font-bold mt-1">R$ {stats.totalSales.toLocaleString("pt-BR")}</h3>
              </div>
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {stats.salesGrowth > 0 ? (
                <>
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500 font-medium">+{stats.salesGrowth}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                  <span className="text-red-500 font-medium">{stats.salesGrowth}%</span>
                </>
              )}
              <span className="ml-1 text-muted-foreground">desde o mês passado</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pedidos</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalOrders}</h3>
              </div>
              <div className="rounded-full bg-blue-500/10 p-3 text-blue-500">
                <ShoppingCart className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {stats.ordersGrowth > 0 ? (
                <>
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500 font-medium">+{stats.ordersGrowth}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                  <span className="text-red-500 font-medium">{stats.ordersGrowth}%</span>
                </>
              )}
              <span className="ml-1 text-muted-foreground">desde o mês passado</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Produtos</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalProducts}</h3>
              </div>
              <div className="rounded-full bg-orange-500/10 p-3 text-orange-500">
                <Package className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-muted-foreground">{stats.activeProducts} produtos disponíveis</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Usuários</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalUsers}</h3>
              </div>
              <div className="rounded-full bg-purple-500/10 p-3 text-purple-500">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {stats.usersGrowth > 0 ? (
                <>
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500 font-medium">+{stats.usersGrowth}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                  <span className="text-red-500 font-medium">{stats.usersGrowth}%</span>
                </>
              )}
              <span className="ml-1 text-muted-foreground">desde o mês passado</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Visão Geral de Vendas</CardTitle>
            <CardDescription>Vendas dos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardChart />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Pedidos Recentes</TabsTrigger>
          <TabsTrigger value="products">Produtos Mais Vendidos</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recentes</CardTitle>
              <CardDescription>Lista dos últimos pedidos realizados na loja</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentOrdersTable orders={recentOrders} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
              <CardDescription>Produtos com maior volume de vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <TopProductsTable products={topProducts} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

