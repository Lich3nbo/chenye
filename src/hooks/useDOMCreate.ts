import { onUnmounted } from 'vue'

function useDOMCreate (nodeId: string) {
  const node = document.createElement(nodeId)
  node.id = nodeId
  document.body.appendChild(node)
  onUnmounted(() => {
    document.body.removeChild(node)
  })
}

export default useDOMCreate
