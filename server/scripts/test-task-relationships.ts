import axios from 'axios';

interface Task {
  id: string;
  title: string;
  description: string;
  featureId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  progress: number;
  points: number;
  createdAt: string;
  dueDate: string;
  assignees: TaskAssignee[];
  stakeholders: TaskStakeholder[];
  notes?: TaskNote[];
  dependencies?: TaskDependency[];
}

interface TaskAssignee {
  id: string;
  memberId: string;
  role: string;
  member: {
    id: string;
    fullName: string;
    email: string;
    position: string;
    avatarUrl?: string;
  };
}

interface TaskStakeholder {
  stakeholder: {
    id: string;
    name: string;
    code: string;
    description?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    groupName?: string;
  }
}

interface TaskNote {
  id: string;
  content: string;
  author: {
    id: string;
    email: string;
    fullName: string;
    position: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

interface TaskDependency {
  id: string;
  taskId: string;
  dependentTaskId: string;
  dependencyType: 'BLOCKS' | 'BLOCKED_BY' | 'RELATED_TO';
  createdAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function testTaskRelationships() {
  try {
    console.log('Fetching all tasks...');
    const tasksResponse = await axios.get(`${API_BASE_URL}/tasks`);
    const { tasks, total } = tasksResponse.data;
    
    console.log(`Found ${total} tasks in total\n`);

    for (const task of tasks) {
      console.log(`\nAnalyzing Task: ${task.title} (ID: ${task.id})`);
      console.log('----------------------------------------');

      // Fetch detailed task information
      const detailedTask = await axios.get(`${API_BASE_URL}/tasks/${task.id}`);
      const taskData: Task = detailedTask.data;

      // Check assignees
      if (taskData.assignees.length > 0) {
        console.log('\nAssignees:');
        taskData.assignees.forEach(assignee => {
          console.log(`- ${assignee.member.fullName} (${assignee.role})`);
        });
      } else {
        console.log('\nNo assignees found');
      }

      // Check stakeholders
      if (taskData.stakeholders.length > 0) {
        console.log('\nStakeholders:');
        taskData.stakeholders.forEach(stakeholder => {
          console.log(`- ${stakeholder.stakeholder.name} (${stakeholder.stakeholder.code})`);
          if (stakeholder.stakeholder.contactName) {
            console.log(`  Contact: ${stakeholder.stakeholder.contactName} (${stakeholder.stakeholder.contactEmail})`);
          }
        });
      } else {
        console.log('\nNo stakeholders found');
      }

      // Check notes
      if (taskData.notes && taskData.notes.length > 0) {
        console.log('\nNotes:');
        taskData.notes.forEach(note => {
          console.log(`- ${note.content}`);
          console.log(`  By: ${note.author.fullName} at ${new Date(note.createdAt).toLocaleString()}`);
        });
      } else {
        console.log('\nNo notes found');
      }

      // Check dependencies
      if (taskData.dependencies && taskData.dependencies.length > 0) {
        console.log('\nDependencies:');
        for (const dependency of taskData.dependencies) {
          const dependentTask = await axios.get(`${API_BASE_URL}/tasks/${dependency.dependentTaskId}`);
          console.log(`- ${dependency.dependencyType}: ${dependentTask.data.title} (ID: ${dependency.dependentTaskId})`);
        }
      } else {
        console.log('\nNo dependencies found');
      }

      console.log('\nTask Details:');
      console.log(`Status: ${taskData.status}`);
      console.log(`Priority: ${taskData.priority}`);
      console.log(`Progress: ${taskData.progress}%`);
      console.log(`Points: ${taskData.points}`);
      console.log(`Due Date: ${new Date(taskData.dueDate).toLocaleDateString()}`);
      console.log('----------------------------------------\n');
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
  }
}

// Run the test
testTaskRelationships(); 