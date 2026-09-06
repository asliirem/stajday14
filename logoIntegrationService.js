/**
 * logoIntegrationService.js
 *
 * KodexB2B'de oluşturulan bir siparişi Logo ERP'nin beklediği formata
 * dönüştüren entegrasyon servisi. İki temel adımdan oluşur:
 *
 *  1) Mapping: KodexB2B'deki cari ve ürün kodları, Logo ERP'deki
 *     karşılıklarıyla eşleştirilir. Eşleşme bulunamazsa sipariş
 *     gönderilmez — çünkü yanlış müşteriye veya yanlış ürüne kayıt
 *     düşme riski vardır.
 *  2) Gönderim: Eşleşen veriler Logo ERP'nin beklediği JSON yapısına
 *     çevrilip REST API üzerinden gönderilir.
 */

const { mapCustomerCode, mapProductCode } = require("./mappingRepository");

// Gerçek sistemde bu API'nin gerçek adresi ve kimlik doğrulama
// bilgileri (.env üzerinden) kullanılır.
const LOGO_API = {
  baseUrl: "https://logo-erp.ornek-firma.local/api/siparis",
};

function mockLogoEndpoint(payload) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        logoFisNo: `LGO-${Date.now()}`,
        receivedAt: new Date().toISOString(),
      });
    }, 150);
  });
}

/**
 * KodexB2B siparişini alır, mapping yapar ve Logo ERP'ye aktarılacak
 * hale getirip gönderir.
 *
 * order: {
 *   orderNo, customerCode,
 *   items: [{ productCode, quantity, unitPrice }]
 * }
 */
async function sendOrderToLogo(order) {
  const errors = [];

  // 1) Cari eşleştirmesi
  const logoCariKodu = mapCustomerCode(order.customerCode);
  if (!logoCariKodu) {
    errors.push(
      `Cari eşleştirmesi bulunamadı: KodexB2B kodu "${order.customerCode}" için Logo ERP karşılığı tanımlı değil.`
    );
  }

  // 2) Ürün eşleştirmesi (her satır için)
  const mappedItems = [];
  order.items.forEach((item, index) => {
    const logoStokKodu = mapProductCode(item.productCode);
    if (!logoStokKodu) {
      errors.push(
        `Satır ${index + 1}: ürün eşleştirmesi bulunamadı (KodexB2B kodu: ${item.productCode}).`
      );
      return;
    }
    mappedItems.push({
      logoStokKodu,
      miktar: item.quantity,
      birimFiyat: item.unitPrice,
    });
  });

  // Eşleştirme eksikse veri gönderilmez.
  if (errors.length > 0) {
    return { success: false, stage: "mapping", errors };
  }

  // 3) Logo ERP'nin beklediği formatta payload oluşturulur
  const payload = {
    kaynakSistem: "KodexB2B",
    kaynakSiparisNo: order.orderNo,
    cariKodu: logoCariKodu,
    kalemler: mappedItems,
    olusturmaTarihi: order.createdAt || new Date().toISOString(),
  };

  try {
    const response = await mockLogoEndpoint(payload);
    // Gerçek entegrasyonda burada fetch(LOGO_API.baseUrl, {...}) kullanılır.
    return {
      success: true,
      stage: "logo",
      logoFisNo: response.logoFisNo,
      receivedAt: response.receivedAt,
      payload,
    };
  } catch (err) {
    return {
      success: false,
      stage: "logo",
      errors: [err.message || "Logo ERP'ye gönderim sırasında bilinmeyen hata."],
    };
  }
}

module.exports = { sendOrderToLogo };
