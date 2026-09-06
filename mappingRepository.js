/**
 * mappingRepository.js
 *
 * KodexB2B ile Logo ERP arasındaki alan eşleştirme (mapping) tablosunu
 * tutar. İki sistem aynı müşteri veya ürünü farklı kodlarla tuttuğu
 * için, entegrasyon sırasında bu kodların birbirine çevrilmesi gerekir.
 *
 * Gerçek sistemde bu eşleştirme genelde ayrı bir "mapping" tablosunda
 * veritabanında tutulur, örn:
 *
 *   SELECT logo_cari_kodu FROM entegrasyon_eslesme
 *   WHERE kaynak_sistem = 'KodexB2B' AND kaynak_kodu = @customerCode;
 */

// KodexB2B cari kodu -> Logo ERP cari kodu
const customerMap = {
  "CR-001": "120.01.001",
  "CR-002": "120.01.002",
  "CR-003": "120.01.003",
  // CR-004 kasıtlı olarak eşleştirilmemiştir (eşleşme bulunamadı senaryosu için)
};

// KodexB2B ürün kodu -> Logo ERP stok kodu
const productMap = {
  "URN-1024": "150.01.0001",
  "URN-2031": "150.01.0002",
  // URN-3050 kasıtlı olarak eşleştirilmemiştir (eşleşme bulunamadı senaryosu için)
};

function mapCustomerCode(kodexCustomerCode) {
  return customerMap[kodexCustomerCode] || null;
}

function mapProductCode(kodexProductCode) {
  return productMap[kodexProductCode] || null;
}

module.exports = { mapCustomerCode, mapProductCode };
