
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QRScanner } from '@/components/QRScanner';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

export default function JoinTeam() {
  const [memberName, setMemberName] = useState('');
  const [scannedTeamId, setScannedTeamId] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const { teams, teamMembers, createTeamMember, createUser, setCurrentUser, refetch } = useApp();
  const navigate = useNavigate();

  const handleQRScan = (result: string) => {
    // QR 코드 데이터에서 팀 ID 추출
    const teamId = result.replace('team:', '');
    setScannedTeamId(teamId);
    setShowScanner(false);
  };

  const handleJoinTeam = async () => {
    if (!memberName || !scannedTeamId) {
      alert('이름을 입력하고 QR 코드를 스캔해주세요');
      return;
    }

    const team = teams.find(t => t.id === scannedTeamId);
    if (!team) {
      alert('팀을 찾을 수 없습니다');
      return;
    }

    const currentMembers = teamMembers.filter(m => m.teamId === scannedTeamId);
    if (currentMembers.length >= team.maxMembers) {
      alert('팀이 가득 찼습니다');
      return;
    }

    try {
      // 먼저 사용자 생성 (올바른 team_id와 함께)
      const newUser = await createUser({
        name: memberName,
        type: 'member',
        teamId: scannedTeamId,
      });

      // 팀 멤버 생성
      await createTeamMember({
        name: memberName,
        teamId: scannedTeamId,
        role: '팀원', // 기본 역할
      });

      setCurrentUser(newUser);
      
      // 데이터 새로고침
      await refetch();
      
      alert(`팀에 참여했습니다! 당신의 사용자 ID: ${newUser.id}`);
      navigate('/member-dashboard');
    } catch (error) {
      console.error('팀 참여 실패:', error);
      alert('팀 참여에 실패했습니다');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card>
          <CardHeader>
            <CardTitle>팀 참여</CardTitle>
            <CardDescription>
              QR 코드를 스캔하여 기존 팀에 참여하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="memberName">이름</Label>
              <Input
                id="memberName"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="이름을 입력하세요"
                required
              />
            </div>

            {!showScanner ? (
              <div className="text-center">
                <Button onClick={() => setShowScanner(true)} className="w-full">
                  QR 코드 스캔
                </Button>
                {scannedTeamId && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ QR 코드 스캔 완료
                  </p>
                )}
              </div>
            ) : (
              <div>
                <QRScanner
                  onScan={handleQRScan}
                  onError={(error) => alert(error)}
                />
              </div>
            )}

            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate('/')} className="flex-1">
                취소
              </Button>
              <Button 
                onClick={handleJoinTeam} 
                className="flex-1"
                disabled={!memberName || !scannedTeamId}
              >
                팀 참여
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
