# Production Runbook

Checklist dua Tiembac tu local/staging len production.

## 1. Moi truong nen co

- `local`: phat trien tren may.
- `staging`: Supabase rieng de test checkout, COD, VNPay sandbox, admin orders.
- `production`: Supabase rieng, VNPay production, domain that.

Khong dung chung database staging va production.

## 2. Tao Supabase staging

1. Vao Supabase Dashboard va tao project moi, vi du `tiembac-staging`.
2. Chon region gan khach hang, uu tien Singapore neu ban chu yeu o Viet Nam.
3. Lay cac gia tri trong Settings/API:
   - Project URL
   - Publishable/anon public key
   - Service role/secret server key
4. Cap nhat `.env.local` local/staging:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

NEXT_PUBLIC_SITE_URL=http://localhost:3000

VNPAY_TMN_CODE=...
VNPAY_HASH_SECRET=...
VNPAY_PAYMENT_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/api/payment/vnpay/return
```

`SUPABASE_SERVICE_ROLE_KEY` chi duoc de server-side env. Khong dua key nay vao client hoac commit len git.

## 3. Tao schema va seed staging

Trong Supabase SQL Editor, chay:

```txt
supabase/schema.sql
```

Neu can du lieu mau de test:

```txt
supabase/seed.sql
```

Neu muon reset sach staging:

```txt
supabase/reset-and-seed.sql
```

Khong chay `reset-and-seed.sql` tren production.

## 4. Test staging

Restart app sau khi doi env:

```bash
npm run dev
```

### COD

1. Them san pham vao gio.
2. Checkout chon `Thanh toan khi nhan hang`.
3. Dat hang.
4. Vao `/admin/orders`.
5. Don moi nen co:
   - Phuong thuc: `COD`
   - Trang thai: `Cho xac nhan`
   - Thanh toan: `Cho thanh toan`
   - Giao hang: `Chua xu ly`

Test action admin:

```txt
Xac nhan COD -> Dong goi -> Ban giao van chuyen -> Hoan tat COD
```

Ket qua cuoi:

```txt
Hoan tat + Da thanh toan + Da giao
```

Test huy don COD:

```txt
Huy don -> Da huy + Thanh toan loi
```

### VNPay sandbox

1. Dam bao env sandbox co `VNPAY_TMN_CODE` va `VNPAY_HASH_SECRET`.
2. Checkout chon `VNPay / online`.
3. Dat hang.
4. App redirect sang VNPay sandbox.
5. Thanh toan bang the test sandbox.
6. VNPay redirect ve `/api/payment/vnpay/return`.
7. App redirect ve `/order-success`.

Trong admin, don thanh cong nen co:

```txt
VNPay + Da thanh toan + Da xac nhan
```

Localhost chi test duoc return URL. IPN can public URL.

### Test IPN bang public URL

Neu can test IPN truoc production, dung ngrok hoac URL staging public:

```bash
ngrok http 3000
```

Cap nhat env:

```env
NEXT_PUBLIC_SITE_URL=https://your-public-url
VNPAY_RETURN_URL=https://your-public-url/api/payment/vnpay/return
```

Trong portal/sandbox VNPay, cau hinh IPN URL:

```txt
https://your-public-url/api/payment/vnpay/ipn
```

## 5. Len production

1. Tao Supabase project moi, vi du `tiembac-production`.
2. Chay `supabase/schema.sql`.
3. Import hoac tao du lieu that: san pham, categories, collections, inventory.
4. Khong seed du lieu mock neu production da co catalog that.
5. Cau hinh env tren hosting production:

```env
NEXT_PUBLIC_SUPABASE_URL=https://production-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=production_public_key
SUPABASE_SERVICE_ROLE_KEY=production_secret_key

NEXT_PUBLIC_SITE_URL=https://your-domain.com

VNPAY_TMN_CODE=production_tmn_code
VNPAY_HASH_SECRET=production_hash_secret
VNPAY_PAYMENT_URL=https://pay.vnpay.vn/vpcpay.html
VNPAY_RETURN_URL=https://your-domain.com/api/payment/vnpay/return
```

6. Trong VNPay production portal, cau hinh IPN URL:

```txt
https://your-domain.com/api/payment/vnpay/ipn
```

7. Deploy va test mot don nho.

## 6. Checklist truoc khi mo ban that

- `npm run lint` khong co error.
- `npm run build` pass.
- San pham production dung UUID Supabase, khong dung mock id nhu `moonlight`.
- Checkout COD tao duoc order trong Supabase.
- Checkout VNPay success cap nhat `payment_status = paid`.
- Admin `/admin/orders` loc duoc theo payment method, order status, payment status, fulfillment status.
- Admin co the chay workflow COD den `Hoan tat COD`.
- Admin co the huy don test.
- VNPay IPN public URL hoat dong.
- Khong commit `.env.local`.
- Khong public service role key.

## 7. Viec can hoan thien truoc production nghiem tuc

- Release ton kho khi huy don.
- Chuyen reserved stock sang sold khi don hoan tat.
- Doi soat VNPay IPN tren public URL, khong chi dua vao return URL.
- Backup database production truoc moi migration lon.
- Tao migration rieng thay vi chay reset SQL tren production.
