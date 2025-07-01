
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { MessageSquare } from 'lucide-react';

export function AnnouncementsList() {
  const { currentUser, announcements } = useApp();
  
  const currentTeamAnnouncements = announcements
    .filter(a => a.teamId === currentUser?.teamId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Team Announcements ({currentTeamAnnouncements.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentTeamAnnouncements.map((announcement) => (
            <div key={announcement.id} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
              <p className="text-gray-700 mb-2">{announcement.content}</p>
              <div className="text-sm text-gray-500">
                By {announcement.createdBy} • {new Date(announcement.createdAt).toLocaleDateString()}
                {announcement.updatedAt !== announcement.createdAt && (
                  <span> • Updated {new Date(announcement.updatedAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
          
          {currentTeamAnnouncements.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No announcements yet. Check back later!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
