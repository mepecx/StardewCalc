interface Tab<T extends string> {
  value: T
  label: string
}

interface TabsProps<T extends string> {
  tabs: Tab<T>[]
  value: T
  onChange: (value: T) => void
  size?: 'sm' | 'md'
}

export function Tabs<T extends string>({ tabs, value, onChange, size = 'md' }: TabsProps<T>) {
  const baseClass = size === 'sm'
    ? 'px-2.5 py-1 text-xs'
    : 'px-4 py-2 text-sm'

  return (
    <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`${baseClass} rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
            value === tab.value
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-600/50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
