document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadDashboardData();
    loadRecentOrders();
    setInterval(loadDashboardData, 30000);
});

async function loadDashboardData() {
    try {
        const response = await fetch(`${API_URL}/api/dashboard`);
        const data = await response.json();
        
        // Bugünün teslimat durumu
        document.getElementById('pendingDeliveries').innerHTML = 
            `${data.deliveryStats.delivered_orders} / ${data.deliveryStats.total_orders} Teslimat
            <p class="text-muted">${data.deliveryStats.pending_orders} bekleyen teslimat</p>`;
        
        // Yarının ürün ihtiyaçları
        const stockList = document.getElementById('low-stock-list');
        if (data.tomorrowNeeds && data.tomorrowNeeds.length > 0) {
            stockList.innerHTML = data.tomorrowNeeds.map(item => `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <span>${item.name}</span>
                    <span>İhtiyaç: ${item.needed_quantity} adet</span>
                </div>
            `).join('');
        } else {
            stockList.innerHTML = '<div class="list-group-item">Yarın için sipariş yok</div>';
        }

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
