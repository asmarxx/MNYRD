'use client'

import { FormEvent, Suspense, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

type City = { id:number; name_ar:string; region_ar:string | null }
type Category = { id:number; name_ar:string }

function AskPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [userId, setUserId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [cityId, setCityId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [cities, setCities] = useState<City[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const q = searchParams.get('q') || ''
      const requestedCity = searchParams.get('city') || ''
      setTitle(q)
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) {
        const next = `/ask?${searchParams.toString()}`
        router.replace(`/login?next=${encodeURIComponent(next)}`)
        return
      }
      setUserId(auth.user.id)

      const [{data: cityData}, {data: categoryData}] = await Promise.all([
        supabase.from('cities').select('id,name_ar,region_ar').eq('is_active', true).order('name_ar'),
        supabase.from('categories').select('id,name_ar').eq('is_active', true).order('name_ar')
      ])
      const cityRows = (cityData ?? []) as City[]
      setCities(cityRows)
      setCategories((categoryData ?? []) as Category[])

      if (requestedCity) {
        const exact = cityRows.find(c => c.name_ar === requestedCity)
        if (exact) setCityId(String(exact.id))
      }
    }
    load()
  }, [router, searchParams])

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!userId || !title.trim()) return
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase
      .from('questions')
      .insert({
        user_id: userId,
        title: title.trim(),
        description: description.trim() || null,
        city_id: cityId ? Number(cityId) : null,
        category_id: categoryId ? Number(categoryId) : null
      })
      .select('id')
      .single()

    if (error) {
      setMessage(error.message)
    } else if (data?.id) {
      router.push(`/q/${data.id}`)
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
              <span>اسأل مجتمع المشتريات</span>
            </div>
          </a>
        </div>
      </header>

      <section className="section">
        <div className="container" style={{maxWidth:760}}>
          <div className="card">
            <h2 style={{marginTop:0, color:'var(--navy)'}}>وش تدور؟</h2>
            <p className="meta">اكتب السؤال بنفس الطريقة اللي تكتبه فيها في قروب الواتساب.</p>

            <form onSubmit={submit} style={{display:'grid', gap:12, marginTop:18}}>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="مثال: أبي أحد يوفر يونيفورم في الشرقية"
                required
              />

              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="تفاصيل إضافية (اختياري)"
                rows={5}
              />

              <select value={cityId} onChange={e => setCityId(e.target.value)}>
                <option value="">اختر المدينة (اختياري)</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
              </select>

              <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                <option value="">اختر التصنيف (اختياري)</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
              </select>

              <button className="btn btnAccent" disabled={loading}>
                {loading ? 'جاري إنشاء السؤال...' : 'إنشاء السؤال'}
              </button>
            </form>

            {message && <p className="meta">{message}</p>}
          </div>
        </div>
      </section>
    </main>
  )
}

export default function AskPage() {
  return (
    <Suspense fallback={<main className="shell"><div className="container section">جاري التحميل...</div></main>}>
      <AskPageContent />
    </Suspense>
  )
}
