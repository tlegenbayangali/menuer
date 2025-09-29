import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { DishDialog } from '@/components/dishes/dish-dialog'
import { DishesTable } from '@/components/dishes/dishes-table'

export default async function DishesPage() {
  const supabase = await createClient()
  const { data: dishes } = await supabase
    .from('dishes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Блюда</h1>
          <p className="text-muted-foreground">
            Управляйте своими блюдами
          </p>
        </div>
        <DishDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Добавить блюдо
          </Button>
        </DishDialog>
      </div>

      {!dishes || dishes.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Нет блюд</CardTitle>
            <CardDescription>
              Начните с добавления вашего первого блюда
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="p-6">
          <DishesTable dishes={dishes} />
        </Card>
      )}
    </div>
  )
}