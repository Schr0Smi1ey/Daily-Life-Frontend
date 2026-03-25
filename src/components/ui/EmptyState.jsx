import Button from './Button'

export default function EmptyState({ icon, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div 
        className="text-5xl mb-4"
        style={{ color: 'var(--color-primary)' }}
      >
        {icon}
      </div>
      <p className="text-zinc-500 text-sm mb-6 max-w-xs">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}