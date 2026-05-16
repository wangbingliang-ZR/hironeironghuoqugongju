import { NextRequest, NextResponse } from 'next/server'

export interface HiroChatInput {
  message: string
}

export interface HiroChatOutput {
  stab: string
  breakdown: string
  response: string
  followUpQuestion: string
}

function generateMockResponse(message: string): HiroChatOutput {
  const lower = message.toLowerCase()

  if (lower.includes('面试') || lower.includes('紧张') || lower.includes('慌')) {
    return {
      stab: '你不是没准备好，是怕自己被看穿“其实没那么强”。',
      breakdown: '面试焦虑通常不是怕问题答不上来，是怕对方发现你和简历上写的不太一样。但大多数时候，面试官也在找“合适”的人，不是“完美”的人。',
      response: '我准备的材料都在这里，可能有些地方我需要再确认，但我对这份工作的意愿是真实的。',
      followUpQuestion: '你面试前一晚，反复看的是简历还是聊天记录？',
    }
  }

  if (lower.includes('主动') || lower.includes('加班') || lower.includes('领导')) {
    return {
      stab: '这句话最难受的地方，是他没看见你已经做了什么。',
      breakdown: '你不是没主动，你是已经把时间交出去了，对方还想要你把态度也交出去。而且他用的是“不够主动”这种模糊词，让你没法反驳。',
      response: '我理解你对主动性的要求。过去两周我已经参与了几个紧急任务，如果需要我在主动性上调整，我希望能具体到任务优先级，而不是只用“不够主动”来概括。',
      followUpQuestion: '他当时是在会议里说的，还是单独跟你说的？',
    }
  }

  if (lower.includes('拒绝') || lower.includes('塞活') || lower.includes('堆')) {
    return {
      stab: '你不是不会拒绝，是怕拒绝了，那顿饭就没人叫你了。',
      breakdown: '很多时候“不敢拒绝”不是因为软弱，是因为拒绝的成本被提前算好了：关系变僵、下次没人帮你、领导觉得你不好用。但这些成本，很多时候是你自己预估的，不是真的会发生。',
      response: '这个任务我可以接，但我目前手上已经有两个在跑的项目，我需要你帮我确认一下优先级，不然两个都做，质量都会掉。',
      followUpQuestion: '你上次想说"不"，后来为什么又说了"好"？',
    }
  }

  if (lower.includes('约谈') || lower.includes('试用期') || lower.includes('不符合')) {
    return {
      stab: '试用期约谈不是判你出局，但门一关的那一刻，你脑子里已经把自己判了。',
      breakdown: '真正让你慌的不是“不符合预期”这句话，是你提前在脑子里演完了整套被辞退的剧情。但约谈首先是沟通，不是通知。',
      response: '我想先确认一下，这个“不符合预期”具体是指哪几个方面？我需要清楚的反馈，才能知道往哪调整。',
      followUpQuestion: '你被约谈那天，第一句话听到的是什么？',
    }
  }

  if (lower.includes('否定') || lower.includes('当众') || lower.includes('会议')) {
    return {
      stab: '被当众否定，最难消化的不是那句话，是会议室里突然安静下来的那几秒。',
      breakdown: '领导当众点你，通常不是针对你这个人，是他需要一个人来“展示问题”。但你的难受是真实的，因为那个场景把你从“团队一员”变成了“问题本身”。',
      response: '这个部分我确实需要再确认，但我希望下次如果有类似情况，我们可以单独沟通，这样我能更快调整。',
      followUpQuestion: '你被当众否定那次，手里攥着什么东西？',
    }
  }

  return {
    stab: '这句话听起来简单，但能把它说出来，本身就已经不容易了。',
    breakdown: '很多时候我们卡在"不知道怎么说"，不是因为事情复杂，是因为怕说出来之后，对方的反应我们接不住。但你已经把它丢出来了，这已经比大多数人在这种状态里走得更远。',
    response: '我需要一点时间把这件事理清楚，然后再和你聊。',
    followUpQuestion: '你最想把哪句话原封不动丢出来？',
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as HiroChatInput
    const { message } = body

    if (!message || !message.trim()) {
      return NextResponse.json({ error: '请先输入那句话' }, { status: 400 })
    }

    // 限制输入长度
    if (message.length > 500) {
      return NextResponse.json({ error: '那句话有点长，先丢这一句就行' }, { status: 400 })
    }

    // 目前先用 mock 响应，后续接入真实 AI
    const response = generateMockResponse(message)

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    return NextResponse.json({ error: 'HIRO 暂时没接住，再试一次' }, { status: 500 })
  }
}
