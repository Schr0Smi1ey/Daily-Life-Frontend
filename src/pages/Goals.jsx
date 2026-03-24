import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import GoalCard from '../components/goals/GoalCard'
import AddGoalModal from '../components/goals/AddGoalModal'
import GoalStatusTabs from '../components/goals/GoalStatusTabs'
import useGoals from '../hooks/useGoals'

export default function Goals() {
  const {
    goals, loading,
    createGoal, updateGoal, deleteGoal,
    addMilestone, toggleMilestone, deleteMilestone
  } = useGoals()

  const [showAdd,    setShowAdd]    = useState(false)
  const [statusTab,  setStatusTab]  = useState('all')

  const filtered = goals.filter(g =>
    statusTab === 'all' ? true : g.status === statusTab
  )

  const counts = {
    all:       goals.length,
    active:    goals.filter(g => g.status === 'active').length,
    paused:    goals.filter(g => g.status === 'paused').length,
    completed: goals.filter(g => g.status === 'completed').length,
  }

  if (loading) return <Spinner />

  return (
    <div>
      <PageHeader title="GOALS" subtitle="Define what you're working toward.">
        <Button size="sm" onClick={() => setShowAdd(true)}>
          + New Goal
        </Button>
      </PageHeader>

      <GoalStatusTabs
        active={statusTab}
        onChange={setStatusTab}
        counts={counts}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon="◈"
          message={
            statusTab === 'all'
              ? "No goals yet. Set your first one!"
              : `No ${statusTab} goals.`
          }
          actionLabel={statusTab === 'all' ? "Create a Goal" : undefined}
          onAction={statusTab === 'all' ? () => setShowAdd(true) : undefined}
        />
      ) : (
        filtered.map(goal => (
          <GoalCard
            key={goal._id}
            goal={goal}
            onDelete={deleteGoal}
            onUpdateStatus={updateGoal}
            onAddMilestone={addMilestone}
            onToggleMilestone={toggleMilestone}
            onDeleteMilestone={deleteMilestone}
          />
        ))
      )}

      <AddGoalModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onCreate={createGoal}
      />
    </div>
  )
}
