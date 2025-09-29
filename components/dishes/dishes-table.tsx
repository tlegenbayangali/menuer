'use client'

import { useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, Pencil, ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react'
import { DishDialog } from './dish-dialog'
import { DishDeleteButton } from './dish-delete-button'
import Link from 'next/link'

interface Dish {
  id: string
  name: string
  description: string | null
  image_url: string | null
}

interface DishesTableProps {
  dishes: Dish[]
}

type SortField = 'name'
type SortOrder = 'asc' | 'desc' | null

export function DishesTable({ dishes }: DishesTableProps) {
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

  const filteredAndSortedDishes = useMemo(() => {
    let result = [...dishes]

    // Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(dish =>
        dish.name.toLowerCase().includes(query) ||
        dish.description?.toLowerCase().includes(query)
      )
    }

    // Sort
    if (sortOrder) {
      result.sort((a, b) => {
        const aValue = a.name.toLowerCase()
        const bValue = b.name.toLowerCase()

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [dishes, searchQuery, sortField, sortOrder])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или описанию..."
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
            <TableHead>Описание</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedDishes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                {searchQuery ? 'Ничего не найдено' : 'Нет блюд'}
              </TableCell>
            </TableRow>
          ) : (
            filteredAndSortedDishes.map((dish) => (
              <TableRow key={dish.id}>
                <TableCell className="font-medium">{dish.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {dish.description || '—'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dishes/${dish.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DishDialog dish={dish}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DishDialog>
                    <DishDeleteButton dishId={dish.id} />
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