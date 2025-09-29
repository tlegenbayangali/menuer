'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface AssignDishesDialogProps {
  menuId: string
  currentDishes: Array<{ id: string; name: string }>
  children: React.ReactNode
}

export function AssignDishesDialog({ menuId, currentDishes, children }: AssignDishesDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [allDishes, setAllDishes] = useState<Array<{ id: string; name: string; description: string | null }>>([])
  const [selectedDishIds, setSelectedDishIds] = useState<Set<string>>(new Set())
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (open) {
      loadDishes()
      setSelectedDishIds(new Set(currentDishes.map(d => d.id)))
    }
  }, [open])

  const loadDishes = async () => {
    const { data } = await supabase
      .from('dishes')
      .select('id, name, description')
      .order('name')

    setAllDishes(data || [])
  }

  const handleToggle = (dishId: string) => {
    const newSelected = new Set(selectedDishIds)
    if (newSelected.has(dishId)) {
      newSelected.delete(dishId)
    } else {
      newSelected.add(dishId)
    }
    setSelectedDishIds(newSelected)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Delete all current assignments
      await supabase
        .from('menu_dishes')
        .delete()
        .eq('menu_id', menuId)

      // Insert new assignments
      if (selectedDishIds.size > 0) {
        const assignments = Array.from(selectedDishIds).map((dishId, index) => ({
          menu_id: menuId,
          dish_id: dishId,
          position: index,
        }))

        const { error } = await supabase
          .from('menu_dishes')
          .insert(assignments)

        if (error) throw error
      }

      router.refresh()
      setOpen(false)
    } catch (error) {
      console.error('Error saving dish assignments:', error)
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
          <DialogTitle>Управление блюдами</DialogTitle>
          <DialogDescription>
            Выберите блюда для этого меню
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {allDishes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Нет доступных блюд. Создайте блюда сначала.
            </p>
          ) : (
            allDishes.map((dish) => (
              <div key={dish.id} className="flex items-start space-x-3">
                <Checkbox
                  id={dish.id}
                  checked={selectedDishIds.has(dish.id)}
                  onCheckedChange={() => handleToggle(dish.id)}
                />
                <div className="flex-1">
                  <Label
                    htmlFor={dish.id}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {dish.name}
                  </Label>
                  {dish.description && (
                    <p className="text-xs text-muted-foreground">{dish.description}</p>
                  )}
                </div>
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