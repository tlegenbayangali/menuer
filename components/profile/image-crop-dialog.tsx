'use client'

import { useState, useRef, useCallback } from 'react'
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ImageCropDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageSrc: string
  onCropComplete: (croppedImage: Blob) => void
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export function ImageCropDialog({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<Crop>()
  const imgRef = useRef<HTMLImageElement>(null)

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, 1))
  }

  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return

    const image = imgRef.current
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const pixelRatio = window.devicePixelRatio || 1

    canvas.width = completedCrop.width * scaleX * pixelRatio
    canvas.height = completedCrop.height * scaleY * pixelRatio

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    )

    return new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
        },
        'image/jpeg',
        0.95,
      )
    })
  }, [completedCrop])

  const handleSave = async () => {
    const croppedImage = await getCroppedImg()
    if (croppedImage) {
      onCropComplete(croppedImage)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Обрезать изображение</DialogTitle>
          <DialogDescription>
            Выберите область для аватара (соотношение 1:1)
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-4">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop
          >
            <img
              ref={imgRef}
              src={imageSrc}
              onLoad={onImageLoad}
              alt="Crop preview"
              style={{ maxWidth: '100%', maxHeight: '400px' }}
            />
          </ReactCrop>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave}>Применить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}