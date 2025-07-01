
export interface User {
  id: string;
  name: string;
  type: 'leader' | 'member';
  teamId?: string;
}

export interface Team {
  id: string;
  name: string;
  maxMembers: number;
  leaderId: string;
  leaderName: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  teamId: string;
  role: string;
  joinedAt: string;
}

export interface Announcement {
  id: string;
  teamId: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Issue {
  id: string;
  teamId: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: 'open' | 'in-progress' | 'resolved';
}
