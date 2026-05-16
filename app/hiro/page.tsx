'use client'

import { useState } from 'react'

interface HiroResponse {
  stab: string
  breakdown: string
  response: string
  followUpQuestion: string
}

export default function HiroPage() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<HiroResponse | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!message.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const r = await fetch('/api/hiro/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      })
      const data = await r.json()
      if (!data.success) throw new Error(data.error || '没接住')
      setResult(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'HIRO 暂时没接住，再试一次')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#fafafa] flex flex-col">
      {/* 顶部品牌条 */}
      <div className="px-6 py-4 border-b border-[#1c1c1f]">
        <span className="text-sm text-[#71717a]">HIRO</span>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex items-center justify-center px-4">
        {!result && (
          <div className="w-full max-w-xl space-y-8">
            {/* 主文案 */}
            <div className="space-y-3 text-center">
              <h1 className="text-2xl font-medium tracking-tight">
                把那句话丢给 HIRO
              </h1>
              <p className="text-[#a1a1aa] text-sm">
                你不用讲完整。把那句话丢过来就行。
              </p>
            </div>

            {/* 输入区 */}
            <div className="space-y-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="比如：领导说我不够主动，但我已经连续加班两周了。"
                rows={4}
                maxLength={500}
                disabled={loading}
                className="w-full px-5 py-4 bg-[#141416] border border-[#27272a] rounded-xl text-[#fafafa] placeholder-[#52525b] focus:outline-none focus:border-[#d4a574] resize-none text-base leading-relaxed disabled:opacity-50"
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#52525b]">
                  {message.length}/500
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || loading}
                  className="px-6 py-2.5 bg-[#d4a574] text-black rounded-lg text-sm font-medium hover:bg-[#c4956a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? 'HIRO 在听...' : '先说出来'}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            {/* 底部小字 */}
            <p className="text-xs text-[#3f3f46] text-center">
              HIRO 不会上课，也不劝你"想开点"。
            </p>
          </div>
        )}

        {/* 结果页 */}
        {result && (
          <div className="w-full max-w-xl space-y-6 py-8">
            {/* 用户原话 */}
            <div className="px-5 py-4 bg-[#141416] border border-[#27272a] rounded-xl">
              <p className="text-xs text-[#71717a] mb-1">你说的：</p>
              <p className="text-[#fafafa] leading-relaxed">{message}</p>
            </div>

            {/* 第一段：它刺到你的地方 */}
            <div className="space-y-2">
              <p className="text-xs text-[#d4a574] font-medium">它刺到你的地方</p>
              <p className="text-[#fafafa] leading-relaxed text-lg">{result.stab}</p>
            </div>

            {/* 第二段：这件事可以怎么拆 */}
            <div className="space-y-2">
              <p className="text-xs text-[#d4a574] font-medium">这件事可以怎么拆</p>
              <p className="text-[#a1a1aa] leading-relaxed">{result.breakdown}</p>
            </div>

            {/* 第三段：你可以怎么说 */}
            <div className="space-y-2">
              <p className="text-xs text-[#d4a574] font-medium">你可以怎么说</p>
              <div className="px-5 py-4 bg-[#1c1c1f] border border-[#27272a] rounded-xl">
                <p className="text-[#fafafa] leading-relaxed whitespace-pre-wrap">{result.response}</p>
              </div>
            </div>

            {/* 继续说下去的问题 */}
            <div className="px-5 py-4 bg-[#141416] border border-[#27272a] rounded-xl">
              <p className="text-xs text-[#71717a] mb-2">HIRO 想问你：</p>
              <p className="text-[#fafafa] leading-relaxed">{result.followUpQuestion}</p>
            </div>

            {/* 继续按钮 */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setResult(null)
                  setMessage('')
                  setError('')
                }}
                className="flex-1 py-3 border border-[#27272a] rounded-lg text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46] transition-colors"
              >
                我还想说一句
              </button>
            </div>

            {/* 轻付费提示（暂不实现功能，只展示文案） */}
            <div className="pt-4 border-t border-[#1c1c1f]">
              <p className="text-xs text-[#3f3f46] text-center leading-relaxed">
                如果你还想把这件事继续往下捋，HIRO 可以帮你把"想说但没说出口的话"整理成能发出去的版本。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
