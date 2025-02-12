document.addEventListener('DOMContentLoaded', async () => {
  try {
    // API'den dashboard verilerini çekiyoruz (veritabanı /api/dashboard'de yönetiliyor)
    const response = await fetch(`${API_URL}/dashboard`);
    const data = await response.json();

    // Düşük stok ürünleri listesi
    const lowStockList = document.getElementById('low-stock-list');
    lowStockList.innerHTML = '';
    if (data.lowStock && data.lowStock.length) {
      data.lowStock.forEach(product => {
        lowStockList.innerHTML += `<li class="list-group-item">${product.name} - ${product.stock} Adet</li>`;
      });
    } else {
      lowStockList.innerHTML = '<li class="list-group-item">Veri bulunamadı</li>';
    }

    // Sipariş özetleri
    document.getElementById('today-orders').textContent = `${data.orders.today} Sipariş`;
    document.getElementById('tomorrow-orders').textContent = `${data.orders.tomorrow} Sipariş`;
    document.getElementById('future-orders').textContent = `${data.orders.future} Sipariş`;

    // Teslimat özetleri
    document.getElementById('total-orders').textContent = `${data.deliveries.total} Sipariş`;
    document.getElementById('delivered-orders').textContent = `${data.deliveries.delivered} Teslimat`;
    document.getElementById('pending-deliveries').textContent = `${data.deliveries.pending} Kalan`;
  } catch (error) {
    console.error('Dashboard verileri yüklenemedi:', error);
  }
});
