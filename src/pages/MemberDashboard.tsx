
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { MyRole } from '@/components/MyRole';
import { AnnouncementsList } from '@/components/AnnouncementsList';
import { IssuesManagement } from '@/components/IssuesManagement';

export default function MemberDashboard() {
  const { currentUser, teams } = useApp();
  const navigate = useNavigate();
  
  const currentTeam = teams.find(t => t.id === currentUser?.teamId);

  if (!currentUser || !currentTeam) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Dashboard</h1>
            <p className="text-gray-600">{currentTeam.name}</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="role" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="role">My Role</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>

          <TabsContent value="role">
            <MyRole />
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementsList />
          </TabsContent>

          <TabsContent value="issues">
            <IssuesManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
