// Takes current state and returns array of badgeKeys that should be unlocked
export function checkAchievements({ habits, goals, entries }) {
  const toUnlock = []
  const today    = new Date().toISOString().split('T')[0]

  // ── Helper: get streak for a habit ──────────────────────────────────────
  function getStreak(habit) {
    let streak = 0
    const d = new Date()
    while (true) {
      const key = d.toISOString().split('T')[0]
      if (habit.checkins?.some(c => c.date === key)) {
        streak++
        d.setDate(d.getDate() - 1)
      } else if (streak === 0) {
        d.setDate(d.getDate() - 1)
        const prev = d.toISOString().split('T')[0]
        if (!habit.checkins?.some(c => c.date === prev)) break
      } else break
    }
    return streak
  }

  // ── Helper: get routine streak ───────────────────────────────────────────
  function getRoutineStreak(routine) {
    const routineHabits = habits.filter(h => h.routine === routine)
    if (!routineHabits.length) return 0

    let streak = 0
    const d = new Date()
    while (true) {
      const key = d.toISOString().split('T')[0]
      const allDone = routineHabits.every(h =>
        h.checkins?.some(c => c.date === key)
      )
      if (allDone) {
        streak++
        d.setDate(d.getDate() - 1)
      } else if (streak === 0) {
        d.setDate(d.getDate() - 1)
        const prev = d.toISOString().split('T')[0]
        const allDonePrev = routineHabits.every(h =>
          h.checkins?.some(c => c.date === prev)
        )
        if (!allDonePrev) break
      } else break
    }
    return streak
  }

  // ── 1. 7-day streak on any habit ─────────────────────────────────────────
  const has7Streak = habits.some(h => getStreak(h) >= 7)
  if (has7Streak) toUnlock.push('streak_7')

  // ── 2. 30-day streak on any habit ────────────────────────────────────────
  const has30Streak = habits.some(h => getStreak(h) >= 30)
  if (has30Streak) toUnlock.push('streak_30')

  // ── 3. First goal completed ───────────────────────────────────────────────
  const hasCompletedGoal = goals.some(g => g.status === 'completed')
  if (hasCompletedGoal) toUnlock.push('first_goal')

  // ── 4. 30 journal entries ─────────────────────────────────────────────────
  if (entries.length >= 30) toUnlock.push('journal_30')

  // ── 5. Perfect day — all habits done today ────────────────────────────────
  const allDoneToday = habits.length > 0 &&
    habits.every(h => h.checkins?.some(c => c.date === today))
  if (allDoneToday) toUnlock.push('perfect_day')

  // ── 6. Morning routine 7 days in a row ───────────────────────────────────
  if (getRoutineStreak('morning') >= 7) toUnlock.push('morning_7')

  // ── 7. Night routine 7 days in a row ─────────────────────────────────────
  if (getRoutineStreak('night') >= 7) toUnlock.push('night_7')

  // ── 8. All milestones done on any goal ───────────────────────────────────
  const hasMilestoneGoal = goals.some(g =>
    g.milestones?.length > 0 &&
    g.milestones.every(m => m.done)
  )
  if (hasMilestoneGoal) toUnlock.push('all_milestones')

  return toUnlock
}