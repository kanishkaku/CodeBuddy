import { useQuery } from 'wasp/client/operations';
import { fetchGitHubIssues, saveTask, unsaveTask, completeTask } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
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
    const { data: user } = useAuth();
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
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    🧠 Discover GitHub Coding Tasks
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Find open source projects to contribute to and build your portfolio
                </p>
            </div>

            {/* Improved Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Language
                        </label>
                        <select 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">All languages</option>
                            {languageOptions.map((lang) => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Difficulty
                        </label>
                        <select 
                            value={difficulty} 
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            {difficultyOptions.map((level) => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Task Type
                        </label>
                        <select 
                            value={taskType} 
                            onChange={(e) => setTaskType(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">All types</option>
                            {taskTypeOptions.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <button 
                        onClick={handleSearch}
                        className="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        🔍 Search Tasks
                    </button>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300">Loading tasks...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <div className="text-red-500 text-lg mb-2">⚠️ Failed to load tasks</div>
                    <p className="text-gray-600 dark:text-gray-300">Please try again later</p>
                </div>
            ) : (
                <>
                    {/* Results summary */}
                    {tasks?.issues && (
                        <div className="mb-6">
                            <p className="text-gray-600 dark:text-gray-300">
                                Found {tasks.issues.length} tasks
                                {language && ` in ${language}`}
                                {difficulty && ` • ${difficulty}`}
                                {taskType && ` • ${taskType}`}
                            </p>
                        </div>
                    )}

                    {/* Task Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {tasks?.issues?.map((task) => (
                            <TaskCard
                                key={task.githubIssueId}
                                task={task}
                                onSave={handleSaveTask}
                                onComplete={handleCompleteTask}
                                disableButtons={!user}
                            />
                        ))}
                    </div>

                    {/* Empty state */}
                    {tasks?.issues?.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🔍</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No tasks found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Try adjusting your filters to find more tasks
                            </p>
                            <button
                                onClick={() => {
                                    setLanguage('');
                                    setDifficulty('good first issue');
                                    setTaskType('');
                                    setQueryArgs({ page: 1 });
                                }}
                                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {tasks && tasks.issues && tasks.issues.length > 0 && (
                        <div className="flex justify-center items-center gap-4">
                            <button
                                onClick={() => setQueryArgs((prev) => ({ ...prev, page: tasks.page - 1 }))}
                                disabled={tasks.page <= 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ← Previous
                            </button>
                            
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                Page {tasks.page}
                            </span>
                            
                            <button
                                onClick={() => setQueryArgs((prev) => ({ ...prev, page: tasks.page + 1 }))}
                                disabled={!tasks.hasNextPage}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}