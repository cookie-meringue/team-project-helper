
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useApp } from '@/contexts/AppContext';
import { Announcement } from '@/types';
import { MessageSquare, Plus } from 'lucide-react';

export function AnnouncementsManagement() {
  const { currentUser, announcements, setAnnouncements } = useApp();
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const currentTeamAnnouncements = announcements
    .filter(a => a.teamId === currentUser?.teamId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleCreateAnnouncement = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      teamId: currentUser?.teamId || '',
      title: newTitle,
      content: newContent,
      createdBy: currentUser?.name || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAnnouncements([...announcements, newAnnouncement]);
    setNewTitle('');
    setNewContent('');
    setIsDialogOpen(false);
  };

  const handleUpdateAnnouncement = () => {
    if (!editingAnnouncement || !newTitle.trim() || !newContent.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setAnnouncements(
      announcements.map(a =>
        a.id === editingAnnouncement.id
          ? { ...a, title: newTitle, content: newContent, updatedAt: new Date().toISOString() }
          : a
      )
    );
    
    setEditingAnnouncement(null);
    setNewTitle('');
    setNewContent('');
    setIsDialogOpen(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setNewTitle(announcement.title);
    setNewContent(announcement.content);
    setIsDialogOpen(true);
  };

  const resetDialog = () => {
    setEditingAnnouncement(null);
    setNewTitle('');
    setNewContent('');
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Announcements ({currentTeamAnnouncements.length})
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Enter announcement title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Enter announcement content"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={editingAnnouncement ? handleUpdateAnnouncement : handleCreateAnnouncement}
                      className="flex-1"
                    >
                      {editingAnnouncement ? 'Update' : 'Create'}
                    </Button>
                    <Button variant="outline" onClick={resetDialog} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentTeamAnnouncements.map((announcement) => (
              <div key={announcement.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{announcement.title}</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openEditDialog(announcement)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
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
                No announcements yet. Create your first announcement!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
