'use client'

import { useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pencil, ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react'
import { IngredientDialog } from './ingredient-dialog'
import { IngredientDeleteButton } from './ingredient-delete-button'

const UNIT_LABELS: Record<string, string> = {
  gram: 'Грамм',
  kilogram: 'Килограмм',
  piece: 'Штука',
  liter: 'Литр',
  milliliter: 'Миллилитр',
  tablespoon: 'Столовая ложка',
  teaspoon: 'Чайная ложка',
  cup: 'Стакан',
}

interface Ingredient {
  id: string
  name: string
  unit: string
}

interface IngredientsTableProps {
  ingredients: Ingredient[]
}

type SortField = 'name' | 'unit'
type SortOrder = 'asc' | 'desc' | null

export function IngredientsTable({ ingredients }: IngredientsTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort order
      setSortOrder(current => {
        if (current === 'asc') return 'desc'
        if (current === 'desc') return null
        return 'asc'
      })
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />
    if (sortOrder === 'asc') return <ArrowUp className="ml-2 h-4 w-4" />
    if (sortOrder === 'desc') return <ArrowDown className="ml-2 h-4 w-4" />
    return <ArrowUpDown className="ml-2 h-4 w-4" />
  }

  const filteredAndSortedIngredients = useMemo(() => {
    let result = [...ingredients]

    // Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(ingredient =>
        ingredient.name.toLowerCase().includes(query) ||
        UNIT_LABELS[ingredient.unit]?.toLowerCase().includes(query)
      )
    }

    // Sort
    if (sortOrder) {
      result.sort((a, b) => {
        let aValue: string
        let bValue: string

        if (sortField === 'name') {
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
        } else {
          aValue = UNIT_LABELS[a.unit]?.toLowerCase() || a.unit.toLowerCase()
          bValue = UNIT_LABELS[b.unit]?.toLowerCase() || b.unit.toLowerCase()
        }

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [ingredients, searchQuery, sortField, sortOrder])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или единице измерения..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('name')}
                className="h-auto p-0 hover:bg-transparent"
              >
                Название
                {getSortIcon('name')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('unit')}
                className="h-auto p-0 hover:bg-transparent"
              >
                Единица измерения
                {getSortIcon('unit')}
              </Button>
            </TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedIngredients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                {searchQuery ? 'Ничего не найдено' : 'Нет ингредиентов'}
              </TableCell>
            </TableRow>
          ) : (
            filteredAndSortedIngredients.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell className="font-medium">{ingredient.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {UNIT_LABELS[ingredient.unit] || ingredient.unit}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <IngredientDialog ingredient={ingredient}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </IngredientDialog>
                    <IngredientDeleteButton ingredientId={ingredient.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}