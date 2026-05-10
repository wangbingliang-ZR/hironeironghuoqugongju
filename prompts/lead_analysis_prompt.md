# Lead Analysis Prompt

## 目标
分析潜在客户，给出跟进建议

## 输入结构
```typescript
{
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

## JSON Schema
```json
{
  "type": "object",
  "properties": {
    "emotion": { "type": "string" },
    "intent_level": { "type": "string", "enum": ["low", "medium", "high"] },
    "risk_level": { "type": "string", "enum": ["low", "medium", "high"] },
    "suggested_reply": { "type": "string" },
    "next_action": { "type": "string" }
  },
  "required": ["emotion", "intent_level", "risk_level", "suggested_reply", "next_action"]
}
```

## 示例
输入:
```json
{
  "user_messages": ["这个课程适合新手吗", "学完能达到什么效果"],
  "tags": ["新手", "犹豫"],
  "history": [],
  "current_stage": "初次咨询"
}
```

输出:
```json
{
  "emotion": "好奇+犹豫",
  "intent_level": "medium",
  "risk_level": "medium",
  "suggested_reply": "这个课程专门为零基础学员设计...",
  "next_action": "发送成功案例，消除顾虑"
}
```
