import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, BookOpen, UtensilsCrossed, Package } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch counts for each entity
  const [
    { count: establishmentsCount },
    { count: menusCount },
    { count: dishesCount },
    { count: ingredientsCount },
  ] = await Promise.all([
    supabase.from('establishments').select('*', { count: 'exact', head: true }),
    supabase.from('menus').select('*', { count: 'exact', head: true }),
    supabase.from('dishes').select('*', { count: 'exact', head: true }),
    supabase.from('ingredients').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    {
      title: 'Заведения',
      value: establishmentsCount || 0,
      icon: Building2,
      description: 'Всего заведений',
    },
    {
      title: 'Меню',
      value: menusCount || 0,
      icon: BookOpen,
      description: 'Всего меню',
    },
    {
      title: 'Блюда',
      value: dishesCount || 0,
      icon: UtensilsCrossed,
      description: 'Всего блюд',
    },
    {
      title: 'Ингредиенты',
      value: ingredientsCount || 0,
      icon: Package,
      description: 'Всего ингредиентов',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Дашборд</h1>
        <p className="text-muted-foreground">
          Добро пожаловать в систему управления меню
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}