
-- 사용자 테이블
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('leader', 'member')),
  team_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 팀 테이블
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  max_members INTEGER NOT NULL,
  leader_id UUID REFERENCES public.users(id),
  leader_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 팀 멤버 테이블
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 공지사항 테이블
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 이슈 테이블
CREATE TABLE public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('open', 'in-progress', 'resolved')) DEFAULT 'open'
);

-- 파일 업로드를 위한 테이블
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_latest BOOLEAN DEFAULT true
);

-- 스토리지 버킷 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-documents', 'team-documents', true);

-- Row Level Security 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- RLS 정책 (현재는 모든 사용자가 접근 가능하도록 설정 - 추후 인증 구현 시 수정 필요)
CREATE POLICY "모든 사용자가 접근 가능" ON public.users FOR ALL USING (true);
CREATE POLICY "모든 사용자가 접근 가능" ON public.teams FOR ALL USING (true);
CREATE POLICY "모든 사용자가 접근 가능" ON public.team_members FOR ALL USING (true);
CREATE POLICY "모든 사용자가 접근 가능" ON public.announcements FOR ALL USING (true);
CREATE POLICY "모든 사용자가 접근 가능" ON public.issues FOR ALL USING (true);
CREATE POLICY "모든 사용자가 접근 가능" ON public.documents FOR ALL USING (true);

-- 스토리지 정책
CREATE POLICY "모든 사용자가 파일 업로드 가능" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'team-documents');
CREATE POLICY "모든 사용자가 파일 조회 가능" ON storage.objects FOR SELECT USING (bucket_id = 'team-documents');
CREATE POLICY "모든 사용자가 파일 삭제 가능" ON storage.objects FOR DELETE USING (bucket_id = 'team-documents');

-- 문서 버전 관리를 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_document_versions()
RETURNS TRIGGER AS $$
BEGIN
  -- 같은 팀의 같은 제목의 기존 문서들을 latest가 아닌 상태로 변경
  UPDATE public.documents 
  SET is_latest = false 
  WHERE team_id = NEW.team_id 
    AND title = NEW.title 
    AND id != NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER trigger_update_document_versions
  AFTER INSERT ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION update_document_versions();
