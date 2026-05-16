import fs from 'fs'
import path from 'path'
import type { PublishPlatform } from './platform-adapter'

export type PlanItemStatus = 'pending' | 'copied' | 'published'

export interface PublishPlanItem {
  id: string
  draftId: string
  topic: string
  platform: PublishPlatform
  status: PlanItemStatus
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface DailyPlan {
  date: string
  items: PublishPlanItem[]
  quotas: Record<PublishPlatform, number>
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'publish-plan.json')

const DEFAULT_QUOTAS: Record<PublishPlatform, number> = {
  xiaohongshu: 2,
  zhihu: 1,
  wechat: 1,
  shortVideo: 1,
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2), 'utf8')
  }
}

function readAllPlans(): Record<string, DailyPlan> {
  ensureDataFile()
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function writeAllPlans(plans: Record<string, DailyPlan>) {
  ensureDataFile()
  fs.writeFileSync(DATA_FILE, JSON.stringify(plans, null, 2), 'utf8')
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function getTodayPlan(): DailyPlan {
  const plans = readAllPlans()
  const today = getTodayKey()
  return plans[today] || {
    date: today,
    items: [],
    quotas: { ...DEFAULT_QUOTAS },
  }
}

export function addToPlan(draftId: string, topic: string, platform: PublishPlatform): PublishPlanItem {
  const plans = readAllPlans()
  const today = getTodayKey()
  const plan = plans[today] || {
    date: today,
    items: [],
    quotas: { ...DEFAULT_QUOTAS },
  }

  const item: PublishPlanItem = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    draftId,
    topic,
    platform,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  plan.items.push(item)
  plans[today] = plan
  writeAllPlans(plans)
  return item
}

export function updatePlanItemStatus(id: string, status: PlanItemStatus): PublishPlanItem | null {
  const plans = readAllPlans()
  const today = getTodayKey()
  const plan = plans[today]
  if (!plan) return null

  const item = plan.items.find(i => i.id === id)
  if (!item) return null

  item.status = status
  item.updatedAt = new Date().toISOString()
  if (status === 'published') {
    item.publishedAt = item.updatedAt
  }

  plans[today] = plan
  writeAllPlans(plans)
  return item
}

export function removeFromPlan(id: string): PublishPlanItem | null {
  const plans = readAllPlans()
  const today = getTodayKey()
  const plan = plans[today]
  if (!plan) return null

  const item = plan.items.find(i => i.id === id)
  if (!item) return null

  plan.items = plan.items.filter(i => i.id !== id)
  plans[today] = plan
  writeAllPlans(plans)
  return item
}

export function updateQuotas(quotas: Partial<Record<PublishPlatform, number>>): DailyPlan {
  const plans = readAllPlans()
  const today = getTodayKey()
  const plan = plans[today] || {
    date: today,
    items: [],
    quotas: { ...DEFAULT_QUOTAS },
  }

  plan.quotas = { ...plan.quotas, ...quotas }
  plans[today] = plan
  writeAllPlans(plans)
  return plan
}
