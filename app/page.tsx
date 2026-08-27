'use client'

import { FormEvent, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Supplier = {
  id: string
  name: string
  name_ar: string | null
  name_en: string | null
  description: string | null
  total_recommendations: number
  confirmed_deals: number
  last_recommended_at: string | null
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('الشرقية')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [error, setError] = useState('')

  async function handleSearch(e: FormEvent) {
    e.preventDefault()
    const clean = query.trim()
    if (!clean) return

    setLoading(true)
    setSearched(true)
    setError('')

    const { data, error } = await supabase.rpc('search_suppliers', {
      search_text: clean
    })

    if (error) {
      setError('تعذر تنفيذ البحث الآن. تأكد من ربط Supabase وتشغيل السكربت.')
      setSuppliers([])
    } else {
      setSuppliers((data ?? []) as Supplier[])
    }

    setLoading(false)
  }

  function shareQuestion() {
    const text = `🔎 مطلوب مورد | Supplier Needed

أبحث عن مورد: ${query}
📍 المنطقة: ${city}

إذا عندك مورد مجرّب، شارك ترشيحك معي عبر MNYRD.`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <main className="shell">
      <header className="header">
        <div className="container nav">
          <div className="brand">
            <div className="brandMark">MN</div>
            <div className="brandText">
              <strong>MNYRD | مَن يورّد؟</strong>
              <span>مجتمع المشتريات للعثور على الموردين المجربين</span>
            </div>
          </div>

          <div className="navActions">
            <a className="btn btnGhost" href="/login">تسجيل الدخول</a>
            <a className="btn btnPrimary" href="/ask">اسأل المجتمع</a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <span className="kicker">Procurement Community • Saudi Arabia</span>
          <h1>تدور مورد؟ اسأل اللي جرّبه.</h1>
          <p>
            ابحث عن موردين رشحهم موظفو مشتريات، أو اطرح سؤالك وشاركه في قروبات
            واتساب بدل ما تضيع الإجابات بين مئات الرسائل.
          </p>

          <form className="searchCard" onSubmit={handleSearch}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="مثال: أبي أحد يوفر يونيفورم في الشرقية"
              aria-label="وش تدور؟"
            />

            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option>الشرقية</option>
              <option>الجبيل</option>
              <option>الدمام</option>
              <option>الخبر</option>
              <option>الرياض</option>
              <option>جدة</option>
            </select>

            <button className="btn btnAccent" type="submit" disabled={loading}>
              {loading ? 'جاري البحث...' : 'ابحث'}
            </button>
          </form>

          <div className="trustRow">
            <div className="trustItem"><span className="dot" /> ترشيحات من مجتمع المشتريات</div>
            <div className="trustItem"><span className="dot" /> المورد لا يشتري ترتيبه العضوي</div>
            <div className="trustItem"><span className="dot" /> مصمم للمشاركة عبر واتساب</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionTitle">
            <div>
              <h2>{searched ? 'نتائج البحث' : 'كيف تعمل MNYRD؟'}</h2>
              <p>
                {searched
                  ? `نتائج مرتبطة ببحثك: ${query}`
                  : 'ابحث أولًا، وإذا ما لقيت المورد المناسب اسأل المجتمع مباشرة.'}
              </p>
            </div>
          </div>

          {error && <div className="card">{error}</div>}

          {searched && !loading && suppliers.length > 0 && (
            <div className="results">
              {suppliers.map((supplier) => (
                <article className="card" key={supplier.id}>
                  <div className="cardTop">
                    <div>
                      <h3>{supplier.name_ar || supplier.name || supplier.name_en}</h3>
                      <div className="meta">
                        {supplier.description || 'مورد مضاف من مجتمع MNYRD'}
                      </div>

                      <div className="chips">
                        <span className="chip">👍 {supplier.total_recommendations} ترشيح</span>
                        <span className="chip">✓ {supplier.confirmed_deals} تعامل مؤكد</span>
                        {supplier.last_recommended_at && (
                          <span className="chip">
                            آخر ترشيح: {new Date(supplier.last_recommended_at).toLocaleDateString('ar-SA')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="score">
                      {supplier.confirmed_deals > 0 ? 'مجرّب ✓' : 'مرشّح'}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {searched && !loading && suppliers.length === 0 && !error && (
            <div className="card empty">
              <h3>ما لقينا مورد مطابق حتى الآن.</h3>
              <p>
                هذا بالضبط الوقت اللي نستخدم فيه المجتمع. شارك سؤالك في قروب
                المشتريات، وخلي الترشيحات تنحفظ بدل ما تضيع في المحادثة.
              </p>
              <button className="btn btnAccent" onClick={shareQuestion}>
                شارك السؤال في واتساب
              </button>
            </div>
          )}

          {!searched && (
            <div className="results">
              <div className="card">
                <h3>1. اكتب احتياجك بطريقتك</h3>
                <div className="meta">مثال: أبي أحد يوفر يونيفورم في الشرقية.</div>
              </div>
              <div className="card">
                <h3>2. ابحث في التجارب السابقة</h3>
                <div className="meta">نشوف الموردين اللي سبق رشحهم أعضاء المجتمع.</div>
              </div>
              <div className="card">
                <h3>3. ما لقيت؟ اسأل المجتمع</h3>
                <div className="meta">شارك السؤال على واتساب وخزّن الإجابات للمرة الجاية.</div>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          MNYRD — مَن يورّد؟ • نسخة MVP أولية
        </div>
      </footer>
    </main>
  )
}
