'use client'

import { FormEvent, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            account_type: 'procurement'
          }
        }
      })
      if (error) setMessage(error.message)
      else {
        setMessage('تم إنشاء الحساب بنجاح.')
        router.push('/ask')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else router.push('/ask')
    }
    setLoading(false)
  }

  return (
    <main className="shell">
      <header className="header">
        <div className="container nav">
          <a className="brand" href="/">
            <div className="brandMark">MN</div>
            <div className="brandText">
              <strong>MNYRD | مَن يورّد؟</strong>
              <span>مجتمع المشتريات</span>
            </div>
          </a>
        </div>
      </header>

      <section className="section">
        <div className="container" style={{maxWidth: 560}}>
          <div className="card">
            <h2 style={{marginTop:0, color:'var(--navy)'}}>
              {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب مشتريات'}
            </h2>

            <form onSubmit={submit} style={{display:'grid', gap:12}}>
              {mode === 'signup' && (
                <input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="الاسم"
                  required
                />
              )}

              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                required
              />

              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                minLength={6}
                required
              />

              <button className="btn btnAccent" disabled={loading}>
                {loading ? 'لحظة...' : (mode === 'login' ? 'دخول' : 'إنشاء الحساب')}
              </button>
            </form>

            {message && <p className="meta">{message}</p>}

            <button
              className="btn btnGhost"
              style={{marginTop:10}}
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            >
              {mode === 'login' ? 'ما عندك حساب؟ أنشئ حساب' : 'عندك حساب؟ سجل دخول'}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
