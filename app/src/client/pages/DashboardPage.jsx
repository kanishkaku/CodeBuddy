import { useAuth } from 'wasp/client/auth';
import { useQuery } from 'wasp/client/operations';
import { fetchSavedTasks, fetchCompletedTasks, saveTask, unsaveTask, completeTask, updateTaskSummary } from 'wasp/client/operations';
import { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
import { Link as WaspRouterLink } from 'wasp/client/router';

export default function DashboardPage() {
  const { data: user } = useAuth();
  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <p className='text-lg text-bodydark mb-8'>Login to see dashboard</p>
          <WaspRouterLink
            to="/login"
            className='inline-block px-8 py-3 text-white font-semibold bg-yellow-500 rounded-lg hover:bg-yellow-400 transition duration-300'
          >
            Login
          </WaspRouterLink>
        </div>
      </div>
    );
  }
  else 
  {
  // Only run queries if user is logged in
    const {
      data: savedTasksRaw,
      isLoading: loadingSaved,
      error: errorSaved,
      refetch: refetchSaved,
    } = useQuery(fetchSavedTasks, undefined, { enabled: !!user });

    const {
      data: completedTasksRaw,
      isLoading: loadingCompleted,
      error: errorCompleted,
      refetch: refetchCompleted,
    } = useQuery(fetchCompletedTasks, undefined, { enabled: !!user });

    const [savedTasks, setSavedTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [editingSummary, setEditingSummary] = useState(null);
    const [editSummaryText, setEditSummaryText] = useState('');

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

    const handleEditSummary = (taskId, currentSummary) => {
      setEditingSummary(taskId);
      setEditSummaryText(currentSummary || '');
    };

    const handleSaveSummary = async (taskId) => {
      try {
        await updateTaskSummary({ taskId, summary: editSummaryText });

        // Update local state
        setCompletedTasks(prev => prev.map(task =>
          task.issueId === taskId
            ? { ...task, summary: editSummaryText }
            : task
        ));

        setEditingSummary(null);
        setEditSummaryText('');
      } catch (err) {
        console.error('Failed to update summary:', err);
      }
    };

    const handleCancelEdit = () => {
      setEditingSummary(null);
      setEditSummaryText('');
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
              No saved tasks yet.{' '}
              <WaspRouterLink
                to="/tasks"
                className="inline-block text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition"
              >
                Browse tasks
              </WaspRouterLink>{' '}
              to get started!
            </p>
          )}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              marginTop: '1rem',
            }}
          >
            {savedTasks?.filter(t => !t.completed).map((t) => (
              <TaskCard
                key={t.id}
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
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              marginTop: '1rem',
            }}
          >
            {completedTasks?.map((t) => (
              <div
                key={t.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: 0.8, // Slightly faded to show they're completed
                }}
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
                  onSave={() => { }} // Disable save/unsave for completed tasks
                  onComplete={() => { }} // Disable re-completion
                  hideButtons={true} // Hide the action buttons
                />
                {/* Show completion details with edit functionality */}
                <div style={{ background: 'var(--color-surface)', padding: '1rem', border: '1px solid var(--color-border)', borderTop: 'none', borderRadius: '0 0 10px 10px' }}>
                  {t.prUrl && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>PR:</strong> <a href={t.prUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>View Pull Request</a>
                    </div>
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <strong>Summary:</strong>
                      {editingSummary !== t.issueId && (
                        <button
                          onClick={() => handleEditSummary(t.issueId, t.summary)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-primary)',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            textDecoration: 'underline'
                          }}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    {editingSummary === t.issueId ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <textarea
                          value={editSummaryText}
                          onChange={e => setEditSummaryText(e.target.value)}
                          style={{
                            width: '100%',
                            minHeight: '60px',
                            padding: '0.5rem',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            resize: 'vertical'
                          }}
                          placeholder="Describe what you did in this task..."
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleSaveSummary(t.issueId)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: 'var(--color-border)',
                              color: 'var(--color-foreground)',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: 'var(--color-border)',
                              color: 'var(--color-foreground)',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p style={{ margin: 0, color: 'var(--color-muted)' }}>
                        {t.summary || 'No summary provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <WaspRouterLink
            to="/tasks"
            className='inline-block px-8 py-3 text-white font-semibold bg-yellow-500 rounded-lg hover:bg-yellow-400 transition duration-300'        >
            ← Back to Task Browser
          </WaspRouterLink>
        </div>
      </div>
    );
  }
}