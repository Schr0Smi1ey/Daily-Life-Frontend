import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

export default function AddGoalModal({ isOpen, onClose, onCreate }) {
  const [form, setForm] = useState({
    title: '', description: '', targetDays: 30, startDate: ''
  })

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async () => {
    if (!form.title.trim()) return
    await onCreate({
      ...form,
      startDate: form.startDate || today
    })
    setForm({ title: '', description: '', targetDays: 30, startDate: '' })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="NEW GOAL">

      {/* Title */}
      <div className="mb-4">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          Goal Title
        </label>
        <input
          className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500 transition"
          placeholder="e.g. Run a 5K"
          value={form.title}
          onChange={e => set('title', e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          Description
        </label>
        <input
          className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500 transition"
          placeholder="What does success look like?"
          value={form.description}
          onChange={e => set('description', e.target.value)}
        />
      </div>

      {/* Target Days */}
      <div className="mb-4">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          Target Days
        </label>
        <div className="flex gap-2 mb-2">
          {[7, 14, 21, 30, 60, 90].map(d => (
            <button
              key={d}
              onClick={() => set('targetDays', d)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                form.targetDays === d
                  ? 'bg-orange-500 text-black'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
        <input
          type="number"
          className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500 transition"
          placeholder="Or enter custom days"
          value={form.targetDays}
          onChange={e => set('targetDays', parseInt(e.target.value) || 30)}
        />
      </div>

      {/* Start Date */}
      <div className="mb-6">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          Start Date
        </label>
        <input
          type="date"
          className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500 transition"
          value={form.startDate || today}
          onChange={e => set('startDate', e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSubmit} className="flex-1">Create Goal</Button>
        <Button onClick={onClose} variant="ghost">Cancel</Button>
      </div>

    </Modal>
  )
}