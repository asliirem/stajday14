/**
 * index.js
 *
 * KodexB2B siparişlerinin Logo ERP'ye eşleştirilerek (mapping) nasıl
 * aktarıldığını gösteren demo çalıştırıcı.
 *
 * Çalıştırmak için: node index.js
 */

const { sendOrderToLogo } = require("./logoIntegrationService");

const orders = [
  // 1) Cari ve ürün eşleştirmesi tam -> başarılı aktarım
  {
    orderNo: "SP-10241",
    customerCode: "CR-001",
    items: [
      { productCode: "URN-1024", quantity: 10, unitPrice: 145.5 },
      { productCode: "URN-2031", quantity: 3, unitPrice: 320 },
    ],
  },
  // 2) Cari eşleştirmesi bulunamıyor (CR-004 mapping tablosunda yok)
  {
    orderNo: "SP-10242",
    customerCode: "CR-004",
    items: [{ productCode: "URN-1024", quantity: 5, unitPrice: 145.5 }],
  },
  // 3) Ürün eşleştirmesi bulunamıyor (URN-3050 mapping tablosunda yok)
  {
    orderNo: "SP-10243",
    customerCode: "CR-002",
    items: [{ productCode: "URN-3050", quantity: 2, unitPrice: 78 }],
  },
];

async function run() {
  for (const order of orders) {
    const result = await sendOrderToLogo(order);
    console.log(`\nSipariş: ${order.orderNo} (Cari: ${order.customerCode})`);
    if (result.success) {
      console.log(`  Durum: BAŞARILI (${result.stage})`);
      console.log(`  Logo Fiş No: ${result.logoFisNo}`);
      console.log(`  Eşleştirilmiş Cari Kodu: ${result.payload.cariKodu}`);
    } else {
      console.log(`  Durum: HATA (${result.stage})`);
      result.errors.forEach((e) => console.log(`   - ${e}`));
    }
  }
}

run();
