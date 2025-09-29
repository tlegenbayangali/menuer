import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { IngredientDialog } from '@/components/ingredients/ingredient-dialog'
import { IngredientsTable } from '@/components/ingredients/ingredients-table'

export default async function IngredientsPage() {
  const supabase = await createClient()
  const { data: ingredients } = await supabase
    .from('ingredients')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ингредиенты</h1>
          <p className="text-muted-foreground">
            Управляйте своими ингредиентами
          </p>
        </div>
        <IngredientDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Добавить ингредиент
          </Button>
        </IngredientDialog>
      </div>

      {!ingredients || ingredients.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Нет ингредиентов</CardTitle>
            <CardDescription>
              Начните с добавления вашего первого ингредиента
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="p-6">
          <IngredientsTable ingredients={ingredients} />
        </Card>
      )}
    </div>
  )
}