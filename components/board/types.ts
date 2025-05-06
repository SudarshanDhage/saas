// Define common types used across the board components

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: number;
}

export interface Task {
  id: string;
  content: string;
  title?: string;       // Task title
  isCompleted: boolean;
  status?: string;
  priority?: string;
  taskId: string;
  description?: string;
  sprintName?: string;
  sprintId?: string;
  type?: string;
  implementation?: string;
  estimatedHours?: number;
  dependencies?: string[];
  acceptanceCriteria?: string[];
  aiPrompt?: string;
  comments?: Comment[];
  commitId?: string;
  linkedId?: string;      // Reference to another entity (project, feature, etc.)
  linkedTitle?: string;   // Title of the linked entity
  assignee?: string;      // Assignee of the task
  subtaskCount?: number;  // Number of subtasks
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface JiraBoardProps {
  data: { columns: Column[] };
  onReorder: (columns: Column[]) => void;
  sidebarOpen?: boolean;
}

export interface TaskCardProps {
  task: Task;
  projectId?: string;
  featureId?: string;
  columnId?: string;
  onDragStart?: (task: Task) => void;
  onDragEnd?: () => void;
  onToggleCompletion?: (taskId: string, columnId: string) => void;
  onMenuToggle?: (taskId: string) => void;
  isMenuOpen?: boolean;
  onTaskClick?: (task: Task) => void;
}

export interface ColumnHeaderProps {
  title: string;
  taskCount: number;
  isDone?: boolean;
}

export interface TaskModalProps {
  task: Task;
  projectId?: string;
  featureId?: string;
  onClose: () => void;
  isOpen: boolean;
  onUpdateTask: (task: Task) => void;
} 