import { useQuery } from 'wasp/client/operations';
import { fetchGitHubIssues, saveTask, unsaveTask, completeTask } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard'; // Adjust path if needed


const languageOptions = [
    'JavaScript', 'Python', 'Java', 'TypeScript',
    'C++', 'C#', 'Go', 'Ruby', 'Rust', 'PHP'
];

const difficultyOptions = [
    'good first issue', 'beginner', 'easy', 'help wanted'
];

const taskTypeOptions = [
    'feature', 'bug', 'testing', 'documentation', 'refactor'
];

export default function TasksPage() {
    const [language, setLanguage] = useState('');
    const [difficulty, setDifficulty] = useState('good first issue');
    const [taskType, setTaskType] = useState('');
    const [queryArgs, setQueryArgs] = useState({ page: 1 });

    const {
        data: fetchedTasks,
        isLoading,
        error
    } = useQuery(fetchGitHubIssues, queryArgs);

    const [tasks, setTasks] = useState(null);

    useEffect(() => {
        if (fetchedTasks) {
            setTasks(fetchedTasks);
        }
    }, [fetchedTasks]);

    const handleSearch = () => {
        const labelFilters = [difficulty, taskType].filter(Boolean).join(',');
        const q = `is:issue+is:open${labelFilters ? `+label:"${labelFilters}"` : ''}${language ? `+language:${language}` : ''}`;

        setQueryArgs({ query: q, page: 1 }); // reset to page 1
    };

    const handleSaveTask = async (taskId) => {
        try {
            const updatedIssues = await Promise.all(
                tasks.issues.map(async (task) => {
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

            setTasks({ ...tasks, issues: updatedIssues });
        } catch (err) {
            console.error('Error saving task:', err);
        }
    };


    const handleCompleteTask = async (taskId, prUrl, summary) => {
        try {
            const task = tasks.issues.find(t => t.githubIssueId === taskId);
            if (!task) return;

            if (!task.saved) {
                await saveTask({ task }); // ✅ ensure it's saved
            }

            await completeTask({ taskId, prUrl, summary });

            const updatedIssues = tasks.issues.map((t) =>
                t.githubIssueId === taskId
                    ? { ...t, completed: true, saved: true, prUrl, summary }
                    : t
            );
            setTasks({ ...tasks, issues: updatedIssues });
        } catch (err) {
            console.error('Error completing task:', err);
        }
    };



    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
            <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>
                🧠 Discover GitHub Coding Tasks
            </h1>

            {/* Filters */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div style={{ minWidth: '200px' }}>
                    <label>Language</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: '100%' }}>
                        <option value="">Select language...</option>
                        {languageOptions.map((lang) => (
                            <option key={lang} value={lang}>{lang}</option>
                        ))}
                    </select>
                </div>

                <div style={{ minWidth: '200px' }}>
                    <label>Difficulty</label>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ width: '100%' }}>
                        {difficultyOptions.map((level) => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </div>

                <div style={{ minWidth: '200px' }}>
                    <label>Task Type</label>
                    <select value={taskType} onChange={(e) => setTaskType(e.target.value)} style={{ width: '100%' }}>
                        <option value="">Select type...</option>
                        {taskTypeOptions.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <button onClick={handleSearch} style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-on-primary)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    alignSelf: 'flex-end',
                    height: '2.5rem'
                }}>
                    🔍 Search
                </button>
            </div>

            {/* Cards */}
            {isLoading ? (
                <p style={{ textAlign: 'center' }}>Loading...</p>
            ) : error ? (
                <p style={{ textAlign: 'center', color: 'red' }}>Failed to load tasks.</p>
            ) : (
                <>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '1.5rem',
                        }}
                    >
                        {tasks?.issues?.map((task) => (
                            <div
                                key={task.githubIssueId}
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
                                    task={task}
                                    onSave={handleSaveTask}
                                    onComplete={handleCompleteTask}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {tasks && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '1rem' }}>
                            {tasks.page > 1 && (
                                <button
                                    onClick={() => setQueryArgs((prev) => ({ ...prev, page: tasks.page - 1 }))}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '6px',
                                        backgroundColor: 'var(--color-border)',
                                        color: 'var(--color-foreground)',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ← Previous
                                </button>
                            )}
                            {tasks.hasNextPage && (
                                <button
                                    onClick={() => setQueryArgs((prev) => ({ ...prev, page: tasks.page + 1 }))}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '6px',
                                        backgroundColor: 'var(--color-border)',
                                        color: 'var(--color-foreground)',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Next →
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
