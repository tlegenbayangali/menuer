'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MenuDialog } from './menu-dialog'
import { Pencil, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface MenuCardProps {
  menu: {
    id: string
    name: string
    description: string | null
    price: number | null
  }
}

export function MenuCard({ menu }: MenuCardProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('menus')
        .delete()
        .eq('id', menu.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Error deleting menu:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{menu.name}</CardTitle>
        {menu.description && (
          <CardDescription>{menu.description}</CardDescription>
        )}
      </CardHeader>
      {menu.price && (
        <CardContent>
          <p className="text-lg font-semibold">
            {new Intl.NumberFormat('ru-RU').format(menu.price)} ₸
          </p>
        </CardContent>
      )}
      <CardFooter className="flex gap-2">
        <Link href={`/menus/${menu.id}`}>
          <Button variant="default" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            Открыть
          </Button>
        </Link>
        <MenuDialog menu={menu}>
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Изменить
          </Button>
        </MenuDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={loading}>
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить меню?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие нельзя отменить. Меню будет удалено навсегда.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}