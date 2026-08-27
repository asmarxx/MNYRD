# MNYRD v0.2 | مَن يورّد؟

هذه النسخة تشمل:
- الصفحة الرئيسية والبحث
- تسجيل الدخول وإنشاء حساب
- إنشاء سؤال وحفظه في Supabase
- صفحة سؤال برابط فريد
- مشاركة السؤال في WhatsApp
- ترشيح مورد وربطه بالسؤال
- إنشاء Supplier تلقائيًا عند أول ترشيح

## تشغيل محلي
```bash
npm install
npm run dev
```
ثم افتح:
http://localhost:3000

## النشر على Vercel
ارفع المشروع على GitHub ثم Import Project داخل Vercel.
أضف Environment Variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

بعد حصولك على رابط Vercel، ضعه في Supabase:
Authentication > URL Configuration > Site URL
وأضف نفس الرابط ضمن Redirect URLs.

## ملاحظة
للاختبار الأولي يفضل تعطيل Confirm Email مؤقتًا في Supabase Authentication.
