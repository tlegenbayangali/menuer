'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, X, Pencil } from 'lucide-react'
import { getUnitLabel } from '@/lib/units'

interface IngredientQuantityEditProps {
  dishId: string
  ingredientId: string
  currentQuantity: number
  unit: string
  ingredientName: string
}

export function IngredientQuantityEdit({
  dishId,
  ingredientId,
  currentQuantity,
  unit,
  ingredientName,
}: IngredientQuantityEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [quantity, setQuantity] = useState(currentQuantity.toString())
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)
    try {
      const numQuantity = parseFloat(quantity)
      if (isNaN(numQuantity) || numQuantity <= 0) {
        alert('Введите корректное количество')
        return
      }

      const { error } = await supabase
        .from('dish_ingredients')
        .update({ quantity: numQuantity })
        .eq('dish_id', dishId)
        .eq('ingredient_id', ingredientId)

      if (error) throw error

      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error('Error updating quantity:', error)
      alert('Ошибка обновления количества')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setQuantity(currentQuantity.toString())
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
        <div>
          <p className="font-medium">{ingredientName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-24 h-8"
            disabled={loading}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
              if (e.key === 'Escape') handleCancel()
            }}
          />
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={handleSave}
            disabled={loading}
          >
            <Check className="h-4 w-4 text-green-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={handleCancel}
            disabled={loading}
          >
            <X className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
      <div>
        <p className="font-medium">{ingredientName}</p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold min-w-[60px] text-right">
          {currentQuantity} {getUnitLabel(unit)}
        </p>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}