import { NextRequest, NextResponse } from 'next/server'
import {
  addToPlan,
  getTodayPlan,
  removeFromPlan,
  updatePlanItemStatus,
  updateQuotas,
} from '@/services/publish-plan'
import type { PublishPlatform } from '@/services/platform-adapter'

export async function GET() {
  try {
    const plan = getTodayPlan()
    const counts = plan.items.reduce(
      (acc, item) => {
        acc[item.platform] = (acc[item.platform] || 0) + 1
        return acc
      },
      {} as Record<PublishPlatform, number>
    )

    return NextResponse.json({
      plan,
      progress: counts,
    })
  } catch (error) {
    return NextResponse.json({ error: '获取今日计划失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, id, status, draftId, topic, platform, quotas } = body

    if (action === 'add') {
      if (!draftId || !topic || !platform) {
        return NextResponse.json({ error: '缺少参数' }, { status: 400 })
      }
      const item = addToPlan(draftId, topic, platform as PublishPlatform)
      return NextResponse.json({ success: true, item })
    }

    if (action === 'status') {
      if (!id || !status) {
        return NextResponse.json({ error: '缺少参数' }, { status: 400 })
      }
      const item = updatePlanItemStatus(id, status)
      if (!item) return NextResponse.json({ error: '计划项不存在' }, { status: 404 })
      return NextResponse.json({ success: true, item })
    }

    if (action === 'remove') {
      if (!id) return NextResponse.json({ error: '缺少ID' }, { status: 400 })
      const item = removeFromPlan(id)
      if (!item) return NextResponse.json({ error: '计划项不存在' }, { status: 404 })
      return NextResponse.json({ success: true, item })
    }

    if (action === 'quotas') {
      const plan = updateQuotas(quotas || {})
      return NextResponse.json({ success: true, plan })
    }

    return NextResponse.json({ error: '未知操作' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}
