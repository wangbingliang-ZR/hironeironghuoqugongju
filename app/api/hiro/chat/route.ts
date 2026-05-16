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
      stab: '你不是怕答不上来，是怕对方觉得"你简历上写的和真人不太一样"。',
      breakdown: '你复习了两周，该背的都背了。但坐在那间会议室里，你脑子里想的不是题目，是"我值不值得坐在这儿"。面试官问"你还有什么想问的"，你支吾了半天。',
      response: '我准备好的部分都在这儿了，有些地方我可能还在熟悉，但我对这个岗位的意愿不是编的。',
      followUpQuestion: '你面试前一晚，反复看的是简历还是聊天记录？',
    }
  }

  if (lower.includes('主动') || lower.includes('加班') || lower.includes('领导')) {
    return {
      stab: '他不是在说你不够主动，是在说"你怎么还没把自己全交出来"。',
      breakdown: '你已经把晚上的时间交出去了，他还嫌你态度不够。而且他用"不够主动"这种词，你根本没法接——你说你没主动吧，像认罪；你说我主动了吧，像顶嘴。',
      response: '我手上有两个在跑的项目，这个我接了，但优先级你帮我定。别到最后又来一句"你怎么不早点说"。',
      followUpQuestion: '他当时是在会议上顺口提的，还是单独把你叫到办公室说的？',
    }
  }

  if (lower.includes('拒绝') || lower.includes('塞活') || lower.includes('堆')) {
    return {
      stab: '你不是不会拒绝，是怕拒绝了，这桌上以后就没你的位置了。',
      breakdown: '你接活的时候心里已经在算了：不接，关系僵；接了，自己累。但那个"不接就完了"的结果，其实是你自己脑补的，还没发生。',
      response: '这个我可以做，但我手上还有两个在跑。你让我先做哪个，不然都做就是都糊。',
      followUpQuestion: '你上次想说"不"，后来为什么又说了"好"？',
    }
  }

  if (lower.includes('约谈') || lower.includes('试用期') || lower.includes('不符合')) {
    return {
      stab: '门一关，他说"不太符合预期"，你脑子里已经演完了被辞退的全套剧情。',
      breakdown: '但你回过神来想一下，他如果真不想留你，直接走流程就行了，没必要叫你来谈。他叫你进来，说明还没死心，但你先把自己判了。',
      response: '这个"不符合预期"具体是哪几块？我得知道标准是啥，不然我瞎调整。',
      followUpQuestion: '你被约谈那天，第一句话听到的是什么？',
    }
  }

  if (lower.includes('否定') || lower.includes('当众') || lower.includes('会议')) {
    return {
      stab: '那句话刚落音，会议室里突然安静了两秒。那两秒比话本身更难咽。',
      breakdown: '他点你名的时候，不是说"这个人不行"，是他需要一个"问题"来展示给大家看。但你坐在那，从"团队里的一员"变成了"那个问题"，这个落差谁都不好受。',
      response: '这个我确实理得不够清楚。下次有这种情况，你直接私下跟我说，我改得更快。',
      followUpQuestion: '你被当众否定那次，手里攥着什么东西？',
    }
  }

  return {
    stab: '能把它说出来，本身就比憋回去强。',
    breakdown: '你说出来了，这已经是第一步。很多人卡在这儿连打字的勇气都没有。至于接下来怎么办，不急，先把它放在这儿。',
    response: '我现在脑子是乱的，先不急着回，让我理一理。',
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
