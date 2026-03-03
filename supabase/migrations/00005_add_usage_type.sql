-- 利用形態カラムを追加
-- management_company: 管理会社（他オーナーの物件を管理）
-- self_managed: 自主管理（オーナー自身が物件を管理）
ALTER TABLE public.companies
  ADD COLUMN usage_type text NOT NULL DEFAULT 'management_company';
