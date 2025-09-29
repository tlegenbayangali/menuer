import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { MenuDialog } from '@/components/menus/menu-dialog'
import { MenuCard } from '@/components/menus/menu-card'

export default async function MenusPage() {
  const supabase = await createClient()
  const { data: menus } = await supabase
    .from('menus')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Мое меню</h1>
          <p className="text-muted-foreground">
            Управляйте своими меню
          </p>
        </div>
        <MenuDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Добавить меню
          </Button>
        </MenuDialog>
      </div>

      {!menus || menus.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Нет меню</CardTitle>
            <CardDescription>
              Начните с добавления вашего первого меню
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {menus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} />
          ))}
        </div>
      )}
    </div>
  )
}