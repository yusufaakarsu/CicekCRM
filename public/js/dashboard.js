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
        
        // Bugünün teslimatları
        document.getElementById('delivered-count').textContent = data.deliveryStats.delivered_orders;
        document.getElementById('total-deliveries').textContent = data.deliveryStats.total_orders;
        document.getElementById('pending-count').textContent = `${data.deliveryStats.pending_orders} bekleyen teslimat`;

        // Yarın için gerekli ürünler
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
