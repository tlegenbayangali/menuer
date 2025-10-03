import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'
import { AssignIngredientsDialog } from '@/components/dishes/assign-ingredients-dialog'
import { IngredientQuantityEdit } from '@/components/dishes/ingredient-quantity-edit'
import { AddIngredientDialog } from '@/components/dishes/add-ingredient-dialog'
import { DishPageWrapper } from '@/components/dishes/dish-page-wrapper'
import DOMPurify from 'dompurify'

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
    <DishPageWrapper dishId={id}>
    <div className="p-8">
      <Link href="/dishes">
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к блюдам
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Description */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{dish.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {dish.description ? (
                <div
                  className="prose prose-sm max-w-none dark:prose-invert [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dish.description) }}
                />
              ) : (
                <p className="text-muted-foreground">Нет описания</p>
              )}
            </CardContent>
          </Card>

          {usedInMenus.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Используется в меню</CardTitle>
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
        </div>

        {/* Right column - Ingredients */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Ингредиенты</CardTitle>
                <CardDescription className="text-sm">Состав блюда</CardDescription>
              </div>
              <div className="flex gap-2">
                <AddIngredientDialog dishId={id}>
                  <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить
                  </Button>
                </AddIngredientDialog>
                <AssignIngredientsDialog dishId={id} currentIngredients={ingredients as any[]}>
                  <Button size="sm" variant="outline">Управление</Button>
                </AssignIngredientsDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {ingredients.length === 0 ? (
              <p className="text-muted-foreground">
                Нет ингредиентов. Добавьте ингредиенты, чтобы начать.
              </p>
            ) : (
              <div className="space-y-3">
                {ingredients.map((ingredient: any) => (
                  <IngredientQuantityEdit
                    key={ingredient.id}
                    dishId={id}
                    ingredientId={ingredient.id}
                    currentQuantity={ingredient.quantity || 0}
                    unit={ingredient.unit}
                    ingredientName={ingredient.name}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </DishPageWrapper>
  )
}