
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Team, TeamMember, Announcement, Issue } from '@/types';

export interface Document {
  id: string;
  team_id: string;
  title: string;
  description?: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  version: number;
  uploaded_by: string;
  created_at: string;
  is_latest: boolean;
}

export function useSupabaseData() {
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    try {
      const [usersRes, teamsRes, membersRes, announcementsRes, issuesRes, documentsRes] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('teams').select('*'),
        supabase.from('team_members').select('*'),
        supabase.from('announcements').select('*'),
        supabase.from('issues').select('*'),
        supabase.from('documents').select('*')
      ]);

      if (usersRes.data) setUsers(usersRes.data.map(mapSupabaseUser));
      if (teamsRes.data) setTeams(teamsRes.data.map(mapSupabaseTeam));
      if (membersRes.data) setTeamMembers(membersRes.data.map(mapSupabaseTeamMember));
      if (announcementsRes.data) setAnnouncements(announcementsRes.data.map(mapSupabaseAnnouncement));
      if (issuesRes.data) setIssues(issuesRes.data.map(mapSupabaseIssue));
      if (documentsRes.data) setDocuments(documentsRes.data);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // User operations
  const createUser = async (userData: Omit<User, 'id'>) => {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: userData.name,
        type: userData.type,
        team_id: userData.teamId || null
      })
      .select()
      .single();

    if (error) throw error;
    const newUser = mapSupabaseUser(data);
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  // Team operations
  const createTeam = async (teamData: Omit<Team, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('teams')
      .insert({
        name: teamData.name,
        max_members: teamData.maxMembers,
        leader_id: teamData.leaderId,
        leader_name: teamData.leaderName
      })
      .select()
      .single();

    if (error) throw error;
    const newTeam = mapSupabaseTeam(data);
    setTeams(prev => [...prev, newTeam]);
    return newTeam;
  };

  // TeamMember operations
  const createTeamMember = async (memberData: Omit<TeamMember, 'id' | 'joinedAt'>) => {
    const { data, error } = await supabase
      .from('team_members')
      .insert({
        name: memberData.name,
        team_id: memberData.teamId,
        role: memberData.role
      })
      .select()
      .single();

    if (error) throw error;
    const newMember = mapSupabaseTeamMember(data);
    setTeamMembers(prev => [...prev, newMember]);
    return newMember;
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    const { data, error } = await supabase
      .from('team_members')
      .update({ role: updates.role })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    const updatedMember = mapSupabaseTeamMember(data);
    setTeamMembers(prev => prev.map(m => m.id === id ? updatedMember : m));
    return updatedMember;
  };

  // Announcement operations
  const createAnnouncement = async (announcementData: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase
      .from('announcements')
      .insert({
        team_id: announcementData.teamId,
        title: announcementData.title,
        content: announcementData.content,
        created_by: announcementData.createdBy
      })
      .select()
      .single();

    if (error) throw error;
    const newAnnouncement = mapSupabaseAnnouncement(data);
    setAnnouncements(prev => [...prev, newAnnouncement]);
    return newAnnouncement;
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    const { data, error } = await supabase
      .from('announcements')
      .update({
        title: updates.title,
        content: updates.content,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    const updatedAnnouncement = mapSupabaseAnnouncement(data);
    setAnnouncements(prev => prev.map(a => a.id === id ? updatedAnnouncement : a));
    return updatedAnnouncement;
  };

  const deleteAnnouncement = async (id: string) => {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // Issue operations
  const createIssue = async (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase
      .from('issues')
      .insert({
        team_id: issueData.teamId,
        title: issueData.title,
        description: issueData.description,
        created_by: issueData.createdBy,
        status: issueData.status
      })
      .select()
      .single();

    if (error) throw error;
    const newIssue = mapSupabaseIssue(data);
    setIssues(prev => [...prev, newIssue]);
    return newIssue;
  };

  const updateIssue = async (id: string, updates: Partial<Issue>) => {
    const { data, error } = await supabase
      .from('issues')
      .update({
        title: updates.title,
        description: updates.description,
        status: updates.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    const updatedIssue = mapSupabaseIssue(data);
    setIssues(prev => prev.map(i => i.id === id ? updatedIssue : i));
    return updatedIssue;
  };

  const deleteIssue = async (id: string) => {
    const { error } = await supabase
      .from('issues')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setIssues(prev => prev.filter(i => i.id !== id));
  };

  // Document operations
  const uploadDocument = async (file: File, title: string, description: string, teamId: string, uploadedBy: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${teamId}/${title}_${Date.now()}.${fileExt}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('team-documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Create document record
    const { data, error } = await supabase
      .from('documents')
      .insert({
        team_id: teamId,
        title,
        description,
        file_path: fileName,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: uploadedBy
      })
      .select()
      .single();

    if (error) throw error;
    setDocuments(prev => [...prev, data]);
    return data;
  };

  const getDocumentUrl = async (filePath: string) => {
    const { data } = await supabase.storage
      .from('team-documents')
      .createSignedUrl(filePath, 3600); // 1시간 유효

    return data?.signedUrl;
  };

  return {
    users,
    teams,
    teamMembers,
    announcements,
    issues,
    documents,
    loading,
    createUser,
    createTeam,
    createTeamMember,
    updateTeamMember,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    createIssue,
    updateIssue,
    deleteIssue,
    uploadDocument,
    getDocumentUrl,
    refetch: fetchData
  };
}

// Mapper functions
function mapSupabaseUser(data: any): User {
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    teamId: data.team_id
  };
}

function mapSupabaseTeam(data: any): Team {
  return {
    id: data.id,
    name: data.name,
    maxMembers: data.max_members,
    leaderId: data.leader_id,
    leaderName: data.leader_name,
    createdAt: data.created_at
  };
}

function mapSupabaseTeamMember(data: any): TeamMember {
  return {
    id: data.id,
    name: data.name,
    teamId: data.team_id,
    role: data.role,
    joinedAt: data.joined_at
  };
}

function mapSupabaseAnnouncement(data: any): Announcement {
  return {
    id: data.id,
    teamId: data.team_id,
    title: data.title,
    content: data.content,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

function mapSupabaseIssue(data: any): Issue {
  return {
    id: data.id,
    teamId: data.team_id,
    title: data.title,
    description: data.description,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    status: data.status as 'open' | 'in-progress' | 'resolved'
  };
}
