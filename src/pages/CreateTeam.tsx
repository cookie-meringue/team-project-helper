
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

export default function CreateTeam() {
  const [teamName, setTeamName] = useState('');
  const [maxMembers, setMaxMembers] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const { createTeam, createUser, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamName || !maxMembers || !leaderName) {
      alert('모든 필드를 입력해주세요');
      return;
    }

    try {
      // 먼저 사용자 생성
      const newUser = await createUser({
        name: leaderName,
        type: 'leader',
        teamId: '', // 팀 생성 후 업데이트
      });

      // 팀 생성
      const newTeam = await createTeam({
        name: teamName,
        maxMembers: parseInt(maxMembers),
        leaderId: newUser.id,
        leaderName: leaderName,
      });

      // 사용자의 팀 ID 업데이트
      const updatedUser = { ...newUser, teamId: newTeam.id };
      setCurrentUser(updatedUser);
      
      alert(`팀이 생성되었습니다! 당신의 사용자 ID: ${newUser.id}`);
      navigate('/leader-dashboard');
    } catch (error) {
      console.error('팀 생성 실패:', error);
      alert('팀 생성에 실패했습니다');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card>
          <CardHeader>
            <CardTitle>새 팀 생성</CardTitle>
            <CardDescription>
              협업을 위한 팀을 설정하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="leaderName">팀장 이름</Label>
                <Input
                  id="leaderName"
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="teamName">팀 이름</Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="팀 이름을 입력하세요"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="maxMembers">최대 멤버 수</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(e.target.value)}
                  placeholder="최대 멤버 수를 입력하세요"
                  min="2"
                  max="20"
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={() => navigate('/')} className="flex-1">
                  취소
                </Button>
                <Button type="submit" className="flex-1">
                  팀 생성
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
