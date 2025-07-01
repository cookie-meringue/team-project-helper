
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useApp();

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // 이미 로그인된 사용자라면 해당 대시보드로 리다이렉트
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.type === 'leader') {
        navigate('/leader-dashboard');
      } else {
        navigate('/member-dashboard');
      }
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        {currentUser && (
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600 mb-2">{currentUser.name}님으로 로그인됨</p>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        )}
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            팀 협업 서비스
          </h1>
          <p className="text-gray-600">
            대학 수업 팀 프로젝트를 위한 협업 도구
          </p>
        </div>

        <div className="space-y-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/login')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <LogIn className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>기존 계정 로그인</CardTitle>
              <CardDescription>
                이미 생성된 사용자 ID로 로그인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary" onClick={() => navigate('/login')}>
                로그인하기
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/create-team')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>팀 생성</CardTitle>
              <CardDescription>
                새로운 팀을 만들고 멤버를 초대하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate('/create-team')}>
                새 팀 만들기
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/join-team')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>팀 참여</CardTitle>
              <CardDescription>
                QR 코드를 스캔하여 기존 팀에 참여하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" onClick={() => navigate('/join-team')}>
                기존 팀 참여하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
