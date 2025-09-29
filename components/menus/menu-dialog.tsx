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
import { Textarea } from '@/components/ui/textarea'

interface MenuDialogProps {
  children: React.ReactNode
  menu?: {
    id: string
    name: string
    description: string | null
    price: number | null
  }
}

export function MenuDialog({ children, menu }: MenuDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(menu?.name || '')
  const [description, setDescription] = useState(menu?.description || '')
  const [price, setPrice] = useState(menu?.price?.toString() || '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Update form state when dialog opens or menu changes
  useEffect(() => {
    if (open) {
      setName(menu?.name || '')
      setDescription(menu?.description || '')
      setPrice(menu?.price?.toString() || '')
    }
  }, [open, menu])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const menuData = {
        name,
        description: description || null,
        price: price ? parseFloat(price) : null,
        user_id: user.id,
      }

      if (menu) {
        const { error } = await supabase
          .from('menus')
          .update(menuData)
          .eq('id', menu.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('menus')
          .insert(menuData)

        if (error) throw error
      }

      setOpen(false)
      setName('')
      setDescription('')
      setPrice('')
      router.refresh()
    } catch (error) {
      console.error('Error saving menu:', error)
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
              {menu ? 'Редактировать меню' : 'Добавить меню'}
            </DialogTitle>
            <DialogDescription>
              {menu ? 'Обновите информацию о меню' : 'Создайте новое меню'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Название меню"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Описание меню"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Цена</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
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