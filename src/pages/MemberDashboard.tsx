
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { MyRole } from '@/components/MyRole';
import { AnnouncementsList } from '@/components/AnnouncementsList';
import { IssuesManagement } from '@/components/IssuesManagement';
import { DocumentManagement } from '@/components/DocumentManagement';

export default function MemberDashboard() {
  const { currentUser, teams, setCurrentUser, loading } = useApp();
  const navigate = useNavigate();
  
  const currentTeam = teams.find(t => t.id === currentUser?.teamId);

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !currentTeam) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">팀 대시보드</h1>
            <p className="text-gray-600">{currentTeam.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>

        <Tabs defaultValue="role" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="role">내 역할</TabsTrigger>
            <TabsTrigger value="announcements">공지사항</TabsTrigger>
            <TabsTrigger value="issues">이슈</TabsTrigger>
            <TabsTrigger value="documents">문서</TabsTrigger>
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

          <TabsContent value="documents">
            <DocumentManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
