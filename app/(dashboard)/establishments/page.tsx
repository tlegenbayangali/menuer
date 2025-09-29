import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { EstablishmentDialog } from '@/components/establishments/establishment-dialog'
import { EstablishmentCard } from '@/components/establishments/establishment-card'

export default async function EstablishmentsPage() {
  const supabase = await createClient()
  const { data: establishments } = await supabase
    .from('establishments')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Мои заведения</h1>
          <p className="text-muted-foreground">
            Управляйте своими заведениями
          </p>
        </div>
        <EstablishmentDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Добавить заведение
          </Button>
        </EstablishmentDialog>
      </div>

      {!establishments || establishments.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Нет заведений</CardTitle>
            <CardDescription>
              Начните с добавления вашего первого заведения
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {establishments.map((establishment) => (
            <EstablishmentCard key={establishment.id} establishment={establishment} />
          ))}
        </div>
      )}
    </div>
  )
}