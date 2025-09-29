'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EstablishmentDialog } from './establishment-dialog'
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

interface EstablishmentCardProps {
  establishment: {
    id: string
    name: string
    description: string | null
    address: string | null
  }
}

export function EstablishmentCard({ establishment }: EstablishmentCardProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('establishments')
        .delete()
        .eq('id', establishment.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Error deleting establishment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{establishment.name}</CardTitle>
        {establishment.description && (
          <CardDescription>{establishment.description}</CardDescription>
        )}
      </CardHeader>
      {establishment.address && (
        <CardContent>
          <p className="text-sm text-muted-foreground">
            📍 {establishment.address}
          </p>
        </CardContent>
      )}
      <CardFooter className="flex gap-2">
        <Link href={`/establishments/${establishment.id}`}>
          <Button variant="default" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            Открыть
          </Button>
        </Link>
        <EstablishmentDialog establishment={establishment}>
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Изменить
          </Button>
        </EstablishmentDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={loading}>
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить заведение?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие нельзя отменить. Заведение будет удалено навсегда.
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