// Data service for handling data persistence

// Types
export interface Project {
  id: string;
  name: string;
  description: string;
  tasksCount: number;
  completedTasks: number;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  startDate: string;
  dueDate: string;
  completed: boolean;
  dependencies: string[];
}

export interface Document {
  id: string;
  title: string;
  type: 'file' | 'link';
  url: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  createdAt: string;
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Optimization',
    description: 'Improve website performance and SEO ranking',
    tasksCount: 12,
    completedTasks: 5,
    createdAt: new Date('2025-02-15').toISOString()
  },
  {
    id: '2',
    name: 'Content Strategy',
    description: 'Develop content strategy for Q2',
    tasksCount: 8,
    completedTasks: 2,
    createdAt: new Date('2025-03-01').toISOString()
  },
  {
    id: '3',
    name: 'Keyword Research',
    description: 'Research and identify high-value keywords for our industry',
    tasksCount: 5,
    completedTasks: 0,
    createdAt: new Date('2025-03-05').toISOString()
  },
  {
    id: '4',
    name: 'Backlink Building',
    description: 'Develop and implement a strategy to increase quality backlinks',
    tasksCount: 7,
    completedTasks: 3,
    createdAt: new Date('2025-02-20').toISOString()
  }
];

const mockTasks: Task[] = [
  {
    id: '101',
    projectId: '1',
    title: 'Perform keyword research',
    description: 'Research and identify high-value keywords for our industry',
    priority: 'high',
    status: 'completed',
    startDate: new Date('2025-02-16').toISOString(),
    dueDate: new Date('2025-02-20').toISOString(),
    completed: true,
    dependencies: []
  },
  {
    id: '102',
    projectId: '1',
    title: 'Optimize meta tags',
    description: 'Update title tags and meta descriptions based on keyword research',
    priority: 'high',
    status: 'in-progress',
    startDate: new Date('2025-02-21').toISOString(),
    dueDate: new Date('2025-02-25').toISOString(),
    completed: false,
    dependencies: ['101']
  },
  {
    id: '103',
    projectId: '1',
    title: 'Improve page load speed',
    description: 'Optimize images and implement lazy loading',
    priority: 'medium',
    status: 'in-queue',
    startDate: new Date('2025-02-26').toISOString(),
    dueDate: new Date('2025-03-05').toISOString(),
    completed: false,
    dependencies: []
  },
  {
    id: '201',
    projectId: '2',
    title: 'Content audit',
    description: 'Audit existing content and identify gaps',
    priority: 'high',
    status: 'in-progress',
    startDate: new Date('2025-03-02').toISOString(),
    dueDate: new Date('2025-03-10').toISOString(),
    completed: false,
    dependencies: []
  },
  {
    id: '202',
    projectId: '2',
    title: 'Create content calendar',
    description: 'Plan content topics and publishing schedule',
    priority: 'medium',
    status: 'in-queue',
    startDate: new Date('2025-03-05').toISOString(),
    dueDate: new Date('2025-03-15').toISOString(),
    completed: false,
    dependencies: ['201']
  }
];

// Storage keys
const PROJECTS_KEY = 'seoProjects';
const TASKS_KEY = 'seoTasks';
const PROJECT_DOCS_KEY_PREFIX = 'seoProjectDocs_';
const SETTINGS_KEY = 'seoSettings';

// Local storage service
class LocalStorageService {
  // Projects
  getProjects(): Project[] {
    if (typeof window === 'undefined') return [];
    
    const storedProjects = localStorage.getItem(PROJECTS_KEY);
    if (storedProjects) {
      try {
        return JSON.parse(storedProjects);
      } catch (error) {
        console.error('Error parsing projects from localStorage:', error);
        return mockProjects;
      }
    }
    
    // Initialize with mock data if not found
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(mockProjects));
    return mockProjects;
  }
  
  saveProjects(projects: Project[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }
  
  // Tasks
  getTasks(): Task[] {
    if (typeof window === 'undefined') return [];
    
    const storedTasks = localStorage.getItem(TASKS_KEY);
    if (storedTasks) {
      try {
        return JSON.parse(storedTasks);
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
        return mockTasks;
      }
    }
    
    // Initialize with mock data if not found
    localStorage.setItem(TASKS_KEY, JSON.stringify(mockTasks));
    return mockTasks;
  }
  
  getProjectTasks(projectId: string): Task[] {
    return this.getTasks().filter(task => task.projectId === projectId);
  }
  
  saveTasks(tasks: Task[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }
  
  // Documents
  getProjectDocuments(projectId: string): Document[] {
    if (typeof window === 'undefined') return [];
    
    const key = `${PROJECT_DOCS_KEY_PREFIX}${projectId}`;
    const storedDocs = localStorage.getItem(key);
    if (storedDocs) {
      try {
        return JSON.parse(storedDocs);
      } catch (error) {
        console.error('Error parsing documents from localStorage:', error);
        return [];
      }
    }
    
    return [];
  }
  
  saveProjectDocuments(projectId: string, documents: Document[]): void {
    if (typeof window === 'undefined') return;
    const key = `${PROJECT_DOCS_KEY_PREFIX}${projectId}`;
    localStorage.setItem(key, JSON.stringify(documents));
  }
  
  // Settings
  getSettings(): any {
    if (typeof window === 'undefined') return {};
    
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
      try {
        return JSON.parse(storedSettings);
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
        return {};
      }
    }
    
    return {};
  }
  
  saveSettings(settings: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
  
  // Export all data
  exportAllData(): string {
    if (typeof window === 'undefined') return '';
    
    const data = {
      projects: this.getProjects(),
      tasks: this.getTasks(),
      settings: this.getSettings(),
      documents: {} as Record<string, Document[]>
    };
    
    // Get all project documents
    data.projects.forEach(project => {
      data.documents[project.id] = this.getProjectDocuments(project.id);
    });
    
    return JSON.stringify(data, null, 2);
  }
  
  // Import all data
  importAllData(jsonData: string): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.projects || !data.tasks || !data.settings || !data.documents) {
        throw new Error('Invalid data structure');
      }
      
      // Import projects
      this.saveProjects(data.projects);
      
      // Import tasks
      this.saveTasks(data.tasks);
      
      // Import settings
      this.saveSettings(data.settings);
      
      // Import documents
      Object.entries(data.documents).forEach(([projectId, docs]) => {
        this.saveProjectDocuments(projectId, docs as Document[]);
      });
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
  
  // Clear all data
  clearAllData(): void {
    if (typeof window === 'undefined') return;
    
    // Get all keys that start with 'seo'
    const keys = Object.keys(localStorage).filter(key => key.startsWith('seo'));
    
    // Remove all keys
    keys.forEach(key => localStorage.removeItem(key));
  }
  
  // Delete multiple projects
  deleteProjects(projectIds: string[]): void {
    if (typeof window === 'undefined') return;
    
    // Get current projects
    const projects = this.getProjects();
    
    // Filter out the projects to delete
    const updatedProjects = projects.filter(project => !projectIds.includes(project.id));
    
    // Save the updated projects
    this.saveProjects(updatedProjects);
    
    // Get all tasks
    const allTasks = this.getTasks();
    
    // Filter out tasks associated with deleted projects
    const updatedTasks = allTasks.filter(task => !projectIds.includes(task.projectId));
    
    // Save the updated tasks
    this.saveTasks(updatedTasks);
    
    // Delete documents for each project
    projectIds.forEach(projectId => {
      const key = `${PROJECT_DOCS_KEY_PREFIX}${projectId}`;
      localStorage.removeItem(key);
    });
  }
}

// Export an instance of the service
export const dataService = new LocalStorageService();
