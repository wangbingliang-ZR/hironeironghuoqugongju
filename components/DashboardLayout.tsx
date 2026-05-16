'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageCircle,
  Settings,
  Sparkles,
  Zap,
  Send
} from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { href: '/', label: '首页', icon: LayoutDashboard },
  { href: '/content', label: '内容', icon: FileText },
  { href: '/auto', label: '自动生成', icon: Zap },
  { href: '/publish', label: '分发', icon: Send },
  { href: '/leads', label: '客户', icon: Users },
  { href: '/follow-up', label: '跟进', icon: MessageCircle },
  { href: '/settings', label: '设置', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-[#0a0a0b]">
      <aside className="w-64 border-r border-[#27272a] bg-[#0a0a0b] flex flex-col">
        <div className="p-6 border-b border-[#27272a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#fafafa]">HIRO AI</h1>
              <p className="text-xs text-[#a1a1aa]">情绪内容 OS</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-[#d4a574]/10 text-[#d4a574]'
                    : 'text-[#a1a1aa] hover:bg-[#1c1c1f] hover:text-[#fafafa]'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#27272a]">
          <div className="px-4 py-3 rounded-lg bg-[#141416]">
            <p className="text-xs text-[#a1a1aa]">v1.0.0</p>
            <p className="text-xs text-[#71717a]">可用的MVP</p>
          </div>
        </div>
      </aside>

      <main className="flex-1">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

function DashboardHome() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#fafafa]">首页</h2>
        <p className="text-[#a1a1aa] mt-1">欢迎使用 HIRO AI 内容销售系统</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="客户总数" value="0" trend="+0%" />
        <StatCard title="待跟进" value="0" trend="+0%" />
        <StatCard title="已生成内容" value="0" trend="+0%" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
          <h3 className="text-lg font-medium text-[#fafafa] mb-4">快捷操作</h3>
          <div className="space-y-3">
            <QuickActionButton label="生成内容" href="/content" />
            <QuickActionButton label="添加客户" href="/leads" />
            <QuickActionButton label="查看跟进" href="/follow-up" />
          </div>
        </div>

        <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
          <h3 className="text-lg font-medium text-[#fafafa] mb-4">最近动态</h3>
          <p className="text-[#71717a] text-sm">暂无动态</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, trend }: { title: string; value: string; trend: string }) {
  return (
    <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
      <p className="text-sm text-[#a1a1aa]">{title}</p>
      <p className="text-3xl font-semibold text-[#fafafa] mt-2">{value}</p>
      <p className="text-sm text-[#d4a574] mt-2">{trend}</p>
    </div>
  )
}

function QuickActionButton({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="block w-full px-4 py-3 rounded-lg bg-[#1c1c1f] text-[#fafafa] text-sm font-medium hover:bg-[#27272a] transition-colors text-center"
    >
      {label}
    </Link>
  )
}

function ContentPage() {
  const [topic, setTopic] = useState('')
  const [emotionType, setEmotionType] = useState('')
  const [result, setResult] = useState<{
    title: string
    hook: string
    emotionName: string
    content: string
    shareSentence: string
    commentTrigger: string
    hashtags: string[]
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const emotionOptions = [
    { value: '', label: '说不清' },
    { value: '高敏感型', label: '高敏感型' },
    { value: '长期紧绷型', label: '长期紧绷型' },
    { value: '讨好型', label: '讨好型' },
    { value: '自我怀疑型', label: '自我怀疑型' },
  ]

  const handleGenerate = async () => {
    if (!topic) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/content/emotional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, emotion: emotionType }),
      })

      if (!response.ok) throw new Error('生成失败，请重试')

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#fafafa]">情绪内容</h2>
        <p className="text-[#a1a1aa] mt-1">生成让人产生共鸣的内容</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
            <h3 className="text-lg font-medium text-[#fafafa] mb-4">输入你的状态</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-2">最近让你累的事情 *</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="例如：总感觉别人一个眼神，我能想一晚上"
                  rows={3}
                  className="w-full px-4 py-3 bg-[#1c1c1f] border border-[#27272a] rounded-lg text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#d4a574]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-2">情绪类型 (可选)</label>
                <select
                  value={emotionType}
                  onChange={(e) => setEmotionType(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1c1c1f] border border-[#27272a] rounded-lg text-[#fafafa] focus:outline-none focus:border-[#d4a574]"
                >
                  {emotionOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleGenerate}
                disabled={!topic || loading}
                className="w-full py-3 bg-[#d4a574] text-black rounded-lg font-medium hover:bg-[#c4956a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <span className="animate-spin">⏳</span>}
                {loading ? 'AI 理解中...' : '生成共鸣内容'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
          <h3 className="text-lg font-medium text-[#fafafa] mb-4">生成结果</h3>
          
          {loading && (
            <div className="space-y-4">
              <div className="h-4 bg-[#27272a] rounded animate-pulse" />
              <div className="h-4 bg-[#27272a] rounded animate-pulse w-3/4" />
              <div className="h-4 bg-[#27272a] rounded animate-pulse w-1/2" />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#a1a1aa]">情绪类型</span>
                  <span className="px-2 py-1 bg-[#f472b6]/20 text-[#f472b6] rounded text-xs">
                    {result.emotionName}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#a1a1aa]">标题</span>
                  <button onClick={() => copyToClipboard(result.title)} className="text-xs text-[#d4a574] hover:underline">复制</button>
                </div>
                <div className="p-3 bg-[#1c1c1f] rounded-lg text-[#fafafa]">{result.title}</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#a1a1aa]">Hook</span>
                  <button onClick={() => copyToClipboard(result.hook)} className="text-xs text-[#d4a574] hover:underline">复制</button>
                </div>
                <div className="p-3 bg-[#1c1c1f] rounded-lg text-[#f472b6]">{result.hook}</div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#a1a1aa]">正文</span>
                  <button onClick={() => copyToClipboard(result.content)} className="text-xs text-[#d4a574] hover:underline">复制</button>
                </div>
                <div className="p-3 bg-[#1c1c1f] rounded-lg text-[#fafafa] whitespace-pre-wrap">{result.content}</div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#a1a1aa]">朋友圈分享句</span>
                  <button onClick={() => copyToClipboard(result.shareSentence)} className="text-xs text-[#d4a574] hover:underline">复制</button>
                </div>
                <div className="p-3 bg-[#1c1c1f] rounded-lg text-[#a1a1aa]">{result.shareSentence}</div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#a1a1aa]">评论触发</span>
                  <button onClick={() => copyToClipboard(result.commentTrigger)} className="text-xs text-[#d4a574] hover:underline">复制</button>
                </div>
                <div className="p-3 bg-[#1c1c1f] rounded-lg text-[#fafafa]">{result.commentTrigger}</div>
              </div>
              
              <div>
                <span className="text-sm text-[#a1a1aa] block mb-2">标签</span>
                <div className="flex gap-2 flex-wrap">
                  {result.hashtags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-[#d4a574]/10 text-[#d4a574] rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-2 border border-[#27272a] text-[#a1a1aa] rounded-lg hover:border-[#d4a574] hover:text-[#d4a574] transition-colors"
              >
                重新生成
              </button>
            </div>
          )}

          {!loading && !result && !error && (
            <p className="text-[#71717a]">输入主题后点击生成</p>
          )}
        </div>
      </div>
    </div>
  )
}

function LeadsPage() {
  const [showForm, setShowForm] = useState(false)
  const [leads, setLeads] = useState([
    { id: '1', name: '张三', source: '小红书', tags: ['有意向'], status: 'new', intent_level: 'medium', notes: '', created_at: '2024-01-01', last_contact_at: null },
    { id: '2', name: '李四', source: '微信', tags: ['已付费'], status: 'converted', intent_level: 'high', notes: 'VIP客户', created_at: '2024-01-02', last_contact_at: '2024-01-05' },
  ])

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500/20 text-blue-400',
    contacted: 'bg-yellow-500/20 text-yellow-400',
    qualified: 'bg-purple-500/20 text-purple-400',
    converted: 'bg-green-500/20 text-green-400',
    lost: 'bg-red-500/20 text-red-400',
  }

  const intentColors: Record<string, string> = {
    low: 'text-red-400',
    medium: 'text-yellow-400',
    high: 'text-green-400',
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#fafafa]">Leads</h2>
          <p className="text-[#a1a1aa] mt-1">Manage your customers</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#d4a574] text-black rounded-lg font-medium hover:bg-[#c4956a] transition-colors"
        >
          {showForm ? '取消' : '+ 添加客户'}
        </button>
      </div>

      {showForm && (
        <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
          <h3 className="text-lg font-medium text-[#fafafa] mb-4">添加新客户</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="客户名称"
              className="px-4 py-3 bg-[#1c1c1f] border border-[#27272a] rounded-lg text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#d4a574]"
            />
            <input
              type="text"
              placeholder="来源 (如：小红书、微信)"
              className="px-4 py-3 bg-[#1c1c1f] border border-[#27272a] rounded-lg text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#d4a574]"
            />
            <select className="px-4 py-3 bg-[#1c1c1f] border border-[#27272a] rounded-lg text-[#fafafa] focus:outline-none focus:border-[#d4a574]">
              <option value="">意向等级</option>
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
            <select className="px-4 py-3 bg-[#1c1c1f] border border-[#27272a] rounded-lg text-[#fafafa] focus:outline-none focus:border-[#d4a574]">
              <option value="">状态</option>
              <option value="new">新客户</option>
              <option value="contacted">已联系</option>
              <option value="qualified">已筛选</option>
              <option value="converted">已转化</option>
              <option value="lost">已流失</option>
            </select>
            <input
              type="text"
              placeholder="标签 (逗号分隔)"
              className="px-4 py-3 bg-[#1c1c1f] border border-[#27272a] rounded-lg text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#d4a574] md:col-span-2"
            />
            <textarea
              placeholder="备注"
              rows={3}
              className="px-4 py-3 bg-[#1c1c1f] border border-[#27272a] rounded-lg text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#d4a574] md:col-span-2"
            />
          </div>
          <button className="mt-4 px-6 py-2 bg-[#d4a574] text-black rounded-lg font-medium hover:bg-[#c4956a] transition-colors">
            保存
          </button>
        </div>
      )}

      <div className="border border-[#27272a] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#141416]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#a1a1aa]">客户</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#a1a1aa]">来源</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#a1a1aa]">标签</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#a1a1aa]">意向</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#a1a1aa]">状态</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#a1a1aa]">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a]">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-[#1c1c1f]">
                <td className="px-6 py-4">
                  <p className="text-[#fafafa] font-medium">{lead.name}</p>
                  <p className="text-xs text-[#71717a]">{new Date(lead.created_at).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4 text-[#a1a1aa]">{lead.source}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {lead.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs bg-[#27272a] text-[#a1a1aa] rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={intentColors[lead.intent_level]}>{lead.intent_level === 'high' ? '高' : lead.intent_level === 'medium' ? '中' : '低'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded ${statusColors[lead.status]}`}>
                    {lead.status === 'new' ? '新客户' : lead.status === 'contacted' ? '已联系' : lead.status === 'qualified' ? '已筛选' : lead.status === 'converted' ? '已转化' : '已流失'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-[#d4a574] hover:underline text-sm">编辑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FollowUpPage() {
  const [followUps] = useState([
    { id: '1', lead_name: '张三', type: 'message', content: '已发送产品资料', created_at: '2024-01-05 14:30' },
    { id: '2', lead_name: '李四', type: 'call', content: '电话沟通30分钟，意向强烈', created_at: '2024-01-04 10:00' },
    { id: '3', lead_name: '王五', type: 'note', content: '客户考虑中，下周再跟进', created_at: '2024-01-03 16:20' },
  ])

  const typeIcons: Record<string, string> = {
    message: '💬',
    call: '📞',
    note: '📝',
    meeting: '📅',
  }

  const typeLabels: Record<string, string> = {
    message: '私信',
    call: '电话',
    note: '备注',
    meeting: '会议',
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#fafafa]">Follow-up</h2>
          <p className="text-[#a1a1aa] mt-1">Track and manage follow-ups</p>
        </div>
        <button className="px-4 py-2 bg-[#d4a574] text-black rounded-lg font-medium hover:bg-[#c4956a] transition-colors">
          + 添加跟进
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {followUps.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border border-[#27272a] bg-[#141416]">
              <div className="flex items-start gap-4">
                <div className="text-2xl">{typeIcons[item.type]}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#fafafa]">{item.lead_name}</span>
                    <span className="px-2 py-0.5 text-xs bg-[#27272a] text-[#a1a1aa] rounded">
                      {typeLabels[item.type]}
                    </span>
                  </div>
                  <p className="text-[#a1a1aa] mt-1">{item.content}</p>
                  <p className="text-xs text-[#71717a] mt-2">{item.created_at}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
          <h3 className="text-lg font-medium text-[#fafafa] mb-4">AI 建议</h3>
          <div className="p-4 bg-[#d4a574]/10 rounded-lg border border-[#d4a574]/20">
            <p className="text-sm text-[#d4a574] mb-2">💡 建议</p>
            <p className="text-[#fafafa]">张三已有3天未跟进，建议今天发送一条关怀消息，了解近期需求。</p>
          </div>
          <button className="mt-4 w-full py-2 border border-[#d4a574] text-[#d4a574] rounded-lg hover:bg-[#d4a574]/10 transition-colors">
            使用建议回复
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#fafafa]">Settings</h2>
        <p className="text-[#a1a1aa] mt-1">Configure your workspace</p>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
          <h3 className="text-lg font-medium text-[#fafafa] mb-4">API 配置</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Supabase URL</label>
              <input
                type="text"
                placeholder="https://xxx.supabase.co"
                className="w-full px-4 py-3 bg-[#1c1c1f] border border-[#27272a] rounded-lg text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#d4a574]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Supabase Anon Key</label>
              <input
                type="password"
                placeholder="your-anon-key"
                className="w-full px-4 py-3 bg-[#1c1c1f] border border-[#27272a] rounded-lg text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#d4a574]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">DeepSeek API Key</label>
              <input
                type="password"
                placeholder="your-deepseek-key"
                className="w-full px-4 py-3 bg-[#1c1c1f] border border-[#27272a] rounded-lg text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#d4a574]"
              />
            </div>
            <button className="px-6 py-2 bg-[#d4a574] text-black rounded-lg font-medium hover:bg-[#c4956a] transition-colors">
              保存配置
            </button>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
          <h3 className="text-lg font-medium text-[#fafafa] mb-4">关于</h3>
          <div className="space-y-2 text-[#a1a1aa]">
            <p>HIRO AI - AI Content Sales OS</p>
            <p className="text-sm">版本: 1.0.0</p>
            <p className="text-sm text-[#71717a]">帮助用户完成 内容 → 线索 → 跟进 → 转化 完整链路</p>
          </div>
        </div>
      </div>
    </div>
  )
}
