import type { AIAnalysisInput, AIAnalysisOutput } from '@/types'

const API_KEY = process.env.DEEPSEEK_API_KEY
const BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'

export async function callDeepSeek(prompt: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

export async function generateContent(
  type: string,
  topic: string,
  style?: string
): Promise<string> {
  const prompts: Record<string, string> = {
    title: `生成小红书标题。要求：真实、有吸引力、像真人写的、不要鸡汤、避免AI感。主题：${topic}`,
    body: `生成小红书正文。要求：真实、有情绪、有共鸣、像真人分享。主题：${topic}`,
    comment: `生成评论引导。要求：自然、引导互动。主题：${topic}`,
    cta: `生成CTA引导。要求：自然、不刻意、转化感强。主题：${topic}`,
  }

  const prompt = style
    ? `${prompts[type]} 风格：${style}`
    : prompts[type]

  return callDeepSeek(prompt)
}

export async function analyzeLead(input: AIAnalysisInput): Promise<AIAnalysisOutput> {
  const prompt = `
你是一个销售助手。根据以下信息分析用户状态并给出建议。

输入：
- 用户最近消息：${input.user_messages.join(' | ')}
- 用户标签：${input.tags.join(', ')}
- 当前阶段：${input.current_stage}

请以JSON格式输出分析结果：
{
  "emotion": "用户情绪",
  "intent_level": "low|medium|high",
  "risk_level": "low|medium|high",
  "suggested_reply": "建议回复内容",
  "next_action": "下一步建议"
}
`

  const result = await callDeepSeek(prompt)
  
  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Parse error:', e)
  }

  return {
    emotion: 'neutral',
    intent_level: 'medium',
    risk_level: 'low',
    suggested_reply: '',
    next_action: '继续跟进',
  }
}
