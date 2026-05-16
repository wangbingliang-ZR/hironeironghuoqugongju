import { NextRequest, NextResponse } from 'next/server'
import { deletePublishDraft, getPublishDrafts, savePublishDraft, updatePublishDraftStatus } from '@/services/publish-drafts'

export async function GET() {
  try {
    const drafts = getPublishDrafts()
    return NextResponse.json({
      drafts,
      stats: {
        total: drafts.length,
        draft: drafts.filter(item => item.status === 'draft').length,
        copied: drafts.filter(item => item.status === 'copied').length,
        published: drafts.filter(item => item.status === 'published').length,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: '获取分发草稿失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, id, status, topic, emotion, activePlatform, publishPackage } = body

    if (action === 'save') {
      if (!topic || !publishPackage) {
        return NextResponse.json({ error: '缺少草稿内容' }, { status: 400 })
      }
      const draft = savePublishDraft({ topic, emotion, activePlatform, package: publishPackage })
      return NextResponse.json({ success: true, draft })
    }

    if (action === 'status') {
      if (!id || !status) {
        return NextResponse.json({ error: '缺少状态参数' }, { status: 400 })
      }
      const draft = updatePublishDraftStatus(id, status)
      if (!draft) return NextResponse.json({ error: '草稿不存在' }, { status: 404 })
      return NextResponse.json({ success: true, draft })
    }

    if (action === 'delete') {
      if (!id) return NextResponse.json({ error: '缺少草稿ID' }, { status: 400 })
      const draft = deletePublishDraft(id)
      if (!draft) return NextResponse.json({ error: '草稿不存在' }, { status: 404 })
      return NextResponse.json({ success: true, draft })
    }

    return NextResponse.json({ error: '未知操作' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: '操作分发草稿失败' }, { status: 500 })
  }
}
