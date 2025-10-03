'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DishDialog } from './dish-dialog'
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

interface DishCardProps {
  dish: {
    id: string
    name: string
    description: string | null
    image_url: string | null
  }
}

export function DishCard({ dish }: DishCardProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('dishes')
        .delete()
        .eq('id', dish.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Error deleting dish:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      {dish.image_url && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={dish.image_url}
            alt={dish.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>{dish.name}</CardTitle>
        {dish.description && (
          <CardDescription
            dangerouslySetInnerHTML={{ __html: dish.description }}
            className="line-clamp-2"
          />
        )}
      </CardHeader>
      <CardFooter className="flex gap-2">
        <Link href={`/dishes/${dish.id}`}>
          <Button variant="default" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            Открыть
          </Button>
        </Link>
        <DishDialog dish={dish}>
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Изменить
          </Button>
        </DishDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={loading}>
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить блюдо?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие нельзя отменить. Блюдо будет удалено навсегда.
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