document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadDashboardData();
    loadRecentOrders();
    setInterval(loadDashboardData, 30000);
});

async function loadDashboardData() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const data = await response.json();
        
        // Bugünün teslimatları - SADECE BUGÜNÜN VERİLERİ
        document.getElementById('pendingDeliveries').textContent = 
            `${data.deliveredToday} / ${data.ordersToday} Teslimat`;

        // Yarının siparişleri için stok ihtiyacı
        document.getElementById('low-stock-list').innerHTML = 
            data.tomorrowNeeds.map(item => `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <span>${item.name}</span>
                    <span>İhtiyaç: ${item.needed_quantity} adet</span>
                </div>
            `).join('') || '<div class="list-group-item">Yarın için sipariş yok</div>';

        // İstatistik kartları güncelleme
        document.getElementById('ordersToday').textContent = `${data.ordersToday} Sipariş`;
        document.getElementById('lowStockCount').textContent = `${data.lowStockCount} Ürün`;

        // Teslimat programı güncelleme
        document.getElementById('today-orders').textContent = `${data.ordersToday} Sipariş`;
        document.getElementById('tomorrow-orders').textContent = `${data.ordersTomorrow} Sipariş`;
        document.getElementById('future-orders').textContent = `${data.ordersWeek} Sipariş`;

        document.getElementById('status').innerHTML = `
            <i class="bi bi-check-circle"></i> Son güncelleme: ${new Date().toLocaleTimeString()}
        `;
    } catch (error) {
        console.error('Dashboard error:', error);
        document.getElementById('status').innerHTML = `
            <i class="bi bi-exclamation-triangle"></i> Bağlantı hatası!
        `;
    }
}

async function updateDashboard() {
  try {
    const response = await fetch('/api/dashboard');
    const data = await response.json();
    
    // Bugünün teslimatları
    document.querySelector('#delivery-stats').innerHTML = `
      ${data.deliveryStats.delivered_orders} / ${data.deliveryStats.total_orders} Teslimat
      <p class="text-sm text-gray-500">${data.deliveryStats.pending_orders} bekleyen teslimat</p>
    `;

    // Yarın için gerekli ürünler
    const stockList = document.querySelector('#stock-needs');
    if (data.tomorrowNeeds && data.tomorrowNeeds.length > 0) {
      stockList.innerHTML = data.tomorrowNeeds.map(item => `
        <div class="stock-item">
          <span>${item.name}</span>
          <span>İhtiyaç: ${item.needed_quantity} adet</span>
        </div>
      `).join('');
    } else {
      stockList.innerHTML = '<p>Yarın için sipariş yok</p>';
    }

    // Son güncelleme zamanı
    document.querySelector('#last-update').textContent = 
      new Date().toLocaleTimeString('tr-TR');

  } catch (error) {
    console.error('Dashboard güncelleme hatası:', error);
  }
}

// Sayfa yüklendiğinde ve her dakikada bir güncelle
document.addEventListener('DOMContentLoaded', () => {
  updateDashboard();
  setInterval(updateDashboard, 60000);
});
