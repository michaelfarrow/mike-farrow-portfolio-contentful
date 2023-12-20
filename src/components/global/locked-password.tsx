'use client'

import { useState } from 'react'

export interface Props {
  children?: React.ReactNode
}

export default function LockedPassword({ children }: Props) {
  const [password, setPassword] = useState('')
  const [passwordIncorrect, setPasswordIncorrect] = useState(false)
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const request = await fetch('/api/unlock', {
      body: JSON.stringify({ password }),
      method: 'post',
    })

    if (request.status === 200) {
      if (children) {
        setLocked(false)
      } else {
        window.location.reload()
      }
    }

    // if (request.status !== 200) return setPasswordIncorrect(true), setLoading(false)
    // else window.location.reload()
  }

  return locked ? (
    <div className="password-prompt-dialog">
      <form onSubmit={handleSubmit}>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  ) : (
    children || <div>Reloading</div>
  )
}
