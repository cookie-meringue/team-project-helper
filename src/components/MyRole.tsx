
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { User, Users } from 'lucide-react';

export function MyRole() {
  const { currentUser, teamMembers } = useApp();
  
  const myMember = teamMembers.find(m => m.id === currentUser?.id);
  const allTeamMembers = teamMembers.filter(m => m.teamId === currentUser?.teamId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            My Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentUser?.name}</h2>
            <p className="text-lg text-gray-600 mb-4">{myMember?.role || 'Member'}</p>
            <p className="text-sm text-gray-500">
              Joined on {myMember ? new Date(myMember.joinedAt).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members ({allTeamMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allTeamMembers.map((member) => (
              <div 
                key={member.id} 
                className={`p-3 rounded-lg ${member.id === currentUser?.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {member.name}
                      {member.id === currentUser?.id && (
                        <span className="text-blue-600 text-sm ml-2">(You)</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
