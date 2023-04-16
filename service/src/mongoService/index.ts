import mongoose from 'mongoose'
import { ChatModel } from 'src/schemas/chat.schema'
class MongoService {
  enabled = false

  constructor() {

  }

  async connect(uri: string) {
    await mongoose.connect(uri)
    globalThis.console.log('mongo connected')
    this.enabled = true
  }

  async testInsert() {
    const kittySchema = new mongoose.Schema({
      name: String,
    })
    const KittenModel = mongoose.model('Kitten', kittySchema)
    const cat = new KittenModel({ name: 'zhima' })
    await cat.save()
  }

  insertChat(data: any) {
    try {
      const chat = new ChatModel(data)
      chat.save()
    }
    catch (error) {
      globalThis.console.log('insertChat error:', error)
    }
  }
}

export default new MongoService()
