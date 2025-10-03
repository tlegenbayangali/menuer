import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { AssignDishesDialog } from '@/components/menus/assign-dishes-dialog'

export default async function MenuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch menu
  const { data: menu } = await supabase
    .from('menus')
    .select('*')
    .eq('id', id)
    .single()

  if (!menu) {
    notFound()
  }

  // Fetch assigned dishes
  const { data: assignedDishes } = await supabase
    .from('menu_dishes')
    .select('dish_id, position, dishes(*)')
    .eq('menu_id', id)
    .order('position', { ascending: true, nullsFirst: false })

  const dishes = assignedDishes?.map(ad => ad.dishes).filter(Boolean) || []

  // Fetch establishments where this menu is used
  const { data: establishments } = await supabase
    .from('establishment_menus')
    .select('establishments(*)')
    .eq('menu_id', id)

  const usedInEstablishments = establishments?.map(e => e.establishments).filter(Boolean) || []

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/menus">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к меню
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{menu.name}</h1>
            {menu.description && (
              <p className="text-muted-foreground">{menu.description}</p>
            )}
            {menu.price && (
              <p className="text-lg font-semibold mt-2">
                {new Intl.NumberFormat('ru-RU').format(menu.price)} ₸
              </p>
            )}
          </div>
          <AssignDishesDialog menuId={id} currentDishes={dishes as any[]}>
            <Button>Управление блюдами</Button>
          </AssignDishesDialog>
        </div>
      </div>

      {usedInEstablishments.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Используется в заведениях</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {usedInEstablishments.map((est: any) => (
                <Link key={est.id} href={`/establishments/${est.id}`}>
                  <Button variant="outline" size="sm">
                    {est.name}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Блюда в меню</CardTitle>
          <CardDescription className="text-sm">
            Блюда, доступные в этом меню
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dishes.length === 0 ? (
            <p className="text-muted-foreground">
              Нет блюд в меню. Добавьте блюда, чтобы начать.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dishes.map((dish: any) => (
                <Link key={dish.id} href={`/dishes/${dish.id}`}>
                  <Card className="hover:bg-accent cursor-pointer transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg">{dish.name}</CardTitle>
                      {dish.description && (
                        <CardDescription>{dish.description}</CardDescription>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}