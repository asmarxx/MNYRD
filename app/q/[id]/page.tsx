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

type Recommendation = {
  id:string
  dealt_with:boolean
  comment:string | null
  created_at:string
  suppliers?: {
    id:string
    name:string
    name_ar:string | null
    phone:string | null
    website:string | null
  } | null
}

export default function QuestionPage() {
  const params = useParams()
  const id = String(params.id)
  const [question, setQuestion] = useState<Question | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: questionData }, { data: recData }] = await Promise.all([
        supabase
          .from('questions')
          .select(`id,title,description,created_at,recommendations_count,views_count,cities(name_ar),categories(name_ar)`)
          .eq('id', id)
          .single(),
        supabase
          .from('recommendations')
          .select(`id,dealt_with,comment,created_at,suppliers(id,name,name_ar,phone,website)`)
          .eq('question_id', id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
      ])

      if (questionData) setQuestion(questionData as unknown as Question)
      setRecommendations((recData ?? []) as unknown as Recommendation[])
      setLoading(false)
      await supabase.rpc('increment_question_view', { question_uuid: id })
    }
    load()
  }, [id])

  function shareWhatsApp() {
    if (!question) return
    const pageUrl = window.location.href
    const lines = [
      'مطلوب مورد | Supplier Needed',
      '',
      question.title,
      question.cities?.name_ar ? `المنطقة: ${question.cities.name_ar}` : '',
      '',
      'إذا عندك مورد مجرب، أضف ترشيحك من خلال الرابط:',
      pageUrl
    ].filter(Boolean)
    window.open(`https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`, '_blank')
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
              {question.cities?.name_ar && <span className="chip">المدينة: {question.cities.name_ar}</span>}
              {question.categories?.name_ar && <span className="chip">{question.categories.name_ar}</span>}
              <span className="chip">{question.recommendations_count} ترشيح</span>
            </div>

            <h1 style={{color:'var(--navy)', lineHeight:1.5}}>{question.title}</h1>
            {question.description && <p style={{lineHeight:1.9}}>{question.description}</p>}

            <div style={{display:'flex', gap:10, flexWrap:'wrap', marginTop:22}}>
              <button className="btn btnAccent" onClick={shareWhatsApp}>شارك السؤال في واتساب</button>
              <a className="btn btnPrimary" href={`/q/${question.id}/recommend`}>رشّح مورد</a>
            </div>
          </article>

          <div style={{marginTop:24}}>
            <div className="sectionTitle">
              <div>
                <h2>ترشيحات المجتمع</h2>
                <p>الموردون الذين رشحهم أعضاء MNYRD لهذا الطلب.</p>
              </div>
            </div>

            {recommendations.length === 0 ? (
              <div className="card empty">
                <h3>ما وصل أي ترشيح حتى الآن.</h3>
                <p>شارك السؤال في قروب المشتريات، وأول ترشيح راح يظهر هنا مباشرة.</p>
              </div>
            ) : (
              <div className="results">
                {recommendations.map((rec) => (
                  <article className="card" key={rec.id}>
                    <div className="cardTop">
                      <div>
                        <h3>{rec.suppliers?.name_ar || rec.suppliers?.name || 'مورد'}</h3>
                        <div className="chips">
                          {rec.dealt_with && <span className="chip">سبق التعامل معه</span>}
                          <span className="chip">أضيف: {new Date(rec.created_at).toLocaleDateString('ar-SA')}</span>
                        </div>
                        {rec.comment && <p style={{marginBottom:0, lineHeight:1.8}}>{rec.comment}</p>}
                        {(rec.suppliers?.phone || rec.suppliers?.website) && (
                          <div className="meta" style={{marginTop:12}}>
                            {rec.suppliers?.phone && <div>الهاتف: {rec.suppliers.phone}</div>}
                            {rec.suppliers?.website && <div>الموقع: {rec.suppliers.website}</div>}
                          </div>
                        )}
                      </div>
                      <div className="score">{rec.dealt_with ? 'مجرّب' : 'مرشّح'}</div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
