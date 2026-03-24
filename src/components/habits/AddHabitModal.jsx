import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { CATEGORIES, FREQUENCIES, DAYS } from '../../constants/habits'

export default function AddHabitModal({ isOpen, onClose, onCreate }) {
  const [form, setForm] = useState({
    name: '', category: 'health',
    frequency: 'daily', customDays: [], routine: 'none'
  })

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const toggleDay = (day) => {
    setForm(prev => ({
      ...prev,
      customDays: prev.customDays.includes(day)
        ? prev.customDays.filter(d => d !== day)
        : [...prev.customDays, day]
    }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) return
    await onCreate(form)
    setForm({ name: '', category: 'health', frequency: 'daily', customDays: [], routine: 'none' })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="NEW HABIT">

      {/* Name */}
      <div className="mb-4">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          Habit Name
        </label>
        <input
          className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500 transition"
          placeholder="e.g. Morning Run"
          value={form.name}
          onChange={e => set('name', e.target.value)}
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => set('category', cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                form.category === cat
                  ? 'bg-orange-500 text-black'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div className="mb-4">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          Frequency
        </label>
        <div className="flex gap-2">
          {FREQUENCIES.map(f => (
            <button
              key={f.value}
              onClick={() => set('frequency', f.value)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                form.frequency === f.value
                  ? 'bg-orange-500 text-black'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Custom days */}
        {form.frequency === 'custom' && (
          <div className="flex gap-2 mt-3">
            {DAYS.map(d => (
              <button
                key={d.value}
                onClick={() => toggleDay(d.value)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                  form.customDays.includes(d.value)
                    ? 'bg-orange-500 text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Routine */}
      <div className="mb-6">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          Routine
        </label>
        <div className="flex gap-2">
          {[
            { value: 'morning', label: '☀️ Morning' },
            { value: 'night',   label: '🌙 Night'   },
            { value: 'none',    label: 'None'        },
          ].map(r => (
            <button
              key={r.value}
              onClick={() => set('routine', r.value)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                form.routine === r.value
                  ? 'bg-orange-500 text-black'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSubmit} className="flex-1">Add Habit</Button>
        <Button onClick={onClose} variant="ghost">Cancel</Button>
      </div>

    </Modal>
  )
}