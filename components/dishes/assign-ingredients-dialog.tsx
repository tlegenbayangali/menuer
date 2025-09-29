'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface AssignIngredientsDialogProps {
  dishId: string
  currentIngredients: Array<{ id: string; name: string; quantity?: number }>
  children: React.ReactNode
}

interface IngredientSelection {
  id: string
  name: string
  unit: string
  selected: boolean
  quantity: string
}

export function AssignIngredientsDialog({ dishId, currentIngredients, children }: AssignIngredientsDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ingredients, setIngredients] = useState<IngredientSelection[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (open) {
      loadIngredients()
    }
  }, [open])

  const loadIngredients = async () => {
    const { data } = await supabase
      .from('ingredients')
      .select('id, name, unit')
      .order('name')

    if (data) {
      const currentMap = new Map(currentIngredients.map(i => [i.id, i.quantity?.toString() || '']))

      setIngredients(
        data.map(ing => ({
          id: ing.id,
          name: ing.name,
          unit: ing.unit,
          selected: currentMap.has(ing.id),
          quantity: currentMap.get(ing.id) || '',
        }))
      )
    }
  }

  const handleToggle = (id: string) => {
    setIngredients(prev =>
      prev.map(ing =>
        ing.id === id ? { ...ing, selected: !ing.selected } : ing
      )
    )
  }

  const handleQuantityChange = (id: string, quantity: string) => {
    setIngredients(prev =>
      prev.map(ing =>
        ing.id === id ? { ...ing, quantity } : ing
      )
    )
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Delete all current assignments
      await supabase
        .from('dish_ingredients')
        .delete()
        .eq('dish_id', dishId)

      // Insert new assignments
      const selectedIngredients = ingredients.filter(ing => ing.selected)

      if (selectedIngredients.length > 0) {
        const assignments = selectedIngredients.map(ing => ({
          dish_id: dishId,
          ingredient_id: ing.id,
          quantity: parseFloat(ing.quantity) || 0,
        }))

        const { error } = await supabase
          .from('dish_ingredients')
          .insert(assignments)

        if (error) throw error
      }

      router.refresh()
      setOpen(false)
    } catch (error) {
      console.error('Error saving ingredient assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Управление ингредиентами</DialogTitle>
          <DialogDescription>
            Выберите ингредиенты и укажите их количество
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {ingredients.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Нет доступных ингредиентов. Создайте ингредиенты сначала.
            </p>
          ) : (
            ingredients.map((ingredient) => (
              <div key={ingredient.id} className="space-y-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={ingredient.id}
                    checked={ingredient.selected}
                    onCheckedChange={() => handleToggle(ingredient.id)}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={ingredient.id}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {ingredient.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Единица: {ingredient.unit}
                    </p>
                  </div>
                </div>
                {ingredient.selected && (
                  <div className="ml-8">
                    <Input
                      type="number"
                      placeholder="Количество"
                      value={ingredient.quantity}
                      onChange={(e) => handleQuantityChange(ingredient.id, e.target.value)}
                      className="h-8"
                      step="0.01"
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}