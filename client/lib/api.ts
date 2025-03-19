// API client for fetching data from the server

/**
 * Base API URL for server endpoints
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Type definitions for API responses
 */
export interface Squad {
  id: string;
  name: string;
  code: string;
  description?: string;
  hasIncidentRoster: boolean;
}

export interface SquadMember {
  id: string;
  fullName: string;
  email: string;
  position: string;
  avatarUrl?: string;
  squadId: string;
  squadName?: string;
  pid: string;
}

export interface IncidentRotation {
  id: string;
  squadId: string;
  startDate: string;
  endDate: string;
  sprintNumber: number;
  primaryMemberId: string;
  secondaryMemberId: string;
  primaryMember: {
    id: string;
    fullName: string;
    email: string;
    position: string;
    avatarUrl?: string;
  };
  secondaryMember: {
    id: string;
    fullName: string;
    email: string;
    position: string;
    avatarUrl?: string;
  };
  swaps?: Array<{
    id: string;
    rotationId: string;
    requesterId: string;
    accepterId: string;
    swapDate: string;
    status: string;
    requester: {
      id: string;
      fullName: string;
      email: string;
      position: string;
      avatarUrl?: string;
    };
    accepter: {
      id: string;
      fullName: string;
      email: string;
      position: string;
      avatarUrl?: string;
    };
  }>;
}

/**
 * Interface for StandupHosting data
 */
export interface StandupHosting {
  id: string;
  squadId: string;
  memberId: string;
  date: string;
  status: string; // 'SCHEDULED', 'COMPLETED', 'CANCELLED'
  createdAt: string;
  updatedAt: string;
  member: {
    id: string;
    fullName: string;
    email: string;
    position: string;
    avatarUrl?: string;
  };
}

/**
 * Interface for detailed member information
 */
export interface MemberDetails extends SquadMember {
  squad: Squad;
  roles?: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  phone?: string;
}

export interface TaskAssignee {
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

export interface TaskStakeholder {
  id: string;
  name: string;
  code: string;
  description?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  groupName?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  progress: number;
  points: number;
  createdAt: string;
  dueDate: string;
  assignees: TaskAssignee[];
  stakeholders: TaskStakeholder[];
}

/**
 * Fetch all squads from the server
 */
export async function fetchSquads(): Promise<Squad[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/squads`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch squads: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching squads:', error);
    // Return empty array in case of error
    return [];
  }
}

/**
 * Fetch a single squad by ID
 */
export async function fetchSquadById(squadId: string): Promise<Squad | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/squads/${squadId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch squad: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching squad ${squadId}:`, error);
    return null;
  }
}

/**
 * Fetch all members of a specific squad
 */
export async function fetchSquadMembers(squadId: string): Promise<SquadMember[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/squads/${squadId}/members`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch squad members: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching members for squad ${squadId}:`, error);
    // Return empty array in case of error
    return [];
  }
}

/**
 * Fetch all members across all squads
 */
export async function fetchAllMembers(): Promise<SquadMember[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/members`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch members: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all members:', error);
    // Return empty array in case of error
    return [];
  }
}

/**
 * Fetch a single member by ID
 */
export async function fetchMemberById(memberId: string): Promise<SquadMember | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/members/${memberId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch member: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching member ${memberId}:`, error);
    return null;
  }
}

/**
 * Fetch incident rotation data for a specific squad
 * Optional date range parameters can be provided
 */
export async function fetchIncidentRotation(
  squadId: string, 
  startDate?: string, 
  endDate?: string
): Promise<IncidentRotation[]> {
  try {
    let url = `${API_BASE_URL}/calendar/incident-rotation/${squadId}`;
    
    // Add query parameters if provided
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch incident rotation: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching incident rotation for squad ${squadId}:`, error);
    // Return empty array in case of error
    return [];
  }
}

/**
 * Fetch standup hosting data for a specific squad
 * Optional date range parameters can be provided
 */
export async function fetchStandupHosting(
  squadId: string, 
  startDate?: string, 
  endDate?: string
): Promise<StandupHosting[]> {
  try {
    let url = `${API_BASE_URL}/calendar/standup-hosting/${squadId}`;
    
    // Add query parameters if provided
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch standup hosting: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching standup hosting for squad ${squadId}:`, error);
    // Return empty array in case of error
    return [];
  }
}

/**
 * Fetch detailed information of a squad member
 */
export async function fetchMemberDetails(memberId: string): Promise<MemberDetails | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/squads/members/${memberId}/details`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch member details: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching member details ${memberId}:`, error);
    return null;
  }
}

/**
 * Fetch standup hosting history for a member
 * Optional date range parameters can be provided
 */
export async function fetchMemberStandupHistory(
  memberId: string,
  startDate?: string,
  endDate?: string
): Promise<StandupHosting[]> {
  try {
    let url = `${API_BASE_URL}/calendar/standup-hosting/history/${memberId}`;
    
    // Add query parameters if provided
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch standup history: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching standup history for member ${memberId}:`, error);
    return [];
  }
}

/**
 * Fetch incident rotation history for a member
 * Optional date range parameters can be provided
 */
export async function fetchMemberIncidentHistory(
  memberId: string,
  startDate?: string,
  endDate?: string
): Promise<IncidentRotation[]> {
  try {
    let url = `${API_BASE_URL}/calendar/incident-rotation/history/${memberId}`;
    
    // Add query parameters if provided
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch incident rotation history: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching incident rotation history for member ${memberId}:`, error);
    return [];
  }
}

/**
 * Fetch tasks with optional filters
 */
export async function fetchTasks(params?: {
  featureId?: string;
  assignedTo?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<{ tasks: Task[]; total: number }> {
  try {
    let url = `${API_BASE_URL}/tasks`;
    
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return { tasks: [], total: 0 };
  }
}

/**
 * Fetch a single task by ID
 */
export async function fetchTaskById(taskId: string): Promise<Task | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch task: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching task ${taskId}:`, error);
    return null;
  }
} 