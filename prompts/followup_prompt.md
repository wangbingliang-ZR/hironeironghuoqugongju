# Follow-up Prompt

## 目标
帮助用户知道"下一步该怎么聊"

## 输入结构
```typescript
{
  lead_id: string
  user_messages: string[]
  tags: string[]
  history: string[]
  current_stage: string
}
```

## 输出结构
```typescript
{
  emotion: string
  intent_level: 'low' | 'medium' | 'high'
  risk_level: 'low' | 'medium' | 'high'
  suggested_reply: string
  next_action: string
}
```

## 分析维度

### Emotion
分析用户当前情绪状态

### Intent Level
- low: 观望、兴趣不大
- medium: 有兴趣但未决定
- high: 明确意向

### Risk Level
- low: 成交概率高
- medium: 需要进一步跟进
- low: 有流失风险

### Suggested Reply
给出具体的回复建议

### Next Action
下一步应该做什么

## 示例
输入: { user_messages: ['这个怎么收费', '能优惠吗'], tags: ['价格敏感'], current_stage: '咨询' }
输出: { emotion: 'interested', intent_level: 'high', risk_level: 'low', suggested_reply: '现在是活动价...', next_action: '促成成交' }
