import { NextRequest, NextResponse } from 'next/server'
import { generateEmotionalContent } from '@/services/ai'
import { buildPublishPackage } from '@/services/platform-adapter'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, emotion } = body

    if (!topic) {
      return NextResponse.json(
        { error: '请输入要分发的主题' },
        { status: 400 }
      )
    }

    const content = await generateEmotionalContent({ topic, emotion })
    const publishPackage = buildPublishPackage(content)

    return NextResponse.json({ success: true, package: publishPackage })
  } catch (error) {
    console.error('[API] Publish package generation error:', error)
    return NextResponse.json(
      { error: '生成分发包失败，请重试' },
      { status: 500 }
    )
  }
}
