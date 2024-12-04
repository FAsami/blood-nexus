'use client'

import { BloodGroup } from '@prisma/client'
import clsx from 'clsx'

interface Option {
  id: string
  label: string
}

interface BloodGroupSelectProps {
  options: Option[]
  value: BloodGroup
  onChange: (value: BloodGroup) => void
  className?: string
  optionClassName?: string
  color?: 'default' | 'red'
}

const BloodGroupSelect = ({
  options,
  value,
  onChange,
  className,
  optionClassName,
  color = 'default'
}: BloodGroupSelectProps) => {
  return (
    <div
      className={clsx(
        'inline-flex items-center rounded-sm md:rounded-full px-1 py-1 gap-1',
        color === 'red' ? 'bg-red-100' : 'bg-muted',
        className
      )}
      role="radiogroup"
    >
      {options.map((option, index) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id as BloodGroup)}
          role="radio"
          aria-checked={value === option.id}
          className={clsx(
            'inline-flex items-center justify-center px-2.5 md:px-4 py-3 md:py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            index === 0 ? 'md:rounded-l-full' : '',
            index === options.length - 1 ? 'md:rounded-r-full' : '',
            value === option.id
              ? 'bg-red-500 text-white shadow-sm font-semibold'
              : 'text-red-700 hover:bg-red-200',
            optionClassName
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export { BloodGroupSelect }
