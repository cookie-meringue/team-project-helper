
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QRScanner } from '@/components/QRScanner';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { User, TeamMember } from '@/types';

export default function JoinTeam() {
  const [memberName, setMemberName] = useState('');
  const [scannedTeamId, setScannedTeamId] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const { teams, teamMembers, setTeamMembers, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const handleQRScan = (result: string) => {
    // Extract team ID from QR code data
    const teamId = result.replace('team:', '');
    setScannedTeamId(teamId);
    setShowScanner(false);
  };

  const handleJoinTeam = () => {
    if (!memberName || !scannedTeamId) {
      alert('Please enter your name and scan a QR code');
      return;
    }

    const team = teams.find(t => t.id === scannedTeamId);
    if (!team) {
      alert('Team not found');
      return;
    }

    const currentMembers = teamMembers.filter(m => m.teamId === scannedTeamId);
    if (currentMembers.length >= team.maxMembers) {
      alert('Team is full');
      return;
    }

    const memberId = `member_${Date.now()}`;
    const newMember: TeamMember = {
      id: memberId,
      name: memberName,
      teamId: scannedTeamId,
      role: 'Member', // Default role
      joinedAt: new Date().toISOString(),
    };

    const newUser: User = {
      id: memberId,
      name: memberName,
      type: 'member',
      teamId: scannedTeamId,
    };

    setTeamMembers([...teamMembers, newMember]);
    setCurrentUser(newUser);
    navigate('/member-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card>
          <CardHeader>
            <CardTitle>Join Team</CardTitle>
            <CardDescription>
              Scan QR code to join an existing team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="memberName">Your Name</Label>
              <Input
                id="memberName"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            {!showScanner ? (
              <div className="text-center">
                <Button onClick={() => setShowScanner(true)} className="w-full">
                  Scan QR Code
                </Button>
                {scannedTeamId && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ QR Code scanned successfully
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
                Cancel
              </Button>
              <Button 
                onClick={handleJoinTeam} 
                className="flex-1"
                disabled={!memberName || !scannedTeamId}
              >
                Join Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
