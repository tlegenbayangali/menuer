'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UNIT_TYPES } from '@/lib/units'

interface IngredientDialogProps {
  children: React.ReactNode
  ingredient?: {
    id: string
    name: string
    unit: string
  }
}

export function IngredientDialog({ children, ingredient }: IngredientDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(ingredient?.name || '')
  const [unit, setUnit] = useState(ingredient?.unit || '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Update form state when dialog opens or ingredient changes
  useEffect(() => {
    if (open) {
      setName(ingredient?.name || '')
      setUnit(ingredient?.unit || '')
    }
  }, [open, ingredient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (ingredient) {
        const { error } = await supabase
          .from('ingredients')
          .update({ name, unit })
          .eq('id', ingredient.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('ingredients')
          .insert({ name, unit, user_id: user.id })

        if (error) throw error
      }

      setOpen(false)
      setName('')
      setUnit('')
      router.refresh()
    } catch (error) {
      console.error('Error saving ingredient:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {ingredient ? 'Редактировать ингредиент' : 'Добавить ингредиент'}
            </DialogTitle>
            <DialogDescription>
              {ingredient ? 'Обновите информацию об ингредиенте' : 'Создайте новый ингредиент'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Название ингредиента"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Единица измерения</Label>
              <Select value={unit} onValueChange={setUnit} required>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите единицу измерения" />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_TYPES.map((unitType) => (
                    <SelectItem key={unitType.value} value={unitType.value}>
                      {unitType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}