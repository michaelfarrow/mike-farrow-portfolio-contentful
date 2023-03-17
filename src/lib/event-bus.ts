type AddRemoveEventListener = (type: string, listener: (event: CustomEvent) => void) => void

const EventBus = {
  on(event: string, callback: (detail: any) => void) {
    ;(document.addEventListener as AddRemoveEventListener)(event, callback)
  },
  dispatch(event: string, data?: any) {
    document.dispatchEvent(new CustomEvent(event, { detail: data || null }))
  },
  off(event: string, callback: (detail: any) => void) {
    ;(document.removeEventListener as AddRemoveEventListener)(event, callback)
  },
}

export default EventBus
