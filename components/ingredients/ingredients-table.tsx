'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Pencil } from 'lucide-react'
import { IngredientDialog } from './ingredient-dialog'
import { IngredientDeleteButton } from './ingredient-delete-button'
import { getUnitFullName } from '@/lib/units'
import { DataTable } from './data-table'

interface Ingredient {
  id: string
  name: string
  unit: string
}

interface IngredientsTableProps {
  ingredients: Ingredient[]
}

const columns: ColumnDef<Ingredient>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 hover:bg-transparent"
        >
          Название
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'unit',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 hover:bg-transparent"
        >
          Единица измерения
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {getUnitFullName(row.getValue('unit'))}
      </div>
    ),
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Действия</div>,
    cell: ({ row }) => {
      const ingredient = row.original

      return (
        <div className="flex justify-end gap-2">
          <IngredientDialog ingredient={ingredient}>
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4" />
            </Button>
          </IngredientDialog>
          <IngredientDeleteButton ingredientId={ingredient.id} />
        </div>
      )
    },
  },
]

export function IngredientsTable({ ingredients }: IngredientsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={ingredients}
      searchKey="name"
      searchPlaceholder="Поиск по названию..."
    />
  )
}