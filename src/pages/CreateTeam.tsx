
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Team, User } from '@/types';

export default function CreateTeam() {
  const [teamName, setTeamName] = useState('');
  const [maxMembers, setMaxMembers] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const { teams, setTeams, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamName || !maxMembers || !leaderName) {
      alert('Please fill in all fields');
      return;
    }

    const teamId = Date.now().toString();
    const userId = `leader_${teamId}`;
    
    const newTeam: Team = {
      id: teamId,
      name: teamName,
      maxMembers: parseInt(maxMembers),
      leaderId: userId,
      leaderName: leaderName,
      createdAt: new Date().toISOString(),
    };

    const newUser: User = {
      id: userId,
      name: leaderName,
      type: 'leader',
      teamId: teamId,
    };

    setTeams([...teams, newTeam]);
    setCurrentUser(newUser);
    navigate('/leader-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Team</CardTitle>
            <CardDescription>
              Set up your team for collaboration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="leaderName">Your Name</Label>
                <Input
                  id="leaderName"
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="maxMembers">Maximum Members</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(e.target.value)}
                  placeholder="Enter max number of members"
                  min="2"
                  max="20"
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={() => navigate('/')} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Team
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
