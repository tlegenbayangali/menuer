'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'

interface DishPageWrapperProps {
  children: React.ReactNode
  dishId: string
}

export function DishPageWrapper({ children, dishId }: DishPageWrapperProps) {
  const [showWarning, setShowWarning] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null)
  const [isRemoving, setIsRemoving] = useState(false)
  const [emptyIngredientIds, setEmptyIngredientIds] = useState<string[]>([])
  const hasEmptyRef = useRef(false)
  const supabase = createClient()

  // Check for empty quantities in real-time
  const checkEmptyQuantities = useCallback(async () => {
    const { data } = await supabase
      .from('dish_ingredients')
      .select('ingredient_id, quantity')
      .eq('dish_id', dishId)

    const emptyIds = data
      ?.filter(di => !di.quantity || di.quantity === 0)
      .map(di => di.ingredient_id) || []

    setEmptyIngredientIds(emptyIds)
    hasEmptyRef.current = emptyIds.length > 0
    return emptyIds.length > 0
  }, [dishId, supabase])

  // Check on mount and set up realtime subscription
  useEffect(() => {
    checkEmptyQuantities().then(hasEmpty => {
      console.log('Initial check - has empty quantities:', hasEmpty)
    })

    // Subscribe to changes in dish_ingredients
    const channel = supabase
      .channel(`dish_ingredients_${dishId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dish_ingredients',
          filter: `dish_id=eq.${dishId}`,
        },
        () => {
          console.log('Realtime update detected')
          checkEmptyQuantities()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [dishId, checkEmptyQuantities, supabase])

  const handleLinkClick = useCallback((e: MouseEvent) => {
    const target = (e.target as HTMLElement)

    // Don't intercept clicks inside the modal dialog
    if (target.closest('[role="alertdialog"]')) {
      console.log('Click inside modal, allowing it')
      return
    }

    // Skip if modal is already shown and it's a link click
    if (showWarning && target.closest('a')) {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      console.log('Modal already shown, blocking link click')
      return
    }

    const linkTarget = target.closest('a')
    if (!linkTarget) return

    const href = linkTarget.getAttribute('href')
    if (!href || href.startsWith('#')) return

    // Check if navigating away from current page
    const currentPath = window.location.pathname
    console.log('Current path:', currentPath, 'Target href:', href, 'Has empty:', hasEmptyRef.current)

    if (href.startsWith('/') && !href.startsWith(currentPath)) {
      // Use synchronous check from ref
      if (hasEmptyRef.current) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()

        console.log('Showing warning modal for href:', href)
        setPendingNavigation(() => () => {
          console.log('Executing navigation to:', href)
          window.location.href = href
        })
        setShowWarning(true)
      }
    }
  }, [showWarning])

  useEffect(() => {
    // Handle beforeunload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasEmptyRef.current) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    // Intercept all link clicks with capture phase
    document.addEventListener('click', handleLinkClick, true)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('click', handleLinkClick, true)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [handleLinkClick])

  const handleStay = () => {
    console.log('handleStay clicked')
    setShowWarning(false)
    setPendingNavigation(null)
  }

  const handleRemoveAndProceed = async () => {
    console.log('handleRemoveAndProceed clicked, emptyIngredientIds:', emptyIngredientIds)
    setIsRemoving(true)
    try {
      // Remove all ingredients with empty quantities from dish
      for (const ingredientId of emptyIngredientIds) {
        console.log('Deleting ingredient:', ingredientId)
        await supabase
          .from('dish_ingredients')
          .delete()
          .eq('dish_id', dishId)
          .eq('ingredient_id', ingredientId)
      }

      // Update ref
      hasEmptyRef.current = false

      // Proceed to navigation
      console.log('Closing modal and navigating, pendingNavigation:', pendingNavigation)
      setShowWarning(false)
      setTimeout(() => {
        if (pendingNavigation) {
          console.log('Calling pendingNavigation')
          pendingNavigation()
        } else {
          console.log('No pendingNavigation found')
        }
      }, 100)
    } catch (error) {
      console.error('Error removing ingredients:', error)
      alert('Ошибка при удалении ингредиентов')
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <>
      {children}
      <AlertDialog open={showWarning} onOpenChange={handleStay}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Незаполненные количества ингредиентов</AlertDialogTitle>
            <AlertDialogDescription>
              У некоторых ингредиентов не указано количество. Хотите удалить их и покинуть страницу?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleStay} disabled={isRemoving}>
              Остаться и заполнить
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveAndProceed}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Удаление...
                </>
              ) : (
                'Удалить и выйти'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}