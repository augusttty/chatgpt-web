import type { Document } from 'mongoose'
import mongoose from 'mongoose'

interface ConversationRequest {
  conversationId?: string
  parentMessageId?: string
}

interface RequestOptions {
  prompt: string
  options?: ConversationRequest | null
}

enum Role {
  USER = 'user',
  SYSTEM = 'system',
  ASSISTANT = 'assistant',
}

interface Chat extends Document {
  role: Role
  msgId: string | null
  model: string | null
  created: number
  text: string
  requestOptions: RequestOptions | null
  uuid: string
  userId: string
  modelType: string | null
}

const chatSchema = new mongoose.Schema({

  role: {
    type: String,
    required: true,
  },

  msgId: {
    type: String,
    required: false,
  },
  modelType: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: false,
  },
  created: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  requestOptions: {
    type: Object,
    required: false,
  },
  uuid: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
})

const ChatModel = mongoose.model<Chat>('Chat', chatSchema)

export { ChatModel }
export type { Chat }
