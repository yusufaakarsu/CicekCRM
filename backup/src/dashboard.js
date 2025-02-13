document.addEventListener('DOMContentLoaded', async () => {
  await loadDashboard();
});

async function loadDashboard() {
  try {
    // Düşük stok ürünleri için API çağrısı
    const lowStockResponse = await fetch(`${API_URL}/products/low-stock`);
    const lowStockData = await lowStockResponse.json();
    const lowStockList = document.getElementById('low-stock-list');
    lowStockList.innerHTML = '';
    if (lowStockData && lowStockData.length) {
      lowStockData.forEach(item => {
        lowStockList.innerHTML += `<li class="list-group-item">${item.name} - ${item.stock} Adet</li>`;
      });
    } else {
      lowStockList.innerHTML = '<li class="list-group-item">Veri bulunamadı</li>';
    }

    // Sipariş ve teslimat özetleri için API çağrısı
    const summaryResponse = await fetch(`${API_URL}/orders/summary`);
    const summaryData = await summaryResponse.json();
    // Sipariş özetleri
    document.getElementById('today-orders').textContent = `${summaryData.orders.today} Sipariş`;
    document.getElementById('tomorrow-orders').textContent = `${summaryData.orders.tomorrow} Sipariş`;
    document.getElementById('future-orders').textContent = `${summaryData.orders.future} Sipariş`;
    // Teslimat özetleri
    document.getElementById('total-orders').textContent = `${summaryData.deliveries.total} Sipariş`;
    document.getElementById('delivered-orders').textContent = `${summaryData.deliveries.delivered} Teslimat`;
    document.getElementById('pending-deliveries').textContent = `${summaryData.deliveries.pending} Kalan`;
  } catch (error) {
    console.error('Dashboard verileri yüklenemedi:', error);
  }
}
