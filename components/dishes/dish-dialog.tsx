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
import { RichEditor } from '@/components/ui/rich-editor'
import { ImageUpload } from '@/components/ui/image-upload'
import { Sparkles, Loader2 } from 'lucide-react'

interface DishDialogProps {
  children: React.ReactNode
  dish?: {
    id: string
    name: string
    description: string | null
    image_url: string | null
  }
}

export function DishDialog({ children, dish }: DishDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(dish?.name || '')
  const [description, setDescription] = useState(dish?.description || '')
  const [imageUrl, setImageUrl] = useState(dish?.image_url || '')
  const [loading, setLoading] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)
  const [ingredients, setIngredients] = useState<any[]>([])
  const router = useRouter()
  const supabase = createClient()

  // Update form state when dialog opens or dish changes
  useEffect(() => {
    if (open) {
      setName(dish?.name || '')
      setDescription(dish?.description || '')
      setImageUrl(dish?.image_url || '')

      // Load ingredients if editing existing dish
      if (dish?.id) {
        loadIngredients()
      }
    }
  }, [open, dish])

  const loadIngredients = async () => {
    if (!dish?.id) return

    const { data } = await supabase
      .from('dish_ingredients')
      .select('quantity, unit, ingredients(name)')
      .eq('dish_id', dish.id)

    if (data) {
      setIngredients(
        data.map((item: any) => ({
          name: item.ingredients?.name,
          quantity: item.quantity,
          unit: item.unit,
        }))
      )
    }
  }

  const handleGenerateAI = async () => {
    if (!name.trim()) {
      alert('Введите название блюда')
      return
    }

    setGeneratingAI(true)

    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'dish',
          name,
          items: ingredients,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка генерации')
      }

      setDescription(data.description)
    } catch (error: any) {
      alert(error.message || 'Ошибка генерации описания')
      console.error(error)
    } finally {
      setGeneratingAI(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const dishData = {
        name,
        description: description || null,
        image_url: imageUrl || null,
        user_id: user.id,
      }

      if (dish) {
        const { error } = await supabase
          .from('dishes')
          .update(dishData)
          .eq('id', dish.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('dishes')
          .insert(dishData)

        if (error) throw error
      }

      setOpen(false)
      setName('')
      setDescription('')
      setImageUrl('')
      router.refresh()
    } catch (error) {
      console.error('Error saving dish:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {dish ? 'Редактировать блюдо' : 'Добавить блюдо'}
            </DialogTitle>
            <DialogDescription>
              {dish ? 'Обновите информацию о блюде' : 'Создайте новое блюдо'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Название блюда"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Описание</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateAI}
                  disabled={generatingAI || !name.trim()}
                >
                  {generatingAI ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Генерация...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Сгенерировать с ИИ
                    </>
                  )}
                </Button>
              </div>
              <RichEditor
                value={description}
                onChange={setDescription}
                placeholder="Описание блюда"
                disabled={loading || generatingAI}
              />
            </div>
            <div className="space-y-2">
              <Label>Изображение блюда</Label>
              <ImageUpload
                value={imageUrl}
                onChange={setImageUrl}
                onRemove={() => setImageUrl('')}
                disabled={loading}
              />
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