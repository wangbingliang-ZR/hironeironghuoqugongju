import fs from 'fs'
import path from 'path'
import type { PublishPackage, PublishPlatform } from './platform-adapter'

export type PublishDraftStatus = 'draft' | 'copied' | 'published'

export interface SavedPublishDraft {
  id: string
  topic: string
  emotion: string
  activePlatform: PublishPlatform
  status: PublishDraftStatus
  package: PublishPackage
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'publish-drafts.json')

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf8')
  }
}

function readDrafts(): SavedPublishDraft[] {
  ensureDataFile()

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('[PublishDrafts] Read failed:', error)
    return []
  }
}

function writeDrafts(drafts: SavedPublishDraft[]) {
  ensureDataFile()
  fs.writeFileSync(DATA_FILE, JSON.stringify(drafts, null, 2), 'utf8')
}

export function getPublishDrafts(): SavedPublishDraft[] {
  return readDrafts()
}

export function savePublishDraft(input: {
  topic: string
  emotion?: string
  activePlatform?: PublishPlatform
  package: PublishPackage
}): SavedPublishDraft {
  const now = new Date().toISOString()
  const draft: SavedPublishDraft = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    topic: input.topic,
    emotion: input.emotion || '',
    activePlatform: input.activePlatform || 'xiaohongshu',
    status: 'draft',
    package: input.package,
    createdAt: now,
    updatedAt: now,
  }

  const drafts = readDrafts()
  drafts.unshift(draft)
  writeDrafts(drafts)
  return draft
}

export function updatePublishDraftStatus(id: string, status: PublishDraftStatus): SavedPublishDraft | null {
  const drafts = readDrafts()
  const draft = drafts.find(item => item.id === id)
  if (!draft) return null

  draft.status = status
  draft.updatedAt = new Date().toISOString()
  if (status === 'published') {
    draft.publishedAt = draft.updatedAt
  }

  writeDrafts(drafts)
  return draft
}

export function deletePublishDraft(id: string): SavedPublishDraft | null {
  const drafts = readDrafts()
  const draft = drafts.find(item => item.id === id)
  if (!draft) return null

  writeDrafts(drafts.filter(item => item.id !== id))
  return draft
}
