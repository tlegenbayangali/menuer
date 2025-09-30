'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ImageCropDialog } from './image-crop-dialog'

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    id?: string
    email?: string
    user_metadata?: {
      avatar_url?: string
      full_name?: string
    }
  }
}

export function ProfileDialog({ open, onOpenChange, user }: ProfileDialogProps) {
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState(user.user_metadata?.full_name || '')
  const [avatarUrl, setAvatarUrl] = useState(user.user_metadata?.avatar_url || '')
  const [uploading, setUploading] = useState(false)
  const [showCropDialog, setShowCropDialog] = useState(false)
  const [imageToCrop, setImageToCrop] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const getInitials = () => {
    const name = fullName || user.email || 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return
    }

    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = () => {
      setImageToCrop(reader.result as string)
      setShowCropDialog(true)
    }

    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const handleCropComplete = async (croppedImage: Blob) => {
    try {
      setUploading(true)

      const fileName = `${user.id}-${Date.now()}.jpg`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedImage, { upsert: true })

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setAvatarUrl(publicUrl)
    } catch (error) {
      alert('Ошибка загрузки изображения!')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: avatarUrl,
        },
      })

      if (error) throw error

      router.refresh()
      onOpenChange(false)
    } catch (error) {
      alert('Ошибка обновления профиля!')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактировать профиль</DialogTitle>
          <DialogDescription>
            Измените свои данные профиля
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Camera className="h-4 w-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
              </label>
            </div>
            {uploading && (
              <p className="text-sm text-muted-foreground">Загрузка...</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email || ''} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Имя</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Введите ваше имя"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={loading || uploading}>
              {loading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </div>
        </DialogContent>
      </Dialog>

      <ImageCropDialog
        open={showCropDialog}
        onOpenChange={setShowCropDialog}
        imageSrc={imageToCrop}
        onCropComplete={handleCropComplete}
      />
    </>
  )
}