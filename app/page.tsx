'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Supplier = { id:string; name:string; name_ar:string|null; description:string|null; total_recommendations:number; confirmed_deals:number }
type Question = { id:string; title:string; created_at:string; recommendations_count:number; cities?:{name_ar:string}|null; categories?:{name_ar:string}|null }
type Category = { id:number; name_ar:string }

const categoryIcons = ['⚙','⚡','🛡','▣','▤','◆']

export default function HomePage() {
  const router = useRouter()
  const [query,setQuery]=useState('')
  const [city,setCity]=useState('')
  const [loading,setLoading]=useState(false)
  const [searched,setSearched]=useState(false)
  const [suppliers,setSuppliers]=useState<Supplier[]>([])
  const [questions,setQuestions]=useState<Question[]>([])
  const [categories,setCategories]=useState<Category[]>([])
  const [stats,setStats]=useState({suppliers:0,questions:0,recommendations:0,members:0})

  useEffect(()=>{ (async()=>{
    const [q,c,sup,qs,recs,profiles]=await Promise.all([
      supabase.from('questions').select('id,title,created_at,recommendations_count,cities(name_ar),categories(name_ar)').neq('status','hidden').order('created_at',{ascending:false}).limit(4),
      supabase.from('categories').select('id,name_ar').eq('is_active',true).limit(6),
      supabase.from('suppliers').select('*',{count:'exact',head:true}).eq('is_active',true),
      supabase.from('questions').select('*',{count:'exact',head:true}).neq('status','hidden'),
      supabase.from('recommendations').select('*',{count:'exact',head:true}).eq('status','active'),
      supabase.from('profiles').select('*',{count:'exact',head:true}).eq('is_active',true)
    ])
    setQuestions((q.data??[]) as unknown as Question[]); setCategories((c.data??[]) as Category[])
    setStats({suppliers:sup.count??0,questions:qs.count??0,recommendations:recs.count??0,members:profiles.count??0})
  })() },[])

  async function handleSearch(e:FormEvent){ e.preventDefault(); if(!query.trim())return; setLoading(true);setSearched(true)
    const {data}=await supabase.rpc('search_suppliers',{search_text:query.trim()}); setSuppliers((data??[]) as Supplier[]);setLoading(false)
  }
  function ask(){ const p=new URLSearchParams(); if(query.trim())p.set('q',query.trim()); if(city)p.set('city',city); router.push(`/ask?${p}`) }

  return <main className="siteShell">
    <header className="topbar"><div className="wide navNew">
      <a href="/" className="logo"><span className="logoMark">M</span><span><b>MNYRD</b><small>مَن يورّد؟</small></span></a>
      <nav className="navLinks"><a className="active" href="/">الرئيسية</a><a href="#suppliers">الموردون</a><a href="#categories">التصنيفات</a><a href="#how">كيفية العمل</a><a href="#about">عن المنصة</a></nav>
      <div className="navBtns"><a className="iconBtn" href="/login">MN</a><a className="primarySmall" href="/ask">اسأل المجتمع</a></div>
    </div></header>

    <section className="heroNew"><div className="citySilhouette"/><div className="heroRings"/><div className="wide heroInner">
      <span className="eyebrow">PROCUREMENT COMMUNITY · SAUDI ARABIA</span>
      <h1>مجتمع المشتريات الأول<br/><em>في السعودية</em></h1>
      <p>اطرح احتياجك أو ابحث عن موردين موثوقين بناءً على تجارب حقيقية من مجتمع المشتريات.</p>
      <form className="megaSearch" onSubmit={handleSearch}>
        <label className="searchField"><span>ماذا تبحث عنه؟</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="مثال: أنابيب حديد، أجهزة سلامة، خدمات لوجستية..."/></label>
        <label className="cityField"><span>المنطقة</span><select value={city} onChange={e=>setCity(e.target.value)}><option value="">اختر المنطقة</option><option>الجبيل</option><option>الدمام</option><option>الخبر</option><option>الرياض</option><option>جدة</option></select></label>
        <button className="searchBtn" disabled={loading}>{loading?'جاري البحث...':'بحث'}</button>
      </form>
      <div className="heroTrust"><span>♙ ترشيحات من مجتمع حقيقي</span><span>♢ تجارب موثوقة</span><span>● مجاناً بدون أي رسوم</span><span>▣ خصوصية تامة لبياناتك</span></div>
    </div></section>

    {searched && <section className="wide searchResults"><div className="sectionHead"><h2>نتائج البحث</h2><button onClick={ask}>ما لقيت؟ اسأل المجتمع ←</button></div>{suppliers.length?<div className="supplierGrid">{suppliers.map(s=><article className="supplierCard" key={s.id}><div className="supplierAvatar">{(s.name_ar||s.name).slice(0,2)}</div><div><h3>{s.name_ar||s.name}</h3><p>{s.description||'مورد مرشح من مجتمع MNYRD'}</p><div className="tags"><span>{s.total_recommendations} ترشيح</span><span>{s.confirmed_deals} تعامل مؤكد</span></div></div></article>)}</div>:<div className="emptyNew"><b>ما لقينا مورد مطابق حتى الآن.</b><button onClick={ask}>اسأل مجتمع المشتريات</button></div>}</section>}

    <section className="wide statsStrip"><div><strong>+{stats.suppliers.toLocaleString('ar-SA')}</strong><span>مورد موثوق</span></div><div><strong>+{stats.questions.toLocaleString('ar-SA')}</strong><span>طلب مورد</span></div><div><strong>+{stats.recommendations.toLocaleString('ar-SA')}</strong><span>ترشيح مورد</span></div><div><strong>+{stats.members.toLocaleString('ar-SA')}</strong><span>مستخدم نشط</span></div></section>

    <section className="wide contentGrid" id="how">
      <aside className="howCard"><h2>كيف تعمل المنصة؟</h2><div className="step"><i>1</i><div><b>اطرح احتياجك</b><p>اكتب ما تبحث عنه وحدد المنطقة والتفاصيل.</p></div></div><div className="step"><i>2</i><div><b>يشاركك المجتمع</b><p>يشارك الموردون والمشترون ترشيحات وتجارب موثوقة.</p></div></div><div className="step"><i>3</i><div><b>اختر الأفضل</b><p>تواصل مع المورد الأنسب بناءً على الترشيحات.</p></div></div></aside>
      <section className="panel" id="categories"><div className="panelTitle"><h2>تصفح التصنيفات</h2><a href="#">عرض الكل</a></div><div className="categoryGrid">{categories.map((c,i)=><div className="categoryTile" key={c.id}><i>{categoryIcons[i%categoryIcons.length]}</i><b>{c.name_ar}</b><span>استكشف الموردين ←</span></div>)}</div></section>
      <section className="panel"><div className="panelTitle"><h2>أحدث طلبات الموردين</h2><a href="/ask">اطرح طلبك</a></div><div className="requestList">{questions.map(q=><a href={`/q/${q.id}`} className="requestRow" key={q.id}><div><b>{q.title}</b><span>{q.cities?.name_ar||'السعودية'} · {q.categories?.name_ar||'عام'}</span></div><small>{q.recommendations_count} ترشيح</small></a>)}</div></section>
    </section>

    <section className="wide trustBanner" id="about"><h2>موثوق من قبل محترفي المشتريات في السعودية</h2><div><span>♙ مجتمع متخصص في المشتريات</span><span>⚖ منصة محايدة 100%</span><span>◉ لا نشارك بياناتك مع أي جهة</span><span>▣ منصة مستقلة ومحايدة</span></div></section>
    <footer className="footerNew"><div className="wide"><b>MNYRD · مَن يورّد؟</b><span>من المجتمع، للمجتمع.</span><small>© 2026 MNYRD — جميع الحقوق محفوظة</small></div></footer>
  </main>
}
