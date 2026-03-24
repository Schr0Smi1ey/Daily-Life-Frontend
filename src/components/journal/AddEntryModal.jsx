import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import MoodSelector from './MoodSelector'

export default function AddEntryModal({ isOpen, onClose, onCreate, existingDates = [] }) {
  const today = new Date().toISOString().split('T')[0]
  const alreadyToday = existingDates.includes(today)

  const [form, setForm] = useState({
    mood: 3, text: '', gratitude: ''
  })

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async () => {
    if (!form.text.trim()) return
    await onCreate({ ...form, date: today })
    setForm({ mood: 3, text: '', gratitude: '' })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="NEW ENTRY">

      {alreadyToday && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3 mb-4">
          <p className="text-orange-400 text-xs">
            You already have an entry for today. Creating another will be saved separately.
          </p>
        </div>
      )}

      {/* Mood */}
      <div className="mb-5">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-3">
          How are you feeling?
        </label>
        <MoodSelector value={form.mood} onChange={val => set('mood', val)} />
      </div>

      {/* Text */}
      <div className="mb-4">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          What's on your mind?
        </label>
        <textarea
          className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500 transition resize-none"
          placeholder="Reflect on your day, wins, challenges, lessons..."
          rows={5}
          value={form.text}
          onChange={e => set('text', e.target.value)}
        />
      </div>

      {/* Gratitude */}
      <div className="mb-6">
        <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
          One thing you're grateful for
        </label>
        <input
          className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500 transition"
          placeholder="Today I'm grateful for..."
          value={form.gratitude}
          onChange={e => set('gratitude', e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSubmit} className="flex-1">Save Entry</Button>
        <Button onClick={onClose} variant="ghost">Cancel</Button>
      </div>

    </Modal>
  )
}