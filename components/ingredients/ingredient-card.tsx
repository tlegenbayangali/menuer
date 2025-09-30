'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IngredientDialog } from './ingredient-dialog'
import { Pencil, Trash2 } from 'lucide-react'
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
import { getUnitFullName } from '@/lib/units'

interface IngredientCardProps {
  ingredient: {
    id: string
    name: string
    unit: string
  }
}

export function IngredientCard({ ingredient }: IngredientCardProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', ingredient.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Error deleting ingredient:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{ingredient.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Единица: {getUnitFullName(ingredient.unit)}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <IngredientDialog ingredient={ingredient}>
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Изменить
          </Button>
        </IngredientDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={loading}>
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить ингредиент?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие нельзя отменить. Ингредиент будет удален навсегда.
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