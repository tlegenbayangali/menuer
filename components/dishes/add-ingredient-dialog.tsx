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
import { Search, Plus, Loader2 } from 'lucide-react'
import { UNIT_TYPES } from '@/lib/units'

interface AddIngredientDialogProps {
  dishId: string
  children: React.ReactNode
}

export function AddIngredientDialog({ dishId, children }: AddIngredientDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [ingredients, setIngredients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newIngredientName, setNewIngredientName] = useState('')
  const [newIngredientUnit, setNewIngredientUnit] = useState('gram')
  const [creating, setCreating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Load ingredients when dialog opens
  useEffect(() => {
    if (open) {
      loadIngredients()
      setSearchQuery('')
      setShowCreate(false)
    }
  }, [open])

  const loadIngredients = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('ingredients')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

      setIngredients(data || [])
    } catch (error) {
      console.error('Error loading ingredients:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredIngredients = ingredients.filter((ing) =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddIngredient = async (ingredientId: string) => {
    try {
      // Check if already added
      const { data: existing } = await supabase
        .from('dish_ingredients')
        .select('*')
        .eq('dish_id', dishId)
        .eq('ingredient_id', ingredientId)
        .single()

      if (existing) {
        alert('Этот ингредиент уже добавлен в блюдо')
        return
      }

      // Add with quantity 0 (requires user input)
      const { error } = await supabase
        .from('dish_ingredients')
        .insert({
          dish_id: dishId,
          ingredient_id: ingredientId,
          quantity: 0,
        })

      if (error) throw error

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error adding ingredient:', error)
      alert('Ошибка добавления ингредиента')
    }
  }

  const handleCreateIngredient = async () => {
    if (!newIngredientName.trim()) {
      alert('Введите название ингредиента')
      return
    }

    setCreating(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create ingredient
      const { data: newIngredient, error: createError } = await supabase
        .from('ingredients')
        .insert({
          name: newIngredientName,
          unit: newIngredientUnit,
          user_id: user.id,
        })
        .select()
        .single()

      if (createError) throw createError

      // Add to dish
      await handleAddIngredient(newIngredient.id)

      setNewIngredientName('')
      setNewIngredientUnit('gram')
      setShowCreate(false)
    } catch (error) {
      console.error('Error creating ingredient:', error)
      alert('Ошибка создания ингредиента')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить ингредиент</DialogTitle>
          <DialogDescription>
            Найдите ингредиент или создайте новый
          </DialogDescription>
        </DialogHeader>

        {!showCreate ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск ингредиента..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredIngredients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Ингредиенты не найдены</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setShowCreate(true)
                      setNewIngredientName(searchQuery)
                    }}
                  >
                    Создать новый
                  </Button>
                </div>
              ) : (
                filteredIngredients.map((ingredient) => (
                  <button
                    key={ingredient.id}
                    onClick={() => handleAddIngredient(ingredient.id)}
                    className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div>
                      <p className="font-medium">{ingredient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {ingredient.unit}
                      </p>
                    </div>
                    <Plus className="h-4 w-4" />
                  </button>
                ))
              )}
            </div>

            {filteredIngredients.length > 0 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowCreate(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Создать новый ингредиент
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newIngredientName">Название</Label>
              <Input
                id="newIngredientName"
                value={newIngredientName}
                onChange={(e) => setNewIngredientName(e.target.value)}
                placeholder="Название ингредиента"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newIngredientUnit">Единица измерения</Label>
              <Select value={newIngredientUnit} onValueChange={setNewIngredientUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_TYPES.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreate(false)
                  setNewIngredientName('')
                }}
                disabled={creating}
              >
                Назад
              </Button>
              <Button onClick={handleCreateIngredient} disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Создание...
                  </>
                ) : (
                  'Создать и добавить'
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}