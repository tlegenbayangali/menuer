import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { AssignIngredientsDialog } from '@/components/dishes/assign-ingredients-dialog'

export default async function DishDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch dish
  const { data: dish } = await supabase
    .from('dishes')
    .select('*')
    .eq('id', id)
    .single()

  if (!dish) {
    notFound()
  }

  // Fetch assigned ingredients
  const { data: assignedIngredients } = await supabase
    .from('dish_ingredients')
    .select('ingredient_id, quantity, ingredients(*)')
    .eq('dish_id', id)

  const ingredients = assignedIngredients?.map(ai => ({
    ...ai.ingredients,
    quantity: ai.quantity,
  })).filter(Boolean) || []

  // Fetch menus where this dish is used
  const { data: menus } = await supabase
    .from('menu_dishes')
    .select('menus(*)')
    .eq('dish_id', id)

  const usedInMenus = menus?.map(m => m.menus).filter(Boolean) || []

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/dishes">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к блюдам
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{dish.name}</h1>
            {dish.description && (
              <p className="text-muted-foreground">{dish.description}</p>
            )}
          </div>
          <AssignIngredientsDialog dishId={id} currentIngredients={ingredients as any[]}>
            <Button>Управление ингредиентами</Button>
          </AssignIngredientsDialog>
        </div>
      </div>

      {usedInMenus.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Используется в меню</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {usedInMenus.map((menu: any) => (
                <Link key={menu.id} href={`/menus/${menu.id}`}>
                  <Button variant="outline" size="sm">
                    {menu.name}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Ингредиенты</CardTitle>
          <CardDescription>
            Состав блюда
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ingredients.length === 0 ? (
            <p className="text-muted-foreground">
              Нет ингредиентов. Добавьте ингредиенты, чтобы начать.
            </p>
          ) : (
            <div className="space-y-3">
              {ingredients.map((ingredient: any) => (
                <div
                  key={ingredient.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{ingredient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {ingredient.unit}
                    </p>
                  </div>
                  {ingredient.quantity && (
                    <p className="text-sm font-semibold">
                      {ingredient.quantity}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}