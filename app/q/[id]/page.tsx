'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

type Question = {
  id:string
  title:string
  description:string | null
  created_at:string
  recommendations_count:number
  views_count:number
  cities?: { name_ar:string } | null
  categories?: { name_ar:string } | null
}

export default function QuestionPage() {
  const params = useParams()
  const id = String(params.id)
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('questions')
        .select(`
          id,title,description,created_at,recommendations_count,views_count,
          cities(name_ar),
          categories(name_ar)
        `)
        .eq('id', id)
        .single()

      if (data) setQuestion(data as unknown as Question)
      setLoading(false)
      await supabase.rpc('increment_question_view', { question_uuid: id })
    }
    load()
  }, [id])

  function shareWhatsApp() {
    if (!question) return
    const pageUrl = window.location.href
    const text = `🔎 مطلوب مورد | Supplier Needed

${question.title}
${question.cities?.name_ar ? `📍 ${question.cities.name_ar}` : ''}

إذا عندك مورد مجرّب، أضف ترشيحك هنا:
${pageUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    supabase.rpc('increment_whatsapp_share', { question_uuid: question.id })
  }

  if (loading) return <main className="shell"><div className="container section">جاري التحميل...</div></main>
  if (!question) return <main className="shell"><div className="container section">السؤال غير موجود.</div></main>

  return (
    <main className="shell">
      <header className="header">
        <div className="container nav">
          <a className="brand" href="/">
            <div className="brandMark">MN</div>
            <div className="brandText">
              <strong>MNYRD | مَن يورّد؟</strong>
              <span>سؤال من مجتمع المشتريات</span>
            </div>
          </a>
        </div>
      </header>

      <section className="section">
        <div className="container" style={{maxWidth:820}}>
          <article className="card">
            <div className="chips">
              {question.cities?.name_ar && <span className="chip">📍 {question.cities.name_ar}</span>}
              {question.categories?.name_ar && <span className="chip">{question.categories.name_ar}</span>}
              <span className="chip">👍 {question.recommendations_count} ترشيح</span>
            </div>

            <h1 style={{color:'var(--navy)', lineHeight:1.5}}>{question.title}</h1>
            {question.description && <p style={{lineHeight:1.9}}>{question.description}</p>}

            <div style={{display:'flex', gap:10, flexWrap:'wrap', marginTop:22}}>
              <button className="btn btnAccent" onClick={shareWhatsApp}>
                شارك في واتساب
              </button>
              <a className="btn btnPrimary" href={`/q/${question.id}/recommend`}>
                رشّح مورد
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
