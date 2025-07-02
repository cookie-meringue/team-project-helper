
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { User, Team, TeamMember, Announcement, Issue } from '@/types';
import { useSupabaseData, Document } from '@/hooks/useSupabaseData';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  teams: Team[];
  teamMembers: TeamMember[];
  announcements: Announcement[];
  issues: Issue[];
  documents: Document[];
  loading: boolean;
  createUser: (userData: Omit<User, 'id'>) => Promise<User>;
  createTeam: (teamData: Omit<Team, 'id' | 'createdAt'>) => Promise<Team>;
  createTeamMember: (memberData: Omit<TeamMember, 'id' | 'joinedAt'>) => Promise<TeamMember>;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => Promise<TeamMember>;
  createAnnouncement: (announcementData: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Announcement>;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => Promise<Announcement>;
  deleteAnnouncement: (id: string) => Promise<void>;
  createIssue: (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Issue>;
  updateIssue: (id: string, updates: Partial<Issue>) => Promise<Issue>;
  deleteIssue: (id: string) => Promise<void>;
  uploadDocument: (file: File, title: string, description: string, teamId: string, uploadedBy: string) => Promise<Document>;
  getDocumentUrl: (filePath: string) => Promise<string | undefined>;
  refetch: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const supabaseData = useSupabaseData();

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        ...supabaseData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
