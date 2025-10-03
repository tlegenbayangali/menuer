import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { AssignMenusDialog } from '@/components/establishments/assign-menus-dialog'

export default async function EstablishmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch establishment
  const { data: establishment } = await supabase
    .from('establishments')
    .select('*')
    .eq('id', id)
    .single()

  if (!establishment) {
    notFound()
  }

  // Fetch assigned menus
  const { data: assignedMenus } = await supabase
    .from('establishment_menus')
    .select('menu_id, menus(*)')
    .eq('establishment_id', id)

  const menus = assignedMenus?.map(am => am.menus).filter(Boolean) || []

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/establishments">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к заведениям
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{establishment.name}</h1>
            {establishment.description && (
              <p className="text-muted-foreground">{establishment.description}</p>
            )}
            {establishment.address && (
              <p className="text-sm text-muted-foreground mt-2">
                📍 {establishment.address}
              </p>
            )}
          </div>
          <AssignMenusDialog establishmentId={id} currentMenus={menus as any[]}>
            <Button>Управление меню</Button>
          </AssignMenusDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Привязанные меню</CardTitle>
          <CardDescription className="text-sm">
            Меню, доступные в этом заведении
          </CardDescription>
        </CardHeader>
        <CardContent>
          {menus.length === 0 ? (
            <p className="text-muted-foreground">
              Нет привязанных меню. Добавьте меню, чтобы начать.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {menus.map((menu: any) => (
                <Link key={menu.id} href={`/menus/${menu.id}`}>
                  <Card className="hover:bg-accent cursor-pointer transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg">{menu.name}</CardTitle>
                      {menu.description && (
                        <CardDescription>{menu.description}</CardDescription>
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