-- MNYRD v0.4 - Official supplier seed layer
-- Sources verified 2026-08-28 from official brand/dealer directories.
-- Run AFTER the original MVP database script.

alter table public.suppliers add column if not exists brand text;
alter table public.suppliers add column if not exists parent_company text;
alter table public.suppliers add column if not exists branch_name text;
alter table public.suppliers add column if not exists verification_type text default 'community';
alter table public.suppliers add column if not exists data_source text;
alter table public.suppliers add column if not exists source_url text;
alter table public.suppliers add column if not exists last_verified_at timestamptz;
alter table public.suppliers add column if not exists data_status text default 'verified';

create index if not exists idx_suppliers_brand on public.suppliers(brand);
create index if not exists idx_suppliers_verification on public.suppliers(verification_type);

-- Helper: inserts official branch only if the same brand + branch is not already present.
create or replace function public.seed_official_supplier(
  p_name text, p_name_ar text, p_name_en text, p_brand text, p_parent text,
  p_branch text, p_city text, p_phone text, p_address text, p_source text,
  p_url text, p_type text default 'Authorized Dealer'
) returns void language plpgsql security definer set search_path=public as $$
declare v_city bigint;
begin
  select id into v_city from public.cities where name_ar=p_city limit 1;
  if v_city is null then return; end if;
  if not exists(select 1 from public.suppliers where brand=p_brand and branch_name=p_branch and city_id=v_city) then
    insert into public.suppliers(name,name_ar,name_en,brand,parent_company,branch_name,city_id,phone,address,
      supplier_type,is_verified,is_active,verification_type,data_source,source_url,last_verified_at,data_status)
    values(p_name,p_name_ar,p_name_en,p_brand,p_parent,p_branch,v_city,p_phone,p_address,
      'distributor',true,true,p_type,p_source,p_url,'2026-08-28 00:00:00+03','verified');
  end if;
end $$;

-- Toyota / Abdul Latif Jameel Motors - official Toyota Saudi center locator
select public.seed_official_supplier('Toyota - Jubail Center','تويوتا - مركز الجبيل','Toyota - Jubail Center','Toyota','Abdul Latif Jameel Motors','Jubail Center','الجبيل','0133425050','طريق أبو علي، حي الواحة','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Jubail 3 Center','تويوتا - مركز الجبيل 3','Toyota - Jubail 3 Center','Toyota','Abdul Latif Jameel Motors','Jubail 3 Center','الجبيل','0133425010','المنطقة الصناعية المساندة الأولى، طريق 118','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Dammam Center','تويوتا - مركز الدمام','Toyota - Dammam Center','Toyota','Abdul Latif Jameel Motors','Dammam-1 Center','الدمام','0138047811','شارع الملك سعود، حي الجلوية','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Khobar Center','تويوتا - مركز الخبر','Toyota - Khobar Center','Toyota','Abdul Latif Jameel Motors','Khobar-1 Center','الخبر','0138219888','طريق الملك سعود، العليا','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Qatif Center','تويوتا - مركز القطيف','Toyota - Qatif Center','Toyota','Abdul Latif Jameel Motors','Qatif Center','القطيف','0136633760','شارع القدس، منطقة المستودعات','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Hofuf Al Miterfi','تويوتا - مركز الهفوف المطيرفي','Toyota - Hofuf Al Miterfi','Toyota','Abdul Latif Jameel Motors','Hofuf Al Miterfi Center','الأحساء','0135938111','طريق الظهران، المطيرفي','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Hafr Al Batin','تويوتا - مركز حفر الباطن','Toyota - Hafr Al Batin','Toyota','Abdul Latif Jameel Motors','Hafr Al Batin Center','حفر الباطن','0137299111','شارع الملك خالد، حي البلدية','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Riyadh Khurais','تويوتا - مركز خريص','Toyota - Riyadh Khurais','Toyota','Abdul Latif Jameel Motors','Khurais Center','الرياض','0112546299','طريق خريص، حي الربوة','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Riyadh Olaya','تويوتا - مركز العليا','Toyota - Riyadh Olaya','Toyota','Abdul Latif Jameel Motors','Olaya Center','الرياض','0112546444','شارع العليا','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Riyadh Qurtuba','تويوتا - صالة قرطبة','Toyota - Riyadh Qurtuba','Toyota','Abdul Latif Jameel Motors','Qurtuba Showroom','الرياض','0112546105','طريق سعيد ابن زيد، حي قرطبة','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Jeddah Madinah Road','تويوتا - مركز طريق المدينة','Toyota - Jeddah Madinah Road','Toyota','Abdul Latif Jameel Motors','Madinah Rd. Center','جدة','0126887800','طريق المدينة المنورة، الفيصلية','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Jeddah Prince Sultan','تويوتا - مركز طريق الأمير سلطان','Toyota - Jeddah Prince Sultan','Toyota','Abdul Latif Jameel Motors','Prince Sultan Center','جدة','0126889599','شارع الأمير سلطان، حي السلامة','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Jeddah Tahlia','تويوتا - مركز التحلية','Toyota - Jeddah Tahlia','Toyota','Abdul Latif Jameel Motors','Tahlia Center','جدة','0126097696','طريق الأمير محمد بن عبدالعزيز، حي الرحاب','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Makkah Kakkia','تويوتا - مركز مكة الكعكية','Toyota - Makkah Kakkia','Toyota','Abdul Latif Jameel Motors','Makkah Al Kakkia Center','مكة المكرمة','0125508333','طريق الليث، حي ولي العهد','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Madinah Center','تويوتا - مركز المدينة المنورة','Toyota - Madinah Center','Toyota','Abdul Latif Jameel Motors','Madinah Al Munawara Center','المدينة المنورة','0148218373','محمد بن صقر بن حسين، وعيرة','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Yanbu','تويوتا - ينبع','Toyota - Yanbu','Toyota','Abdul Latif Jameel Motors','Yanbu Center','ينبع',null,null,'Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Taif','تويوتا - مركز الطائف','Toyota - Taif','Toyota','Abdul Latif Jameel Motors','Taif Center','الطائف','0127386555','طريق وادي وج، حي السلامة','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Buraidah','تويوتا - مركز بريدة','Toyota - Buraidah','Toyota','Abdul Latif Jameel Motors','Buraidah 2 Center','بريدة','0163696822','طريق الملك عبدالعزيز، سلطانة','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Tabuk','تويوتا - مركز تبوك','Toyota - Tabuk','Toyota','Abdul Latif Jameel Motors','Tabuk Center','تبوك','0144258055','طريق الملك خالد، الفيصلية','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Arar','تويوتا - مركز عرعر','Toyota - Arar','Toyota','Abdul Latif Jameel Motors','Arar Center','عرعر','0146647811','صلاح الدين الأيوبي، حي مشرف','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Al Baha','تويوتا - مركز الباحة','Toyota - Al Baha','Toyota','Abdul Latif Jameel Motors','Al Baha Center','الباحة','0177277720','طريق الملك عبدالعزيز','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');
select public.seed_official_supplier('Toyota - Al Jouf','تويوتا - مركز الجوف','Toyota - Al Jouf','Toyota','Abdul Latif Jameel Motors','Jouf Center','سكاكا','0146232233','طريق الملك سعود، حي الشفاء','Toyota Saudi Arabia - official center locator','https://www.toyota.com.sa/ar/find-a-center');

-- ABB authorized distributor network. Company/city level only; no personal employee contacts are stored.
-- Official ABB directory confirms authorized distribution across the listed Saudi cities.
select public.seed_official_supplier('Al-Manara - Riyadh','المنارة - الرياض','Al-Manara - Riyadh','ABB','Al-Manara','Riyadh','الرياض',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('Al-Manara - Dammam','المنارة - الدمام','Al-Manara - Dammam','ABB','Al-Manara','Dammam','الدمام',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('Al-Manara - Jeddah','المنارة - جدة','Al-Manara - Jeddah','ABB','Al-Manara','Jeddah','جدة',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('Al-Manara - Madinah','المنارة - المدينة','Al-Manara - Madinah','ABB','Al-Manara','Madinah','المدينة المنورة',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('Al-Manara - Tabuk','المنارة - تبوك','Al-Manara - Tabuk','ABB','Al-Manara','Tabuk','تبوك',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('Al-Manara - Jizan','المنارة - جازان','Al-Manara - Jizan','ABB','Al-Manara','Jizan','جازان',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('Al-Manara - Taif','المنارة - الطائف','Al-Manara - Taif','ABB','Al-Manara','Taif','الطائف',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('Al-Manara - Hail','المنارة - حائل','Al-Manara - Hail','ABB','Al-Manara','Hail','حائل',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('Al-Manara - Makkah','المنارة - مكة','Al-Manara - Makkah','ABB','Al-Manara','Makkah','مكة المكرمة',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('Al-Manara - Najran','المنارة - نجران','Al-Manara - Najran','ABB','Al-Manara','Najran','نجران',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('SESCO - Riyadh','سيسكو - الرياض','SESCO - Riyadh','ABB','Saudi Electric Supply Co. (SESCO)','Riyadh','الرياض',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('SESCO - Dammam','سيسكو - الدمام','SESCO - Dammam','ABB','Saudi Electric Supply Co. (SESCO)','Dammam','الدمام',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('SESCO - Jeddah','سيسكو - جدة','SESCO - Jeddah','ABB','Saudi Electric Supply Co. (SESCO)','Jeddah','جدة',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('Al Suhaili - Riyadh','السحيلي - الرياض','Al Suhaili - Riyadh','ABB','Al Suhaili Trading & Development Co.','Riyadh','الرياض',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('Al Suhaili - Dammam','السحيلي - الدمام','Al Suhaili - Dammam','ABB','Al Suhaili Trading & Development Co.','Dammam','الدمام',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('Al Suhaili - Khobar','السحيلي - الخبر','Al Suhaili - Khobar','ABB','Al Suhaili Trading & Development Co.','Khobar','الخبر',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('Al Suhaili - Jeddah','السحيلي - جدة','Al Suhaili - Jeddah','ABB','Al Suhaili Trading & Development Co.','Jeddah','جدة',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('Al Suhaili - Abha','السحيلي - أبها','Al Suhaili - Abha','ABB','Al Suhaili Trading & Development Co.','Abha','أبها',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');
select public.seed_official_supplier('Al Suhaili - Madinah','السحيلي - المدينة','Al Suhaili - Madinah','ABB','Al Suhaili Trading & Development Co.','Madinah','المدينة المنورة',null,null,'ABB Saudi Arabia authorized distributors','https://shop.sa.abb.com/distributors','Authorized Distributor');

-- Schneider Electric: seed brand/company records only; partner records will be added from official locator as verified batches.
select public.seed_official_supplier('Schneider Electric - Riyadh','شنايدر إلكتريك - الرياض','Schneider Electric - Riyadh','Schneider Electric','Schneider Electric Saudi Arabia','Saudi HQ','الرياض','0114598000',null,'Schneider Electric Saudi Arabia official partner/office locator','https://www.se.com/sa/ar/work/support/locator/map/','Official');
select public.seed_official_supplier('Schneider Electric - Dammam','شنايدر إلكتريك - الدمام','Schneider Electric - Dammam','Schneider Electric','Schneider Electric Saudi Arabia','Dammam','الدمام','0138135756',null,'Schneider Electric Saudi Arabia official partner/office locator','https://www.se.com/sa/ar/work/support/locator/map/','Official');

-- Mark old official records for re-verification after 180 days (admin can query this view).
create or replace view public.suppliers_needing_reverification as
select * from public.suppliers
where verification_type <> 'community'
  and (last_verified_at is null or last_verified_at < now() - interval '180 days');

select count(*) as official_seed_records from public.suppliers where verification_type <> 'community';
