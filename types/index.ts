export interface Lead {
  id: string
  name: string
  source: string
  tags: string[]
  notes: string
  intent_level: 'low' | 'medium' | 'high'
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  created_at: string
  last_contact_at: string | null
}

export interface FollowUp {
  id: string
  lead_id: string
  content: string
  type: 'message' | 'call' | 'note' | 'meeting'
  created_at: string
}

export interface ContentRequest {
  type: 'title' | 'body' | 'comment' | 'cta'
  topic: string
  style?: string
  context?: string
}

export interface ContentResponse {
  content: string
}

export interface AIAnalysisInput {
  user_messages: string[]
  tags: string[]
  history: string[]
  current_stage: string
}

export interface AIAnalysisOutput {
  emotion: string
  intent_level: 'low' | 'medium' | 'high'
  risk_level: 'low' | 'medium' | 'high'
  suggested_reply: string
  next_action: string
}
