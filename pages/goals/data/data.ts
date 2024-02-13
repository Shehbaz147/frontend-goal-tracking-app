import { h } from 'vue'
import {ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, CheckCircle2Icon, CircleIcon, XCircleIcon, HelpCircleIcon, TimerIcon} from 'lucide-vue-next'

export const labels = [
  {
    value: 'name',
    label: 'Name',
  },
  {
    value: 'unit',
    label: 'Unit',
  },
  {
    value: 'target',
    label: 'Target',
  },
  {
    value: 'baseline_date',
    label: 'Baseline',
  },
  {
    value: 'deadline_date',
    label: 'Deadline Date',
  },
  {
    value: 'status',
    label: 'Status',
  },
]

export const statuses = [
  {
    value: 'Not started',
    label: 'Pending',
    icon: h(HelpCircleIcon),
  },
  {
    value: 'Started',
    label: 'In Progress',
    icon: h(TimerIcon),
  },
  {
    value: 'done',
    label: 'Done',
    icon: h(CheckCircle2Icon),
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: h(XCircleIcon),
  },
]
