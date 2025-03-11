// Utility functions to generate random demo data for non-logged-in users

import { dataService } from '@/services/dataService';

// SEO-related keywords for generating realistic project and task names
const seoKeywords = [
  'keyword research',
  'content optimization',
  'backlink building',
  'meta tags',
  'site speed',
  'mobile optimization',
  'local SEO',
  'schema markup',
  'SERP analysis',
  'competitor analysis',
  'content strategy',
  'on-page SEO',
  'off-page SEO',
  'technical SEO',
  'SEO audit',
  'analytics setup',
  'rank tracking',
  'featured snippets',
  'voice search',
  'user experience',
  'internal linking',
  'site architecture',
  'image optimization',
  'video SEO',
  'social signals'
];

// Project name templates
const projectTemplates = [
  '{keyword} Campaign',
  '{keyword} Strategy',
  '{keyword} Improvement',
  '{keyword} Optimization',
  'Q2 {keyword}',
  'Website {keyword}',
  'E-commerce {keyword}',
  'Blog {keyword}',
  '{keyword} Revamp',
  '{keyword} Analysis'
];

// Task name templates
const taskTemplates = [
  'Research {keyword} opportunities',
  'Implement {keyword} best practices',
  'Analyze {keyword} performance',
  'Create {keyword} report',
  'Update {keyword} elements',
  'Review {keyword} metrics',
  'Optimize {keyword} strategy',
  'Document {keyword} process',
  'Test {keyword} implementation',
  'Monitor {keyword} results'
];

// Generate a random date between start and end dates
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Get a random item from an array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate a random project name
const generateProjectName = (): string => {
  const template = getRandomItem(projectTemplates);
  const keyword = getRandomItem(seoKeywords);
  return template.replace('{keyword}', keyword);
};

// Generate a random task name
const generateTaskName = (): string => {
  const template = getRandomItem(taskTemplates);
  const keyword = getRandomItem(seoKeywords);
  return template.replace('{keyword}', keyword);
};

// Generate a random project description
const generateProjectDescription = (): string => {
  const descriptions = [
    `Improve our ${getRandomItem(seoKeywords)} strategy to increase organic traffic and conversions.`,
    `Develop a comprehensive ${getRandomItem(seoKeywords)} plan to outrank competitors.`,
    `Implement ${getRandomItem(seoKeywords)} best practices to boost search engine visibility.`,
    `Analyze and optimize ${getRandomItem(seoKeywords)} to improve SERP rankings.`,
    `Create a data-driven ${getRandomItem(seoKeywords)} approach to maximize ROI.`
  ];
  return getRandomItem(descriptions);
};

// Generate a random task description
const generateTaskDescription = (): string => {
  const descriptions = [
    `Research current ${getRandomItem(seoKeywords)} trends and implement findings.`,
    `Analyze competitor ${getRandomItem(seoKeywords)} strategies and identify opportunities.`,
    `Create a detailed report on ${getRandomItem(seoKeywords)} performance metrics.`,
    `Optimize website ${getRandomItem(seoKeywords)} based on latest algorithm updates.`,
    `Document ${getRandomItem(seoKeywords)} processes for team reference and training.`
  ];
  return getRandomItem(descriptions);
};

// Generate a random priority
const generatePriority = (): string => {
  const priorities = ['low', 'medium', 'high'];
  const weights = [0.2, 0.5, 0.3]; // 20% low, 50% medium, 30% high
  
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < priorities.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return priorities[i];
    }
  }
  
  return 'medium';
};

// Generate a random status
const generateStatus = (): string => {
  const statuses = ['in-queue', 'in-progress', 'blocked', 'completed'];
  const weights = [0.3, 0.4, 0.1, 0.2]; // 30% in-queue, 40% in-progress, 10% blocked, 20% completed
  
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < statuses.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return statuses[i];
    }
  }
  
  return 'in-progress';
};

// Generate a demo project
const generateDemoProject = (id: string): any => {
  const now = new Date();
  const twoMonthsAgo = new Date(now);
  twoMonthsAgo.setMonth(now.getMonth() - 2);
  
  return {
    id,
    name: generateProjectName(),
    description: generateProjectDescription(),
    tasksCount: 0, // Will be updated after tasks are generated
    completedTasks: 0, // Will be updated after tasks are generated
    createdAt: randomDate(twoMonthsAgo, now).toISOString()
  };
};

// Generate a demo task
const generateDemoTask = (id: string, projectId: string, dependencies: string[] = []): any => {
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);
  
  const oneMonthLater = new Date(now);
  oneMonthLater.setMonth(now.getMonth() + 1);
  
  const startDate = randomDate(oneMonthAgo, now);
  const dueDate = randomDate(now, oneMonthLater);
  
  const status = generateStatus();
  const completed = status === 'completed';
  
  return {
    id,
    projectId,
    title: generateTaskName(),
    description: generateTaskDescription(),
    priority: generatePriority(),
    status,
    startDate: startDate.toISOString(),
    dueDate: dueDate.toISOString(),
    completed,
    dependencies
  };
};

// Generate a complete demo project with tasks
export const generateDemoProjectWithTasks = (): void => {
  // Generate project
  const projectId = `demo-${Date.now()}`;
  const project = generateDemoProject(projectId);
  
  // Generate 5 tasks for the project
  const tasks = [];
  const taskIds = [];
  
  for (let i = 0; i < 5; i++) {
    const taskId = `task-${Date.now()}-${i}`;
    taskIds.push(taskId);
    
    // For some tasks, add dependencies to previous tasks
    const dependencies: string[] = [];
    if (i > 0 && Math.random() > 0.5) {
      // 50% chance to add a dependency to a previous task
      const randomPreviousTask = taskIds[Math.floor(Math.random() * (i))];
      dependencies.push(randomPreviousTask);
    }
    
    const task = generateDemoTask(taskId, projectId, dependencies);
    tasks.push(task);
  }
  
  // Update project with task counts
  const completedTasks = tasks.filter(task => task.completed).length;
  project.tasksCount = tasks.length;
  project.completedTasks = completedTasks;
  
  // Save to localStorage
  const existingProjects = dataService.getProjects();
  const existingTasks = dataService.getTasks();
  
  // Only add the demo project if there are no projects yet
  if (existingProjects.length === 0) {
    dataService.saveProjects([project]);
    dataService.saveTasks(tasks);
  }
};
