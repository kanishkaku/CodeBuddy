import { useQuery } from 'wasp/client/operations';
import { fetchSavedTasks, fetchCompletedTasks, saveTask, unsaveTask, completeTask } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';

export default function DashboardPage() {
  const {
    data: savedTasksRaw,
    isLoading: loadingSaved,
    error: errorSaved,
    refetch: refetchSaved,
  } = useQuery(fetchSavedTasks);

  const {
    data: completedTasksRaw,
    isLoading: loadingCompleted,
    error: errorCompleted,
    refetch: refetchCompleted,
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
      // Find the task by issueId (not githubIssueId)
      const task = savedTasks.find(t => t.issueId === taskId);
      if (!task) {
        console.error('Task not found');
        return;
      }

      // Unsave the task (since we're in saved tasks, we only unsave here)
      await unsaveTask({ taskId });

      // Remove from saved tasks
      setSavedTasks(prev => prev.filter(t => t.issueId !== taskId));
      
    } catch (err) {
      console.error('Failed to unsave task:', err);
    }
  };

  const handleComplete = async (taskId, prUrl, summary) => {
    try {
      // Find the task in saved tasks using issueId
      const task = savedTasks.find(t => t.issueId === taskId);
      if (!task) {
        console.error('Task not found in saved tasks');
        return;
      }

      // Complete the task (it should already be saved since it's in savedTasks)
      await completeTask({ taskId, prUrl, summary });

      // Remove from saved tasks
      setSavedTasks(prev => prev.filter(t => t.issueId !== taskId));

      // Refetch completed tasks to get the updated list
      await refetchCompleted();

    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>📌 My Dashboard</h1>

      {/* Saved Tasks */}
      <section>
        <h2>⭐ Saved Tasks</h2>
        {loadingSaved && <p>Loading...</p>}
        {errorSaved && <p>Error loading saved tasks.</p>}
        {savedTasks && savedTasks.length === 0 && !loadingSaved && (
          <p style={{ textAlign: 'center', color: 'var(--color-muted)' }}>
            No saved tasks yet. <Link to="/tasks">Browse tasks</Link> to get started!
          </p>
        )}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem',
            marginTop: '1rem',
          }}
        >
          {savedTasks?.filter(t => !t.completed).map((t) => (
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
                  githubIssueId: t.issueId, // Map issueId to githubIssueId for TaskCard
                  title: t.title,
                  description: t.description,
                  repository: t.repo,
                  url: t.url,
                  labels: Array.isArray(t.labels) ? t.labels : JSON.parse(t.labels || '[]'),
                  saved: true,
                  completed: false,
                }}
                onSave={(taskId) => handleSave(t.issueId)} // Pass the actual issueId
                onComplete={(taskId, prUrl, summary) => handleComplete(t.issueId, prUrl, summary)} // Pass the actual issueId
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
        {completedTasks && completedTasks.length === 0 && !loadingCompleted && (
          <p style={{ textAlign: 'center', color: 'var(--color-muted)' }}>
            No completed tasks yet. Complete some saved tasks to see them here!
          </p>
        )}
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
                opacity: 0.8, // Slightly faded to show they're completed
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            >
              <TaskCard
                task={{
                  githubIssueId: t.issueId,
                  title: t.title,
                  description: t.description,
                  repository: t.repo,
                  url: t.url,
                  labels: Array.isArray(t.labels) ? t.labels : JSON.parse(t.labels || '[]'),
                  saved: true,
                  completed: true,
                }}
                onSave={() => {}} // Disable save/unsave for completed tasks
                onComplete={() => {}} // Disable re-completion
              />
              {/* Show completion details */}
              {t.prUrl && (
                <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                  <p><strong>PR:</strong> <a href={t.prUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>View Pull Request</a></p>
                  {t.summary && <p><strong>Summary:</strong> {t.summary}</p>}
                </div>
              )}
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