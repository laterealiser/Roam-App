"use client"
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useParams } from 'next/navigation'

export default function ChatRoom() {
  const params = useParams()
  const id = params.id as string
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [connStatus, setConnStatus] = useState('ANONYMOUS')
  const [userId, setUserId] = useState<string | null>(null)
  
  // To store the mapping between UUIDs and display names
  const [userDisplayNames, setUserDisplayNames] = useState<Record<string, string>>({})
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    async function loadChat() {
      // Get Current User
      const { data: authData } = await supabase.auth.getUser()
      const currentUserId = authData.user?.id
      setUserId(currentUserId || null)

      // Load connection status
      const { data: connData } = await supabase.from('connections').select('*').eq('id', id).single()
      if (connData) {
        setConnStatus(connData.status)

        // Fetch profiles for the two users in the connection
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, pseudonym, real_name')
          .in('id', [connData.user_one_id, connData.user_two_id])

        if (profiles) {
          const namesMapping: Record<string, string> = {}
          profiles.forEach(p => {
            // Determine name to show based on connection status
            namesMapping[p.id] = connData.status === 'REVEALED' ? p.real_name : p.pseudonym
          })
          setUserDisplayNames(namesMapping)
        }
      }

      // Load previous messages
      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .eq('connection_id', id)
        .order('created_at', { ascending: true })
      
      if (msgData) setMessages(msgData)
    }

    loadChat()

    // Subscribe to REALTIME new messages
    const channel = supabase.channel(`room_${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `connection_id=eq.${id}` }, 
      (payload) => {
        setMessages(prev => [...prev, payload.new])
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'connections', filter: `id=eq.${id}` },
      async (payload) => {
        const newStatus = payload.new.status
        setConnStatus(newStatus)
        if (newStatus === 'REVEALED') {
          // Re-fetch profiles to show real names if it changed to REVEALED
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, real_name')
            .in('id', [payload.new.user_one_id, payload.new.user_two_id])
            
          if (profiles) {
            setUserDisplayNames(prev => {
              const updated = { ...prev }
              profiles.forEach(p => { updated[p.id] = p.real_name })
              return updated
            })
          }
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id, supabase])

  async function sendMessage() {
    if (!input.trim() || !userId) return
    
    await supabase.from('messages').insert([
      { connection_id: id, sender_id: userId, text: input }
    ])
    setInput('')
  }

  async function requestReveal() {
    if (confirm("Are you sure you want to reveal identities for both users? This cannot be undone.")) {
      await supabase.from('connections').update({ status: 'REVEALED' }).eq('id', id)
      // The realtime subscription will pick up the update and change the UI.
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950">
      {/* Sticky Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-10 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${connStatus === 'REVEALED' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
            {connStatus === 'REVEALED' ? 'R' : '?'}
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">
              {connStatus === 'ANONYMOUS' ? 'Anonymous Chat' : 'Identity Revealed'}
            </h2>
            <p className="text-xs text-slate-400">Messages auto-delete in 24 hours</p>
          </div>
        </div>
        
        {connStatus === 'ANONYMOUS' && (
          <button 
            onClick={requestReveal} 
            className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-2 text-sm font-bold rounded-lg transition-colors shadow-sm"
          >
            Reveal Identity
          </button>
        )}
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg, index) => {
          const isMe = msg.sender_id === userId
          const showSenderName = !isMe && (index === 0 || messages[index - 1].sender_id !== msg.sender_id)

          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              {showSenderName && (
                <span className="text-xs text-slate-500 mb-1 ml-1">
                  {userDisplayNames[msg.sender_id] || 'Loading...'}
                </span>
              )}
              <div 
                className={`max-w-[75%] sm:max-w-[60%] px-4 py-3 rounded-2xl ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-900 border-t border-slate-800 p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input 
            className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
          />
          <button 
            onClick={sendMessage} 
            disabled={!input.trim()}
            className="bg-blue-600 disabled:bg-blue-800 disabled:text-blue-400 hover:bg-blue-500 text-white px-6 rounded-full font-bold transition-colors flex items-center justify-center"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
