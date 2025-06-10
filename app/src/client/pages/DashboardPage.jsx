import { useQuery } from 'wasp/client/operations';
import { fetchSavedTasks, fetchCompletedTasks, saveTask, unsaveTask } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';

export default function DashboardPage() {
  const {
    data: savedTasksRaw,
    isLoading: loadingSaved,
    error: errorSaved,
  } = useQuery(fetchSavedTasks);

  const {
    data: completedTasksRaw,
    isLoading: loadingCompleted,
    error: errorCompleted,
  } = useQuery(fetchCompletedTasks);

  const [savedTasks, setSavedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    if (savedTasksRaw) {
      setSavedTasks(savedTasksRaw);
    }
  }, [savedTasksRaw]);

  useEffect(() => {
    if (completedTasksRaw) {
      setCompletedTasks(completedTasksRaw);
    }
  }, [completedTasksRaw]);

  const handleSave = async (taskId) => {
    try {
      const updated = await Promise.all(
        savedTasks.map(async (task) => {
          if (task.githubIssueId === taskId) {
            const newSavedState = !task.saved;

            if (newSavedState) {
              await saveTask({ task });
            } else {
              await unsaveTask({ taskId });
            }

            return { ...task, saved: newSavedState };
          }
          return task;
        })
      );

      setSavedTasks(updated.filter((t) => t.saved));
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  };

  const handleComplete = (taskId, prUrl, summary) => {
    // Already completed — no need to re-handle here
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>📌 My Dashboard</h1>

      {/* Saved Tasks */}
      <section>
        <h2>⭐ Saved Tasks</h2>
        {loadingSaved && <p>Loading...</p>}
        {errorSaved && <p>Error loading saved tasks.</p>}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem',
            marginTop: '1rem',
          }}
        >
          {savedTasks?.map((t) => (
            <div
              key={t.id}
              style={{
                width: '320px',
                minHeight: '440px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                padding: '1.25rem',
                background: 'var(--color-surface)',
                color: 'var(--color-foreground)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            >
              <TaskCard
                task={{
                  ...t,
                  saved: true,
                  completed: false,
                  labels: Array.isArray(t.labels) ? t.labels : JSON.parse(t.labels || '[]'),
                }}
                onSave={handleSave}
                onComplete={handleComplete}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Completed Tasks */}
      <section style={{ marginTop: '3rem' }}>
        <h2>🏆 Completed Tasks</h2>
        {loadingCompleted && <p>Loading...</p>}
        {errorCompleted && <p>Error loading completed tasks.</p>}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem',
            marginTop: '1rem',
          }}
        >
          {completedTasks?.map((t) => (
            <div
              key={t.id}
              style={{
                width: '320px',
                minHeight: '440px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                padding: '1.25rem',
                background: 'var(--color-surface)',
                color: 'var(--color-foreground)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            >
              <TaskCard
                task={{
                  ...t,
                  saved: false,
                  completed: true,
                  prUrl: t.prUrl,
                  summary: t.summary,
                  labels: Array.isArray(t.labels) ? t.labels : JSON.parse(t.labels || '[]'),
                }}
                onSave={() => { }}
                onComplete={() => { }}
              />
            </div>
          ))}
        </div>
      </section>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/tasks" style={{ color: 'var(--color-primary)' }}>
          ← Back to Task Browser
        </Link>
      </div>
    </div>
  );
}
