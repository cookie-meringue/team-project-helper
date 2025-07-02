
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { Issue } from '@/types';
import { MessageSquare, Plus } from 'lucide-react';

export function IssuesManagement() {
  const { currentUser, issues, createIssue, updateIssue, deleteIssue } = useApp();
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const currentTeamIssues = issues
    .filter(i => i.teamId === currentUser?.teamId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleCreateIssue = async () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      alert('모든 필드를 입력해주세요');
      return;
    }

    try {
      await createIssue({
        teamId: currentUser?.teamId || '',
        title: newTitle,
        description: newDescription,
        createdBy: currentUser?.name || '',
        status: 'open' as const,
      });

      setNewTitle('');
      setNewDescription('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('이슈 생성 실패:', error);
      alert('이슈 생성에 실패했습니다');
    }
  };

  const handleUpdateIssue = async () => {
    if (!editingIssue || !newTitle.trim() || !newDescription.trim()) {
      alert('모든 필드를 입력해주세요');
      return;
    }

    try {
      await updateIssue(editingIssue.id, {
        title: newTitle,
        description: newDescription,
      });
      
      setEditingIssue(null);
      setNewTitle('');
      setNewDescription('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('이슈 수정 실패:', error);
      alert('이슈 수정에 실패했습니다');
    }
  };

  const handleUpdateStatus = async (issueId: string, status: 'open' | 'in-progress' | 'resolved') => {
    try {
      await updateIssue(issueId, { status });
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다');
    }
  };

  const handleDeleteIssue = async (id: string) => {
    if (confirm('정말로 이 이슈를 삭제하시겠습니까?')) {
      try {
        await deleteIssue(id);
      } catch (error) {
        console.error('이슈 삭제 실패:', error);
        alert('이슈 삭제에 실패했습니다');
      }
    }
  };

  const openEditDialog = (issue: Issue) => {
    setEditingIssue(issue);
    setNewTitle(issue.title);
    setNewDescription(issue.description);
    setIsDialogOpen(true);
  };

  const resetDialog = () => {
    setEditingIssue(null);
    setNewTitle('');
    setNewDescription('');
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return '열린 상태';
      case 'in-progress': return '진행 중';
      case 'resolved': return '해결됨';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              이슈 ({currentTeamIssues.length})
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  새 이슈
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingIssue ? '이슈 수정' : '새 이슈 생성'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">제목</Label>
                    <Input
                      id="title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="이슈 제목을 입력하세요"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">설명</Label>
                    <Textarea
                      id="description"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="이슈를 자세히 설명해주세요"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={editingIssue ? handleUpdateIssue : handleCreateIssue}
                      className="flex-1"
                    >
                      {editingIssue ? '수정' : '생성'}
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
            {currentTeamIssues.map((issue) => (
              <div key={issue.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{issue.title}</h3>
                      <Badge className={getStatusColor(issue.status)}>
                        {getStatusText(issue.status)}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-2">{issue.description}</p>
                    <div className="text-sm text-gray-500">
                      작성자: {issue.createdBy} • {new Date(issue.createdAt).toLocaleDateString()}
                      {issue.updatedAt !== issue.createdAt && (
                        <span> • 수정됨: {new Date(issue.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <div className="flex gap-2">
                      {issue.createdBy === currentUser?.name && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditDialog(issue)}
                          >
                            수정
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteIssue(issue.id)}
                          >
                            삭제
                          </Button>
                        </>
                      )}
                    </div>
                    <Select
                      value={issue.status}
                      onValueChange={(value) => handleUpdateStatus(issue.id, value as any)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">열린 상태</SelectItem>
                        <SelectItem value="in-progress">진행 중</SelectItem>
                        <SelectItem value="resolved">해결됨</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
            
            {currentTeamIssues.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                아직 이슈가 없습니다. 첫 번째 이슈를 생성해보세요!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
