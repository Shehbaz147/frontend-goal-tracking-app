import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'

import { labels, statuses } from './data/data'
import type { Task } from './data/schema'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

export const columns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: ({ table }) => h(Checkbox,
      { 'checked': table.getIsAllPageRowsSelected(), 'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value), 'ariaLabel': 'Select all', 'class': 'translate-y-0.5' }),
    cell: ({ row }) => h(Checkbox,
      { 'checked': row.getIsSelected(), 'onUpdate:checked': value => row.toggleSelected(!!value), 'ariaLabel': 'Select row', 'class': 'translate-y-0.5' }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    enableSorting: false,
    enableHiding: false,
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Name' }),

    cell: ({ row }) => {
      const label = labels.find(label => label.value === row.original.name)

      return h('div', { class: 'flex space-x-2' }, [
        label && h(Badge, { variant: 'outline' }, label.label),
        h('span', { class: 'max-w-[500px] truncate font-medium' }, row.getValue('name')),
      ])
    },
  },
  {
    accessorKey: 'status',
    enableSorting: false,
    enableHiding: false,
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Status' }),

    cell: ({ row }) => {
      const status = statuses.find(
        status => status.value === row.getValue('status'),
      )

      if (!status)
        return null

      return h('div', { class: 'flex w-[100px] items-center' }, [
        status.icon && h(status.icon, { class: 'mr-2 h-4 w-4 text-muted-foreground' }),
        h('span', status.label),
      ])
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row, title: ''}),
  },
]