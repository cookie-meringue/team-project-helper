
import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { User, Team, TeamMember, Announcement, Issue } from '@/types';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  teamMembers: TeamMember[];
  setTeamMembers: (members: TeamMember[]) => void;
  announcements: Announcement[];
  setAnnouncements: (announcements: Announcement[]) => void;
  issues: Issue[];
  setIssues: (issues: Issue[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
  const [teams, setTeams] = useLocalStorage<Team[]>('teams', []);
  const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>('teamMembers', []);
  const [announcements, setAnnouncements] = useLocalStorage<Announcement[]>('announcements', []);
  const [issues, setIssues] = useLocalStorage<Issue[]>('issues', []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        teams,
        setTeams,
        teamMembers,
        setTeamMembers,
        announcements,
        setAnnouncements,
        issues,
        setIssues,
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
