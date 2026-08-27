'use client'

import { FormEvent, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function RecommendPage() {
  const params = useParams()
  const questionId = String(params.id)
  const router = useRouter()

  const [userId, setUserId] = useState<string | null>(null)
  const [supplierName, setSupplierName] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [dealtWith, setDealtWith] = useState(true)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({data}) => {
      if (!data.user) router.replace('/login')
      else setUserId(data.user.id)
    })
  }, [router])

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!userId || !supplierName.trim()) return
    setLoading(true)
    setMessage('')

    const { data: existing } = await supabase
      .from('suppliers')
      .select('id,name')
      .ilike('name', supplierName.trim())
      .limit(1)

    let supplierId = existing?.[0]?.id

    if (!supplierId) {
      const { data: created, error: createError } = await supabase
        .from('suppliers')
        .insert({
          name: supplierName.trim(),
          name_ar: supplierName.trim(),
          phone: phone.trim() || null,
          website: website.trim() || null,
          created_by: userId
        })
        .select('id')
        .single()

      if (createError) {
        setMessage(createError.message)
        setLoading(false)
        return
      }
      supplierId = created.id
    }

    const { error } = await supabase
      .from('recommendations')
      .insert({
        question_id: questionId,
        supplier_id: supplierId,
        user_id: userId,
        dealt_with: dealtWith,
        comment: comment.trim() || null
      })

    if (error) setMessage(error.message)
    else router.push(`/q/${questionId}`)

    setLoading(false)
  }

  return (
    <main className="shell">
      <section className="section">
        <div className="container" style={{maxWidth:680}}>
          <div className="card">
            <h2 style={{marginTop:0, color:'var(--navy)'}}>رشّح مورد</h2>
            <p className="meta">خل ترشيحك يفيد موظف المشتريات اللي يسأل الآن واللي بيبحث بعده.</p>

            <form onSubmit={submit} style={{display:'grid', gap:12, marginTop:18}}>
              <input value={supplierName} onChange={e=>setSupplierName(e.target.value)} placeholder="اسم المورد" required />
              <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="رقم الشركة (اختياري)" />
              <input value={website} onChange={e=>setWebsite(e.target.value)} placeholder="الموقع الإلكتروني (اختياري)" />

              <label style={{display:'flex', gap:8, alignItems:'center'}}>
                <input type="checkbox" checked={dealtWith} onChange={e=>setDealtWith(e.target.checked)} />
                سبق تعاملت معه
              </label>

              <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={4} placeholder="ملاحظة قصيرة عن تجربتك (اختياري)" />

              <button className="btn btnAccent" disabled={loading}>
                {loading ? 'جاري حفظ الترشيح...' : 'إرسال الترشيح'}
              </button>
            </form>

            {message && <p className="meta">{message}</p>}
          </div>
        </div>
      </section>
    </main>
  )
}
