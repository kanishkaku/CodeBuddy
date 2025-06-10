import { useQuery } from 'wasp/client/operations';
import { fetchGitHubIssues } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { useState } from 'react';
import TaskCard from '../components/TaskCard'; // Adjust path if different

const TasksPage = () => {
    const [language, setLanguage] = useState('');
    const [difficulty, setDifficulty] = useState('good first issue');
    const [taskType, setTaskType] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 12;

    const [queryArgs, setQueryArgs] = useState({
        language: '',
        difficulty: 'good first issue',
        taskType: '',
        page: 1,
        perPage,
    });

    const { data: tasks, isLoading, error } = useQuery(fetchGitHubIssues, queryArgs);

    const handleSearch = () => {
        setPage(1);
        setQueryArgs({ language, difficulty, taskType, page: 1, perPage });
    };

    const handleNextPage = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        setQueryArgs((prev) => ({ ...prev, page: nextPage }));
    };

    const handlePrevPage = () => {
        const prevPage = Math.max(1, page - 1);
        setPage(prevPage);
        setQueryArgs((prev) => ({ ...prev, page: prevPage }));
    };

    const dropdownStyle = {
        padding: '0.5rem 2rem 0.5rem 0.75rem',
        border: '1px solid var(--color-border)',
        borderRadius: '4px',
        fontSize: '1rem',
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 140'%3E%3Cpolygon points='70,100 100,50 40,50' fill='%23666'/%3E%3C/svg%3E") no-repeat right 0.5rem center`,
        backgroundSize: '1rem',
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-foreground)',
        minWidth: '180px',
    };

    const handleSaveTask = (taskId) => {
        // You can call a mutation or update local state temporarily
        console.log('Saving task:', taskId);
        // Ideally: trigger a wasp mutation and update cache or use optimistic UI
    };

    const handleCompleteTask = (taskId, prUrl, summary) => {
        // Call your backend or mock it
        console.log('Completing task:', taskId, prUrl, summary);
        // Save PR link and description to your contributions table
    };


    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-foreground)' }}>
                Open GitHub Tasks
            </h1>

            {/* Filters */}
            <div
                style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2rem',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                }}
            >
                <div>
                    <label style={{ marginRight: '0.5rem' }}>Language:</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} style={dropdownStyle}>
                        <option value="">All Languages</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Python">Python</option>
                        <option value="Java">Java</option>
                        <option value="TypeScript">TypeScript</option>
                        <option value="C++">C++</option>
                        <option value="C#">C#</option>
                        <option value="Go">Go</option>
                        <option value="Ruby">Ruby</option>
                        <option value="Rust">Rust</option>
                        <option value="PHP">PHP</option>
                    </select>
                </div>

                <div>
                    <label style={{ marginRight: '0.5rem' }}>Difficulty:</label>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={dropdownStyle}>
                        <option value="good first issue">Good First Issue</option>
                        <option value="beginner">Beginner</option>
                        <option value="easy">Easy</option>
                        <option value="help wanted">Help Wanted</option>
                    </select>
                </div>

                <div>
                    <label style={{ marginRight: '0.5rem' }}>Task Type:</label>
                    <select value={taskType} onChange={(e) => setTaskType(e.target.value)} style={dropdownStyle}>
                        <option value="">All Types</option>
                        <option value="feature">Feature</option>
                        <option value="bug">Bug</option>
                        <option value="testing">Testing</option>
                        <option value="documentation">Documentation</option>
                        <option value="refactor">Refactor</option>
                    </select>
                </div>

                <button
                    onClick={handleSearch}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1.25rem',
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-on-primary)',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                        e.currentTarget.style.transform = 'scale(1.03)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                        e.currentTarget.style.transform = 'none';
                    }}
                >
                    🔍 Search
                </button>

            </div>

            {/* Results */}
            {isLoading && <div style={{ textAlign: 'center', color: 'var(--color-muted)' }}>Loading...</div>}
            {error && <div style={{ textAlign: 'center', color: 'var(--color-danger)' }}>Error: {error.message}</div>}
            {!isLoading && !error && tasks?.issues?.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--color-muted)' }}>No open tasks found.</div>
            )}

            {/* Cards */}
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

            {/* Pagination Controls */}
            {tasks && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: page === 1 ? 'var(--color-border)' : 'var(--color-primary)',
                            color: 'var(--color-on-primary)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: page === 1 ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Previous
                    </button>
                    <span style={{ padding: '0.5rem 1rem', color: 'var(--color-muted)' }}>Page {page}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={!tasks.hasMore}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: tasks.hasMore ? 'var(--color-primary)' : 'var(--color-border)',
                            color: 'var(--color-on-primary)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: tasks.hasMore ? 'pointer' : 'not-allowed',
                        }}
                    >
                        Next
                    </button>
                </div>
            )}

            <Link
                to="/"
                style={{
                    display: 'block',
                    marginTop: '3rem',
                    textAlign: 'center',
                    color: 'var(--color-link)',
                    textDecoration: 'underline',
                }}
            >
                ← Back to Home
            </Link>
        </div>
    );
};

export default TasksPage;
