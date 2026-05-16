import type { EmotionalContentOutput } from './ai'

export type PublishPlatform = 'xiaohongshu' | 'zhihu' | 'wechat' | 'shortVideo'

export interface PlatformDraft {
  platform: PublishPlatform
  platformName: string
  title: string
  body: string
  tags: string[]
  commentGuide: string
  copyText: string
  leadIn: string
}

export interface PublishPackage {
  source: EmotionalContentOutput
  drafts: PlatformDraft[]
  csv: string
}

const platformNames: Record<PublishPlatform, string> = {
  xiaohongshu: '小红书图文',
  zhihu: '知乎回答',
  wechat: '公众号短文',
  shortVideo: '短视频脚本',
}

function normalizeTag(tag: string) {
  return tag.replace(/^#/, '').trim()
}

function formatTags(tags: string[]) {
  return tags.map(normalizeTag).filter(Boolean).map(tag => `#${tag}`).join(' ')
}

function buildXiaohongshuDraft(content: EmotionalContentOutput): PlatformDraft {
  const tags = [...content.hashtags.map(normalizeTag), '打工人', '职场日常'].filter(Boolean).slice(0, 6)
  const leadIn = `如果你也卡在这儿，可以先把话丢给HIRO。`
  const body = `${content.hook}\n\n${content.content}\n\n${formatTags(tags)}`
  return {
    platform: 'xiaohongshu',
    platformName: platformNames.xiaohongshu,
    title: content.title.slice(0, 20),
    body,
    tags,
    commentGuide: content.commentTrigger,
    copyText: `${content.title.slice(0, 20)}\n\n${body}`,
    leadIn,
  }
}

function buildZhihuDraft(content: EmotionalContentOutput): PlatformDraft {
  const tags = ['职场', '打工人', '职场心理']
  const leadIn = `如果你也卡在这件事里，可以先试试把它写出来。不用整理，不用体面，就把那句话原样写下来。有时候说出来，就已经是好开始。`
  const body = `${content.hook}\n\n${content.content}\n\n${content.shareSentence}\n\n---\n${leadIn}`
  return {
    platform: 'zhihu',
    platformName: platformNames.zhihu,
    title: `${content.title}，该怎么想？`,
    body,
    tags,
    commentGuide: content.commentTrigger,
    copyText: `${content.title}，该怎么想？\n\n${body}`,
    leadIn,
  }
}

function buildWechatDraft(content: EmotionalContentOutput): PlatformDraft {
  const tags = ['职场', '成长', '情绪']
  const leadIn = `如果你也卡在这儿，可以先把话丢给HIRO。不用整理，不用讲得体面。就把那句话发过来。`
  const body = `## ${content.hook}\n\n${content.content}\n\n---\n\n${content.shareSentence}\n\n${content.commentTrigger}\n\n---\n\n${leadIn}`
  return {
    platform: 'wechat',
    platformName: platformNames.wechat,
    title: content.title,
    body,
    tags,
    commentGuide: content.commentTrigger,
    copyText: `${content.title}\n\n${body}`,
    leadIn,
  }
}

function buildShortVideoDraft(content: EmotionalContentOutput): PlatformDraft {
  const tags = [...content.hashtags.map(normalizeTag), '职场', '打工人'].filter(Boolean).slice(0, 6)
  const leadIn = `如果你也卡在这儿，可以先把话丢给HIRO。`
  const body = `开头3秒：${content.hook}\n\n镜头1：手机/工位/会议室的近景，字幕：${content.title}\n\n配音：${content.content}\n\n结尾字幕：${content.shareSentence}\n\n评论引导：${content.commentTrigger}\n\n${formatTags(tags)}\n\n${leadIn}`
  return {
    platform: 'shortVideo',
    platformName: platformNames.shortVideo,
    title: content.title,
    body,
    tags,
    commentGuide: content.commentTrigger,
    copyText: body,
    leadIn,
  }
}

function escapeCsv(value: string) {
  return `"${value.replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`
}

function buildCsv(drafts: PlatformDraft[]) {
  const header = ['平台', '标题', '正文', '标签', '评论引导'].map(escapeCsv).join(',')
  const rows = drafts.map(draft => [
    draft.platformName,
    draft.title,
    draft.body,
    formatTags(draft.tags),
    draft.commentGuide,
  ].map(escapeCsv).join(','))
  return [header, ...rows].join('\n')
}

export function buildPublishPackage(content: EmotionalContentOutput): PublishPackage {
  const drafts = [
    buildXiaohongshuDraft(content),
    buildZhihuDraft(content),
    buildWechatDraft(content),
    buildShortVideoDraft(content),
  ]

  return {
    source: content,
    drafts,
    csv: buildCsv(drafts),
  }
}
