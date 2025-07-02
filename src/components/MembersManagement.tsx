
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useApp } from '@/contexts/AppContext';
import { TeamMember } from '@/types';
import { User, Plus } from 'lucide-react';

export function MembersManagement() {
  const { currentUser, teamMembers, updateTeamMember } = useApp();
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newRole, setNewRole] = useState('');

  const currentTeamMembers = teamMembers.filter(m => m.teamId === currentUser?.teamId);

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      await updateTeamMember(memberId, { role: newRole });
      setEditingMember(null);
      setNewRole('');
    } catch (error) {
      console.error('역할 수정 실패:', error);
      alert('역할 수정에 실패했습니다');
    }
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm('정말로 이 멤버를 제거하시겠습니까?')) {
      // TODO: 멤버 제거 기능 구현 필요
      console.log('멤버 제거:', memberId);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            팀 멤버 ({currentTeamMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentTeamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingMember(member);
                          setNewRole(member.role);
                        }}
                      >
                        역할 수정
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{member.name}의 역할 수정</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="role">역할</Label>
                          <Input
                            id="role"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            placeholder="역할을 입력하세요"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleUpdateRole(member.id, newRole)}
                            className="flex-1"
                          >
                            역할 수정
                          </Button>
                          <Button variant="outline" onClick={() => setEditingMember(null)} className="flex-1">
                            취소
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    제거
                  </Button>
                </div>
              </div>
            ))}
            
            {currentTeamMembers.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                아직 팀원이 없습니다. QR 코드를 공유해서 팀원을 초대하세요!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
