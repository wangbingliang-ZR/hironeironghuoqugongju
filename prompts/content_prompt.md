# Content Prompt

## 目标
生成小红书内容，要求真实、有情绪、像真人分享

## 输入结构
```typescript
{
  type: 'title' | 'body' | 'comment' | 'cta'
  topic: string
  style?: string
  context?: string
}
```

## 输出结构
```typescript
{
  content: string
}
```

## Prompt 规则

### Title
生成小红书标题。要求：真实、有吸引力、像真人写的、不要鸡汤、避免AI感

### Body
生成小红书正文。要求：真实、有情绪、有共鸣、像真人分享

### Comment
生成评论引导。要求：自然、引导互动

### CTA
生成CTA引导。要求：自然、不刻意、转化感强

## 风格要求
- 避免鸡汤
- 避免夸张营销
- 避免AI官话
- 避免假专业感

## 示例
输入: { type: 'title', topic: '副业赚钱' }
输出: { content: '下班后做这个，我每个月多赚5000' }
