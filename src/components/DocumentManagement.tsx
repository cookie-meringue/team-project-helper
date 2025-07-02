
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useApp } from '@/contexts/AppContext';
import { FileText, Upload, Download, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function DocumentManagement() {
  const { currentUser, documents, uploadDocument, getDocumentUrl } = useApp();
  const { toast } = useToast();
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const currentTeamDocuments = documents
    .filter(d => d.team_id === currentUser?.teamId)
    .reduce((acc, doc) => {
      if (!acc[doc.title] || doc.version > acc[doc.title].version) {
        acc[doc.title] = doc;
      }
      return acc;
    }, {} as Record<string, typeof documents[0]>);

  const latestDocuments = Object.values(currentTeamDocuments)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const getDocumentHistory = (title: string) => {
    return documents
      .filter(d => d.team_id === currentUser?.teamId && d.title === title)
      .sort((a, b) => b.version - a.version);
  };

  const handleUpload = async () => {
    if (!selectedFile || !newTitle.trim()) {
      toast({
        title: "오류",
        description: "파일과 제목을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      await uploadDocument(
        selectedFile,
        newTitle,
        newDescription,
        currentUser?.teamId || '',
        currentUser?.name || ''
      );

      toast({
        title: "성공",
        description: "문서가 성공적으로 업로드되었습니다.",
      });

      setNewTitle('');
      setNewDescription('');
      setSelectedFile(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('업로드 실패:', error);
      toast({
        title: "오류",
        description: "문서 업로드에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (document: typeof documents[0]) => {
    try {
      const url = await getDocumentUrl(document.file_path);
      if (url) {
        const linkElement = window.document.createElement('a');
        linkElement.href = url;
        linkElement.download = document.file_name;
        window.document.body.appendChild(linkElement);
        linkElement.click();
        window.document.body.removeChild(linkElement);
      }
    } catch (error) {
      console.error('다운로드 실패:', error);
      toast({
        title: "오류",
        description: "파일 다운로드에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            문서 관리 ({latestDocuments.length})
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                문서 업로드
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 문서 업로드</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">제목</Label>
                  <Input
                    id="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="문서 제목을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="description">설명 (선택사항)</Label>
                  <Textarea
                    id="description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="문서에 대한 설명을 입력하세요"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="file">파일</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1"
                  >
                    {uploading ? '업로드 중...' : '업로드'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    취소
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {latestDocuments.map((document) => {
            const history = getDocumentHistory(document.title);
            return (
              <div key={document.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{document.title}</h3>
                    {document.description && (
                      <p className="text-gray-600 text-sm mt-1">{document.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                      <span>업로드: {document.uploaded_by}</span>
                      <span>크기: {formatFileSize(document.file_size)}</span>
                      <span>버전: {document.version}</span>
                      <span>{new Date(document.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(document)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      다운로드
                    </Button>
                    {history.length > 1 && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Clock className="w-4 h-4 mr-1" />
                            이전 버전 ({history.length - 1})
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{document.title} - 버전 기록</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {history.map((version, index) => (
                              <div key={version.id} className="p-3 border rounded">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-medium">
                                      버전 {version.version}
                                      {index === 0 && <span className="text-green-600 ml-2">(최신)</span>}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {version.uploaded_by} • {new Date(version.created_at).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDownload(version)}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {latestDocuments.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              아직 업로드된 문서가 없습니다. 첫 번째 문서를 업로드해보세요!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
