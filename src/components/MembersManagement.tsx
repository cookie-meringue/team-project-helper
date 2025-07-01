
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
  const { currentUser, teamMembers, setTeamMembers } = useApp();
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newRole, setNewRole] = useState('');

  const currentTeamMembers = teamMembers.filter(m => m.teamId === currentUser?.teamId);

  const handleUpdateRole = (memberId: string, newRole: string) => {
    setTeamMembers(
      teamMembers.map(member =>
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
    setEditingMember(null);
    setNewRole('');
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Team Members ({currentTeamMembers.length})
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
                        Edit Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Role for {member.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Input
                            id="role"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            placeholder="Enter role"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleUpdateRole(member.id, newRole)}
                            className="flex-1"
                          >
                            Update Role
                          </Button>
                          <Button variant="outline" onClick={() => setEditingMember(null)} className="flex-1">
                            Cancel
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
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            
            {currentTeamMembers.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No team members yet. Share your QR code to invite members!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
