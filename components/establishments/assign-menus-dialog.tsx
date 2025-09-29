'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface AssignMenusDialogProps {
  establishmentId: string
  currentMenus: Array<{ id: string; name: string }>
  children: React.ReactNode
}

export function AssignMenusDialog({ establishmentId, currentMenus, children }: AssignMenusDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [allMenus, setAllMenus] = useState<Array<{ id: string; name: string; description: string | null }>>([])
  const [selectedMenuIds, setSelectedMenuIds] = useState<Set<string>>(new Set())
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (open) {
      loadMenus()
      setSelectedMenuIds(new Set(currentMenus.map(m => m.id)))
    }
  }, [open])

  const loadMenus = async () => {
    const { data } = await supabase
      .from('menus')
      .select('id, name, description')
      .order('name')

    setAllMenus(data || [])
  }

  const handleToggle = (menuId: string) => {
    const newSelected = new Set(selectedMenuIds)
    if (newSelected.has(menuId)) {
      newSelected.delete(menuId)
    } else {
      newSelected.add(menuId)
    }
    setSelectedMenuIds(newSelected)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Delete all current assignments
      await supabase
        .from('establishment_menus')
        .delete()
        .eq('establishment_id', establishmentId)

      // Insert new assignments
      if (selectedMenuIds.size > 0) {
        const assignments = Array.from(selectedMenuIds).map(menuId => ({
          establishment_id: establishmentId,
          menu_id: menuId,
        }))

        const { error } = await supabase
          .from('establishment_menus')
          .insert(assignments)

        if (error) throw error
      }

      router.refresh()
      setOpen(false)
    } catch (error) {
      console.error('Error saving menu assignments:', error)
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
          <DialogTitle>Управление меню</DialogTitle>
          <DialogDescription>
            Выберите меню, которые будут доступны в этом заведении
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {allMenus.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Нет доступных меню. Создайте меню сначала.
            </p>
          ) : (
            allMenus.map((menu) => (
              <div key={menu.id} className="flex items-start space-x-3">
                <Checkbox
                  id={menu.id}
                  checked={selectedMenuIds.has(menu.id)}
                  onCheckedChange={() => handleToggle(menu.id)}
                />
                <div className="flex-1">
                  <Label
                    htmlFor={menu.id}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {menu.name}
                  </Label>
                  {menu.description && (
                    <p className="text-xs text-muted-foreground">{menu.description}</p>
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