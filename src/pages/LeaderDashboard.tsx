
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { MembersManagement } from '@/components/MembersManagement';
import { AnnouncementsManagement } from '@/components/AnnouncementsManagement';

export default function LeaderDashboard() {
  const { currentUser, teams } = useApp();
  const navigate = useNavigate();
  
  const currentTeam = teams.find(t => t.id === currentUser?.teamId);

  if (!currentUser || !currentTeam) {
    navigate('/');
    return null;
  }

  const qrValue = `team:${currentTeam.id}`;

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

        <Tabs defaultValue="members" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="members">Members & Roles</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <MembersManagement />
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementsManagement />
          </TabsContent>

          <TabsContent value="qr">
            <Card>
              <CardHeader>
                <CardTitle>Team QR Code</CardTitle>
                <CardDescription>
                  Share this QR code with team members to let them join
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
