
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
import { useToast } from '@/components/ui/use-toast';

export function AnnouncementsManagement() {
  const { currentUser, announcements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useApp();
  const { toast } = useToast();
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const currentTeamAnnouncements = announcements
    .filter(a => a.teamId === currentUser?.teamId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleCreateAnnouncement = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast({
        title: "오류",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createAnnouncement({
        teamId: currentUser?.teamId || '',
        title: newTitle,
        content: newContent,
        createdBy: currentUser?.name || '',
      });

      toast({
        title: "성공",
        description: "공지사항이 성공적으로 작성되었습니다.",
      });

      setNewTitle('');
      setNewContent('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('공지사항 작성 실패:', error);
      toast({
        title: "오류",
        description: "공지사항 작성에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAnnouncement = async () => {
    if (!editingAnnouncement || !newTitle.trim() || !newContent.trim()) {
      toast({
        title: "오류",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateAnnouncement(editingAnnouncement.id, {
        title: newTitle,
        content: newContent,
      });

      toast({
        title: "성공",
        description: "공지사항이 성공적으로 수정되었습니다.",
      });
      
      setEditingAnnouncement(null);
      setNewTitle('');
      setNewContent('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('공지사항 수정 실패:', error);
      toast({
        title: "오류",
        description: "공지사항 수정에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (confirm('이 공지사항을 삭제하시겠습니까?')) {
      try {
        await deleteAnnouncement(id);
        toast({
          title: "성공",
          description: "공지사항이 삭제되었습니다.",
        });
      } catch (error) {
        console.error('공지사항 삭제 실패:', error);
        toast({
          title: "오류",
          description: "공지사항 삭제에 실패했습니다.",
          variant: "destructive",
        });
      }
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
              공지사항 ({currentTeamAnnouncements.length})
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  새 공지사항
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingAnnouncement ? '공지사항 수정' : '새 공지사항 작성'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">제목</Label>
                    <Input
                      id="title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="공지사항 제목을 입력하세요"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">내용</Label>
                    <Textarea
                      id="content"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="공지사항 내용을 입력하세요"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={editingAnnouncement ? handleUpdateAnnouncement : handleCreateAnnouncement}
                      className="flex-1"
                    >
                      {editingAnnouncement ? '수정' : '작성'}
                    </Button>
                    <Button variant="outline" onClick={resetDialog} className="flex-1">
                      취소
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
                      수정
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{announcement.content}</p>
                <div className="text-sm text-gray-500">
                  작성자: {announcement.createdBy} • {new Date(announcement.createdAt).toLocaleDateString()}
                  {announcement.updatedAt !== announcement.createdAt && (
                    <span> • 수정됨: {new Date(announcement.updatedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
            
            {currentTeamAnnouncements.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                아직 공지사항이 없습니다. 첫 번째 공지사항을 작성해보세요!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
