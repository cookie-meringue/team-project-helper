
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [userId, setUserId] = useState('');
  const { users, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      alert('사용자 ID를 입력해주세요');
      return;
    }

    const user = users.find(u => u.id === userId.trim());
    if (!user) {
      alert('존재하지 않는 사용자 ID입니다');
      return;
    }

    setCurrentUser(user);
    
    if (user.type === 'leader') {
      navigate('/leader-dashboard');
    } else {
      navigate('/member-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card>
          <CardHeader>
            <CardTitle>로그인</CardTitle>
            <CardDescription>
              사용자 ID를 입력하여 로그인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="userId">사용자 ID</Label>
                <Input
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="사용자 ID를 입력하세요 (예: A1B2C3)"
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={() => navigate('/')} className="flex-1">
                  취소
                </Button>
                <Button type="submit" className="flex-1">
                  로그인
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
