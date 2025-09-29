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

interface EstablishmentDialogProps {
  children: React.ReactNode
  establishment?: {
    id: string
    name: string
    description: string | null
    address: string | null
  }
}

export function EstablishmentDialog({ children, establishment }: EstablishmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(establishment?.name || '')
  const [description, setDescription] = useState(establishment?.description || '')
  const [address, setAddress] = useState(establishment?.address || '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Update form state when dialog opens or establishment changes
  useEffect(() => {
    if (open) {
      setName(establishment?.name || '')
      setDescription(establishment?.description || '')
      setAddress(establishment?.address || '')
    }
  }, [open, establishment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (establishment) {
        // Update existing establishment
        const { error } = await supabase
          .from('establishments')
          .update({ name, description, address })
          .eq('id', establishment.id)

        if (error) throw error
      } else {
        // Create new establishment
        const { error } = await supabase
          .from('establishments')
          .insert({ name, description, address, user_id: user.id })

        if (error) throw error
      }

      setOpen(false)
      setName('')
      setDescription('')
      setAddress('')
      router.refresh()
    } catch (error) {
      console.error('Error saving establishment:', error)
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
              {establishment ? 'Редактировать заведение' : 'Добавить заведение'}
            </DialogTitle>
            <DialogDescription>
              {establishment
                ? 'Обновите информацию о заведении'
                : 'Создайте новое заведение'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Название заведения"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Описание заведения"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Адрес</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Адрес заведения"
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