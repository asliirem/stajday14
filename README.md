# Logo Entegrasyon Servisi (Demo)

Bu proje, staj günlüğünde (14. gün) anlatılan **KodexB2B - Logo ERP
entegrasyonu ve veri eşleştirme (mapping)** sürecinin basit bir örneğidir.
KodexB2B üzerinden oluşturulan bir siparişteki cari ve ürün kodlarının,
Logo ERP'deki karşılıklarıyla nasıl eşleştirildiğini ve eşleştirilen
verinin nasıl aktarıldığını gösterir.

Gerçek bir Logo ERP bağlantısı içermez; `mockLogoEndpoint` fonksiyonu
gerçek API'nin davranışını taklit eder. Amaç, staj sürecinde öğrenilen
mapping mantığını göstermektir.

## Neden Mapping Gerekli?

İki farklı sistem aynı bilgiyi farklı kodlarla tutabilir. Örneğin
KodexB2B'deki bir cari kodu (`CR-001`), Logo ERP'de tamamen farklı bir
cari kodu (`120.01.001`) ile karşılık bulabilir. Aynı durum ürün kodları
için de geçerlidir. Bu eşleştirme doğru yapılmazsa sipariş **yanlış
müşteriye veya yanlış ürüne** aktarılabilir; bu yüzden entegrasyon
öncesinde mapping kontrolü kritik önem taşır.

## Süreç

1. **Mapping** (`mappingRepository.js`): KodexB2B kodları ile Logo ERP
   kodları arasındaki eşleştirme tablosu tutulur.
2. **Eşleştirme kontrolü** (`logoIntegrationService.js`): Siparişteki
   cari kodu ve her ürün satırı, mapping tablosunda karşılığı var mı diye
   kontrol edilir. Eşleşme bulunamayan bir alan varsa sipariş **hiç
   gönderilmez**, hata olarak döner.
3. **Gönderim**: Tüm alanlar eşleştiyse, Logo ERP'nin beklediği JSON
   formatında (`cariKodu`, `kalemler` vb.) bir payload hazırlanıp REST
   API üzerinden gönderilir.

## Dosya Yapısı

```
logo-entegrasyon-servisi/
├── mappingRepository.js        # KodexB2B <-> Logo ERP kod eşleştirme tablosu
├── logoIntegrationService.js    # Mapping kontrolü + Logo ERP'ye gönderim
├── index.js                       # Örnek senaryolarla demo çalıştırıcı
└── README.md
```

## Nasıl Çalıştırılır

Node.js (v14+) yüklü olması yeterlidir, ek bir paket gerekmez.

```bash
node index.js
```

Çalıştırıldığında üç örnek sipariş üzerinden şu senaryolar gösterilir:

- Cari ve ürün eşleştirmesi tam olan sipariş → başarıyla Logo ERP'ye
  aktarılır, bir Logo fiş numarası döner
- Cari kodu mapping tablosunda bulunamayan sipariş → gönderim
  yapılmadan hata döner
- Ürün kodu mapping tablosunda bulunamayan sipariş → gönderim
  yapılmadan hata döner

## Not

Bu, gerçek bir üretim entegrasyonu değil, eğitim/staj amaçlı hazırlanmış
bir demo çalışmasıdır. Bu servis, önceki günlerde hazırlanan
`siparis-olusturma-servisi` ve `erp-veri-gonderme-servisi` projeleriyle
birlikte, KodexB2B'de oluşturulan bir siparişin baştan sona ERP'ye
aktarılma sürecinin mapping adımını temsil eder.
