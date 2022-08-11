import { createApp } from 'vue'
import MessageCom from './MessageCom.vue'
// 谁姆斯文件来模拟vue类型的结构
export type MessageType = 'success' | 'error' | 'default'

const createMessage = (message: string, type: MessageType, timeout = 2000) => {
  const messageInstance = createApp(MessageCom,
    {
      message,
      type
    }
  )
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  messageInstance.mount(mountNode)
  setTimeout(() => {
    messageInstance.unmount()
    document.body.removeChild(mountNode)
  }, timeout)
}

export default createMessage
