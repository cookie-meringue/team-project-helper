
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { MembersManagement } from '@/components/MembersManagement';
import { AnnouncementsManagement } from '@/components/AnnouncementsManagement';
import { IssuesManagement } from '@/components/IssuesManagement';
import { DocumentManagement } from '@/components/DocumentManagement';

export default function LeaderDashboard() {
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

  // 사용자나 팀이 없을 때 홈으로 리다이렉트하지 않고 에러 메시지 표시
  if (!currentUser || !currentTeam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">접근할 수 없습니다</h2>
          <p className="text-gray-600 mb-4">로그인하거나 팀을 생성해주세요.</p>
          <Button onClick={() => navigate('/')}>홈으로 이동</Button>
        </div>
      </div>
    );
  }

  const qrValue = `team:${currentTeam.id}`;

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

        <Tabs defaultValue="members" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="members">멤버 & 역할</TabsTrigger>
            <TabsTrigger value="announcements">공지사항</TabsTrigger>
            <TabsTrigger value="issues">이슈</TabsTrigger>
            <TabsTrigger value="documents">문서</TabsTrigger>
            <TabsTrigger value="qr">QR 코드</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <MembersManagement />
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementsManagement />
          </TabsContent>

          <TabsContent value="issues">
            <IssuesManagement />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentManagement />
          </TabsContent>

          <TabsContent value="qr">
            <Card>
              <CardHeader>
                <CardTitle>팀 QR 코드</CardTitle>
                <CardDescription>
                  이 QR 코드를 팀원들과 공유하여 팀 참여를 도와주세요
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <QRCodeGenerator value={qrValue} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
