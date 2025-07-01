
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
  const { currentUser, issues, setIssues } = useApp();
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const currentTeamIssues = issues
    .filter(i => i.teamId === currentUser?.teamId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleCreateIssue = () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newIssue: Issue = {
      id: Date.now().toString(),
      teamId: currentUser?.teamId || '',
      title: newTitle,
      description: newDescription,
      createdBy: currentUser?.name || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'open',
    };

    setIssues([...issues, newIssue]);
    setNewTitle('');
    setNewDescription('');
    setIsDialogOpen(false);
  };

  const handleUpdateIssue = () => {
    if (!editingIssue || !newTitle.trim() || !newDescription.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIssues(
      issues.map(i =>
        i.id === editingIssue.id
          ? { ...i, title: newTitle, description: newDescription, updatedAt: new Date().toISOString() }
          : i
      )
    );
    
    setEditingIssue(null);
    setNewTitle('');
    setNewDescription('');
    setIsDialogOpen(false);
  };

  const handleUpdateStatus = (issueId: string, status: 'open' | 'in-progress' | 'resolved') => {
    setIssues(
      issues.map(i =>
        i.id === issueId
          ? { ...i, status, updatedAt: new Date().toISOString() }
          : i
      )
    );
  };

  const handleDeleteIssue = (id: string) => {
    if (confirm('Are you sure you want to delete this issue?')) {
      setIssues(issues.filter(i => i.id !== id));
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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Issues ({currentTeamIssues.length})
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Issue
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingIssue ? 'Edit Issue' : 'Create New Issue'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Enter issue title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Describe the issue in detail"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={editingIssue ? handleUpdateIssue : handleCreateIssue}
                      className="flex-1"
                    >
                      {editingIssue ? 'Update' : 'Create'}
                    </Button>
                    <Button variant="outline" onClick={resetDialog} className="flex-1">
                      Cancel
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
                        {issue.status}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-2">{issue.description}</p>
                    <div className="text-sm text-gray-500">
                      By {issue.createdBy} • {new Date(issue.createdAt).toLocaleDateString()}
                      {issue.updatedAt !== issue.createdAt && (
                        <span> • Updated {new Date(issue.updatedAt).toLocaleDateString()}</span>
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
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteIssue(issue.id)}
                          >
                            Delete
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
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
            
            {currentTeamIssues.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No issues yet. Create your first issue to get started!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
