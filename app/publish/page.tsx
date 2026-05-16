'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'

type PublishPlatform = 'xiaohongshu' | 'zhihu' | 'wechat' | 'shortVideo'

interface PlatformDraft {
  platform: PublishPlatform
  platformName: string
  title: string
  body: string
  tags: string[]
  commentGuide: string
  copyText: string
  leadIn: string
}

interface PublishPackage {
  drafts: PlatformDraft[]
  csv: string
}

type PublishDraftStatus = 'draft' | 'copied' | 'published'

type PlanItemStatus = 'pending' | 'copied' | 'published'

interface PublishPlanItem {
  id: string
  draftId: string
  topic: string
  platform: PublishPlatform
  status: PlanItemStatus
}

interface DailyPlan {
  date: string
  items: PublishPlanItem[]
  quotas: Record<PublishPlatform, number>
}

interface SavedPublishDraft {
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

const emotionOptions = [
  { value: '', label: '自动判断' },
  { value: '职场委屈', label: '职场委屈' },
  { value: '上班不开心', label: '上班不开心' },
  { value: '讨好型', label: '讨好型' },
  { value: '面试焦虑', label: '面试焦虑' },
]

const starterTopics = [
  '领导分工混乱导致我每天一团乱',
  '公司说大家都是一家人但谈钱就装傻',
  '不敢拒绝别人所以越来越累',
  '面试前一晚睡不着',
  '加班到十点不敢第一个走',
]

export default function PublishPage() {
  const [topic, setTopic] = useState('')
  const [emotion, setEmotion] = useState('')
  const [result, setResult] = useState<PublishPackage | null>(null)
  const [activePlatform, setActivePlatform] = useState<PublishPlatform>('xiaohongshu')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [drafts, setDrafts] = useState<SavedPublishDraft[]>([])
  const [saving, setSaving] = useState(false)
  const [plan, setPlan] = useState<DailyPlan | null>(null)
  const [filterPlatform, setFilterPlatform] = useState<PublishPlatform | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<PublishDraftStatus | 'all'>('all')

  const activeDraft = result?.drafts.find(draft => draft.platform === activePlatform)

  const filteredDrafts = drafts.filter(draft => {
    if (filterPlatform !== 'all' && draft.activePlatform !== filterPlatform) return false
    if (filterStatus !== 'all' && draft.status !== filterStatus) return false
    return true
  })

  useEffect(() => {
    fetchDrafts()
    fetchPlan()
  }, [])

  const fetchDrafts = async () => {
    try {
      const response = await fetch('/api/publish/drafts')
      const data = await response.json()
      setDrafts(data.drafts || [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchPlan = async () => {
    try {
      const response = await fetch('/api/publish/plan')
      const data = await response.json()
      setPlan(data.plan || null)
    } catch (err) {
      console.error(err)
    }
  }

  const addToPlan = async (draft: SavedPublishDraft) => {
    try {
      const response = await fetch('/api/publish/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          draftId: draft.id,
          topic: draft.topic,
          platform: draft.activePlatform,
        }),
      })
      if (!response.ok) throw new Error('加入计划失败')
      await fetchPlan()
    } catch (err) {
      setError(err instanceof Error ? err.message : '加入计划失败')
    }
  }

  const updatePlanStatus = async (id: string, status: PlanItemStatus) => {
    await fetch('/api/publish/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status', id, status }),
    })
    fetchPlan()
  }

  const removePlanItem = async (id: string) => {
    await fetch('/api/publish/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'remove', id }),
    })
    fetchPlan()
  }

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, emotion }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || '生成失败')

      setResult(data.package)
      setActivePlatform('xiaohongshu')
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    window.setTimeout(() => setCopied(''), 1200)
  }

  const saveCurrentDraft = async () => {
    if (!result) return
    setSaving(true)
    try {
      const response = await fetch('/api/publish/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          topic,
          emotion,
          activePlatform,
          publishPackage: result,
        }),
      })
      if (!response.ok) throw new Error('保存失败')
      await fetchDrafts()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const updateSavedDraftStatus = async (id: string, status: PublishDraftStatus) => {
    await fetch('/api/publish/drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status', id, status }),
    })
    fetchDrafts()
  }

  const deleteSavedDraft = async (id: string) => {
    await fetch('/api/publish/drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    })
    fetchDrafts()
  }

  const loadSavedDraft = (draft: SavedPublishDraft) => {
    setTopic(draft.topic)
    setEmotion(draft.emotion)
    setResult(draft.package)
    setActivePlatform(draft.activePlatform)
  }

  const downloadCsv = () => {
    if (!result) return
    const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hiro-publish-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportDraftsCsv = () => {
    if (filteredDrafts.length === 0) return
    const headers = ['主题', '平台', '状态', '标题', '正文', '评论引导', '标签']
    const platformNames: Record<PublishPlatform, string> = {
      xiaohongshu: '小红书',
      zhihu: '知乎',
      wechat: '公众号',
      shortVideo: '短视频',
    }
    const statusNames: Record<PublishDraftStatus, string> = {
      draft: '草稿',
      copied: '已复制',
      published: '已发布',
    }
    const rows = filteredDrafts.map(draft => {
      const pd = draft.package.drafts.find(d => d.platform === draft.activePlatform)
      return [
        draft.topic,
        platformNames[draft.activePlatform],
        statusNames[draft.status],
        pd?.title || '',
        (pd?.body || '').replace(/\n/g, ' '),
        pd?.commentGuide || '',
        (pd?.tags || []).join(' '),
      ]
    })
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hiro-drafts-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#fafafa]">分发中控台</h2>
            <p className="text-[#a1a1aa] mt-1">一键生成小红书、知乎、公众号和短视频脚本素材包</p>
          </div>
          {result && (
            <div className="flex gap-2">
              <button
                onClick={saveCurrentDraft}
                disabled={saving}
                className="px-4 py-2 rounded-lg border border-[#d4a574] text-[#d4a574] text-sm font-medium hover:bg-[#d4a574]/10 disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存草稿'}
              </button>
              <button
                onClick={downloadCsv}
                className="px-4 py-2 rounded-lg bg-[#d4a574] text-black text-sm font-medium hover:bg-[#c4956a]"
              >
                导出 CSV
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 space-y-6">
            <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-[#fafafa]">今日发布计划</h3>
                <span className="text-xs text-[#71717a]">{plan?.date || new Date().toISOString().slice(0, 10)}</span>
              </div>
              {plan && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(['xiaohongshu', 'zhihu', 'wechat', 'shortVideo'] as PublishPlatform[]).map(p => {
                      const count = plan.items.filter(i => i.platform === p).length
                      const quota = plan.quotas[p] || 0
                      const platformNames: Record<PublishPlatform, string> = {
                        xiaohongshu: '小红书',
                        zhihu: '知乎',
                        wechat: '公众号',
                        shortVideo: '短视频',
                      }
                      return (
                        <div key={p} className="flex items-center justify-between p-2 rounded bg-[#1c1c1f]">
                          <span className="text-[#a1a1aa]">{platformNames[p]}</span>
                          <span className={count >= quota ? 'text-emerald-400' : 'text-[#d4a574]'}>{count}/{quota}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {plan.items.length === 0 && <p className="text-sm text-[#71717a]">今日暂无计划，从素材库添加</p>}
                    {plan.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between gap-2 p-2 rounded bg-[#1c1c1f] text-sm">
                        <div className="flex-1 min-w-0">
                          <p className="text-[#fafafa] truncate">{item.topic}</p>
                          <p className="text-xs text-[#71717a]">{item.platform === 'xiaohongshu' ? '小红书' : item.platform === 'zhihu' ? '知乎' : item.platform === 'wechat' ? '公众号' : '短视频'}</p>
                        </div>
                        <div className="flex gap-1 text-xs shrink-0">
                          {item.status === 'pending' && (
                            <>
                              <button onClick={() => updatePlanStatus(item.id, 'copied')} className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">复制</button>
                              <button onClick={() => removePlanItem(item.id)} className="px-2 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20">移除</button>
                            </>
                          )}
                          {item.status === 'copied' && (
                            <button onClick={() => updatePlanStatus(item.id, 'published')} className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">发布</button>
                          )}
                          {item.status === 'published' && (
                            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs">已发布</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
              <h3 className="text-lg font-medium text-[#fafafa] mb-4">输入主题</h3>
              <div className="space-y-4">
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="例如：领导画饼但工资一分不涨"
                  rows={5}
                  className="w-full px-4 py-3 bg-[#1c1c1f] border border-[#27272a] rounded-lg text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#d4a574]"
                />
                <select
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1c1c1f] border border-[#27272a] rounded-lg text-[#fafafa] focus:outline-none focus:border-[#d4a574]"
                >
                  {emotionOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <button
                  onClick={handleGenerate}
                  disabled={!topic.trim() || loading}
                  className="w-full py-3 bg-[#d4a574] text-black rounded-lg font-medium hover:bg-[#c4956a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '生成分发包中...' : '生成分发素材包'}
                </button>
                {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              </div>
            </div>

            <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
              <h3 className="text-lg font-medium text-[#fafafa] mb-4">快速选题</h3>
              <div className="space-y-2">
                {starterTopics.map(item => (
                  <button
                    key={item}
                    onClick={() => setTopic(item)}
                    className="w-full text-left px-3 py-2 rounded-lg bg-[#1c1c1f] text-[#a1a1aa] text-sm hover:text-[#fafafa] hover:border-[#d4a574] border border-transparent"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-[#fafafa]">素材库</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#71717a]">{filteredDrafts.length}/{drafts.length} 条</span>
                  {filteredDrafts.length > 0 && (
                    <button
                      onClick={exportDraftsCsv}
                      className="text-xs text-[#d4a574] hover:underline"
                    >导出 CSV</button>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <select
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value as PublishPlatform | 'all')}
                  className="flex-1 px-2 py-1.5 text-xs bg-[#1c1c1f] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-[#d4a574]"
                >
                  <option value="all">全部平台</option>
                  <option value="xiaohongshu">小红书</option>
                  <option value="zhihu">知乎</option>
                  <option value="wechat">公众号</option>
                  <option value="shortVideo">短视频</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as PublishDraftStatus | 'all')}
                  className="flex-1 px-2 py-1.5 text-xs bg-[#1c1c1f] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-[#d4a574]"
                >
                  <option value="all">全部状态</option>
                  <option value="draft">草稿</option>
                  <option value="copied">已复制</option>
                  <option value="published">已发布</option>
                </select>
              </div>
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {filteredDrafts.length === 0 && <p className="text-sm text-[#71717a]">暂无匹配的草稿</p>}
                {filteredDrafts.map(draft => (
                  <div key={draft.id} className="p-3 rounded-lg bg-[#1c1c1f] border border-[#27272a] space-y-2">
                    <button
                      onClick={() => loadSavedDraft(draft)}
                      className="text-left text-sm text-[#fafafa] hover:text-[#d4a574] line-clamp-2"
                    >
                      {draft.topic}
                    </button>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${draft.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : draft.status === 'copied' ? 'bg-blue-500/10 text-blue-400' : 'bg-[#27272a] text-[#a1a1aa]'}`}>
                        {draft.status === 'published' ? '已发布' : draft.status === 'copied' ? '已复制' : '草稿'}
                      </span>
                      <div className="flex gap-2 text-xs">
                        <button onClick={() => addToPlan(draft)} className="text-[#d4a574] hover:underline">加入计划</button>
                        <button onClick={() => updateSavedDraftStatus(draft.id, 'copied')} className="text-blue-400 hover:underline">复制</button>
                        <button onClick={() => updateSavedDraftStatus(draft.id, 'published')} className="text-emerald-400 hover:underline">发布</button>
                        <button onClick={() => deleteSavedDraft(draft.id)} className="text-red-400 hover:underline">删除</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="xl:col-span-2 p-6 rounded-xl border border-[#27272a] bg-[#141416] min-h-[520px]">
            {!result && !loading && (
              <div className="h-full flex items-center justify-center text-center text-[#71717a]">
                <div>
                  <div className="text-4xl mb-4">📦</div>
                  <p>输入主题后，系统会生成四个平台的发布素材。</p>
                  <p className="text-sm mt-2">先半自动，人工确认发布，避免平台风控。</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="space-y-4">
                <div className="h-10 bg-[#27272a] rounded animate-pulse" />
                <div className="h-32 bg-[#27272a] rounded animate-pulse" />
                <div className="h-32 bg-[#27272a] rounded animate-pulse" />
              </div>
            )}

            {result && activeDraft && (
              <div className="space-y-6">
                <div className="flex gap-2 flex-wrap">
                  {result.drafts.map(draft => (
                    <button
                      key={draft.platform}
                      onClick={() => setActivePlatform(draft.platform)}
                      className={`px-4 py-2 rounded-lg text-sm border transition-colors ${activePlatform === draft.platform ? 'bg-[#d4a574]/10 text-[#d4a574] border-[#d4a574]' : 'text-[#a1a1aa] border-[#27272a] hover:text-[#fafafa]'}`}
                    >
                      {draft.platformName}
                    </button>
                  ))}
                </div>

                {copied && <div className="text-sm text-[#d4a574]">已复制：{copied}</div>}

                <DraftBlock label="标题" value={activeDraft.title} onCopy={() => copyToClipboard(activeDraft.title, `${activeDraft.platformName}标题`)} />
                <DraftBlock label="正文/脚本" value={activeDraft.body} onCopy={() => copyToClipboard(activeDraft.body, `${activeDraft.platformName}正文`)} multiline />
                <DraftBlock label="评论引导" value={activeDraft.commentGuide} onCopy={() => copyToClipboard(activeDraft.commentGuide, `${activeDraft.platformName}评论引导`)} />
                <DraftBlock label="轻承接" value={activeDraft.leadIn} onCopy={() => copyToClipboard(activeDraft.leadIn, `${activeDraft.platformName}轻承接`)} />
                <DraftBlock label="一键复制完整发布内容" value={activeDraft.copyText} onCopy={() => copyToClipboard(activeDraft.copyText, `${activeDraft.platformName}完整内容`)} multiline />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function DraftBlock({ label, value, onCopy, multiline = false }: { label: string; value: string; onCopy: () => void; multiline?: boolean }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-[#a1a1aa]">{label}</span>
        <button onClick={onCopy} className="text-xs text-[#d4a574] hover:underline">复制</button>
      </div>
      <div className={`p-4 bg-[#1c1c1f] border border-[#27272a] rounded-lg text-[#fafafa] ${multiline ? 'whitespace-pre-wrap leading-relaxed' : ''}`}>
        {value}
      </div>
    </div>
  )
}
