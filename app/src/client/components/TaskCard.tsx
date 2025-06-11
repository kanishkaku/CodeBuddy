import { useState } from 'react';

interface Task {
  githubIssueId: string;
  title: string;
  description: string;
  repository: string;
  url: string;
  labels?: { name: string; color: string }[];
  saved?: boolean;
  completed?: boolean;
}

interface TaskCardProps {
  task: Task;
  onSave: (taskId: string) => void;
  onComplete: (taskId: string, prUrl: string, summary: string) => void;
  hideButtons?: boolean;
}

export default function TaskCard({ task, onSave, onComplete, hideButtons = false }: TaskCardProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [prUrl, setPrUrl] = useState('');
  const [summary, setSummary] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{task.title}</h3>
        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--color-muted)',
            marginBottom: '0.75rem',
            maxHeight: '5.5rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {task.description.length > 200
            ? task.description.slice(0, 200) + '...'
            : task.description}
        </p>

        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {task.labels.map((label) => (
              <span
                key={label.name}
                className="text-xs font-medium px-2 py-1 rounded-full text-white"
                style={{ backgroundColor: `#${label.color}` }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        <a
          href={task.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary underline hover:opacity-80"
        >
          View on GitHub
        </a>
      </div>

      {!hideButtons && (
        <div className="mt-6 flex justify-between items-center gap-3">
          <button
            onClick={() => onSave(task.githubIssueId)}
            className="px-4 py-2 text-sm font-medium border rounded-md border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            {task.saved ? 'Unsave' : 'Save'}
          </button>

          <button
            onClick={() => setShowDialog(true)}
            className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary/90"
          >
            {task.completed ? 'Completed' : 'Complete'}
          </button>
        </div>
      )}

      {showDialog && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Complete Task</h3>
            <div className="space-y-4">
              <input
                type="url"
                placeholder="Paste your Pull Request link"
                value={prUrl}
                onChange={(e) => setPrUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-boxdark text-gray-900 dark:text-white"
              />
              <textarea
                placeholder="Describe what you did in this task"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-boxdark text-gray-900 dark:text-white"
              />
              <button
                onClick={async () => {
                  await onComplete(task.githubIssueId, prUrl, summary);
                  setShowDialog(false);
                  setPrUrl('');
                  setSummary('');
                }}
                className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90"
              >
                Submit
              </button>
              <button
                onClick={() => setShowDialog(false)}
                className="w-full mt-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}