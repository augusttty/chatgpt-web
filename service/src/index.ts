import express from 'express'
import type { RequestProps } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString } from './utils/is'
import { createUserId } from './utils'
import mongoService from './mongoService'

try {
  mongoService.connect(process.env.MONGODBURI)
}
catch (error) {
  globalThis.console.log(error)
}
const app = express()
const router = express.Router()

app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/chat-process', [auth, limiter], async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')
  let chatReply = null
  try {
    const { prompt, options = {}, systemMessage, temperature, top_p, userId, uuid } = req.body as RequestProps
    if (!userId)
      throw new Error('userId is required')
    if (!uuid)
      throw new Error('uuid is required')
    const currentModelType = currentModel()
    const mongoServiceEnabled = mongoService.enabled
    let firstChunk = true
    if (mongoServiceEnabled) {
      const chatDataUser = {
        role: 'user',
        userId,
        uuid,
        requestOptions: options,
        text: prompt,
        modelType: currentModelType,
      }
      await mongoService.insertChat(chatDataUser)
    }

    // if(mongoService.enabled){
    //   mongoService.testInsert()
    // }
    await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        chatReply = chat
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
      temperature,
      top_p,
    })

    if (mongoServiceEnabled) {
      const chatData = {
        role: 'assistant',
        userId,
        uuid,
        requestOptions: options,
        text: chatReply.text,
        modelType: currentModelType,
        model: chatReply.detail.model,
        msgId: chatReply.id,
      }
      await mongoService.insertChat(chatData)
    }
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    // console.log(chatReply)
    res.end()
  }
})

router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    if (!token)
      throw new Error('Secret key is empty')

    let userId = ''
    if (token === process.env.ADMIN_SECRET_KEY)
      userId = 'august'
    else if (token === process.env.AUTH_SECRET_KEY)
      userId = createUserId()
    else
      throw new Error('密钥无效 | Secret key is invalid')

    res.send({ status: 'Success', message: 'Verify successfully', data: { userId } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

app.use('', router)
app.use('/api', router)
app.set('trust proxy', 1)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
