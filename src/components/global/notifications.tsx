'use client'

import { useState, useRef } from 'react'
import {
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from '@knocklabs/react-notification-feed'

import '@knocklabs/react-notification-feed/dist/index.css'

export default function Notifications() {
  const [isVisible, setIsVisible] = useState(false)
  const notifButtonRef = useRef(null)

  return (
    <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 999999 }}>
      <KnockFeedProvider
        apiKey={process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY || ''}
        feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_ID || ''}
        userId="0"
      >
        <>
          <NotificationIconButton ref={notifButtonRef} onClick={(e) => setIsVisible(!isVisible)} />
          <NotificationFeedPopover
            buttonRef={notifButtonRef}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
            onNotificationClick={(item) => {
              const edit: string | undefined = item.data?.edit
              edit && window.open(edit, '_blank')
            }}
          />
        </>
      </KnockFeedProvider>
    </div>
  )
}
