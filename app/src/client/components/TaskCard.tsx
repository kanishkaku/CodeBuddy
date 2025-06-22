import { useState } from 'react';
import { createPortal } from 'react-dom';

// Inline SVG icon components to replace lucide-react
const Bookmark = ({ size = 16, className = '', fill = false }: { size?: number; className?: string; fill?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const ExternalLink = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15,3 21,3 21,9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const GitBranch = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="m18 9a9 9 0 0 1-9 9" />
  </svg>
);

const User = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

interface Task {
  githubIssueId: string;
  title: string;
  description: string;
  repository: string;
  url: string;
  labels?: { name: string; color: string }[];
  saved?: boolean;
  completed?: boolean;
  language?: string;
  difficulty?: string;
  estimatedTime?: string;
  author?: string;
}

interface TaskCardProps {
  task: Task;
  onSave: (taskId: string) => void;
  onComplete: (taskId: string, prUrl: string, summary: string) => void;
  disableButtons?: boolean;
}

export default function TaskCard({ task, onSave, onComplete, disableButtons = false }: TaskCardProps) {
  const [showDialog, setShowDialog] = useState(false);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
      case 'good first issue':
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
      case 'intermediate':
      case 'help wanted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
      case 'advanced':
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    }
  };

  // Extract difficulty from labels if not provided directly
  const getDifficultyFromLabels = () => {
    if (task.difficulty) return task.difficulty;

    const difficultyLabels = ['good first issue', 'beginner', 'easy', 'help wanted', 'intermediate', 'advanced'];
    const foundLabel = task.labels?.find(label =>
      difficultyLabels.some(diff => label.name.toLowerCase().includes(diff))
    );
    return foundLabel?.name;
  };

  // Extract language from labels or repository name if not provided
  const getLanguageFromContext = () => {
    if (task.language) return task.language;

    const languageLabels = ['javascript', 'python', 'java', 'typescript', 'react', 'node', 'css', 'html'];
    const foundLabel = task.labels?.find(label =>
      languageLabels.some(lang => label.name.toLowerCase().includes(lang))
    );
    return foundLabel?.name;
  };

  const difficulty = getDifficultyFromLabels();
  const language = getLanguageFromContext();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col">
      {/* Header with repository and metadata */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 border-b border-gray-100 dark:border-gray-600">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <GitBranch size={14} />
            <span className="font-medium truncate">{task.repository}</span>
          </div>
          {language && (
            <span className="text-xs px-2 py-1 bg-white dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium shrink-0">
              {language}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
          {difficulty && (
            <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
          )}
          {task.estimatedTime && (
            <span className="flex items-center gap-1">
              ⏱️ {task.estimatedTime}
            </span>
          )}
          {task.author && (
            <span className="flex items-center gap-1">
              <User size={12} />
              {task.author}
            </span>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 py-5 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight">
          {task.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 flex-1">
          {task.description.length > 200
            ? task.description.slice(0, 200) + '...'
            : task.description}
        </p>

        {/* Labels */}
        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {task.labels.slice(0, 3).map((label) => (
              <span
                key={label.name}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: `#${label.color}` }}
              >
                {label.name}
              </span>
            ))}
            {task.labels.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                +{task.labels.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* GitHub link */}
        <a
          href={task.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
        >
          <ExternalLink size={14} />
          View on GitHub
        </a>
      </div>

      {/* Actions footer */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600 flex gap-3">
        <button
          onClick={() => {
            if (!disableButtons) { onSave(task.githubIssueId); }
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${task.saved
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800'
            : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500'
            } ${disableButtons ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Bookmark
            size={16}
            fill={task.saved}
          />
          {task.saved ? 'Saved' : 'Save'}
        </button>

        <button
          onClick={() => {
            if (!disableButtons) { setShowDialog(true); }
          }}
          disabled={task.completed}
          className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${task.completed
            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 border border-green-200 dark:border-green-700 cursor-not-allowed'
            : 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-md'
            } ${disableButtons ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {task.completed ? '✅ Completed' : 'Mark Complete'}
        </button>
      </div>

      {/* Completion dialog */}
      <CompletionDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onSubmit={async (prUrl, summary) => {
          await onComplete(task.githubIssueId, prUrl, summary);
          setShowDialog(false);
        }}
      />
    </div>
  );
}

// Add this before the main TaskCard component
interface CompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prUrl: string, summary: string) => void;
}

function CompletionDialog({ isOpen, onClose, onSubmit }: CompletionDialogProps) {
  const [prUrl, setPrUrl] = useState('');
  const [summary, setSummary] = useState('');

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Complete Task</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Share your contribution details</p>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pull Request URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/repo/pull/123"
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Summary
            </label>
            <textarea
              placeholder="Describe what you implemented and any key decisions you made..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit(prUrl, summary);
              setPrUrl('');
              setSummary('');
            }}
            disabled={!prUrl.trim() || !summary.trim()}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}