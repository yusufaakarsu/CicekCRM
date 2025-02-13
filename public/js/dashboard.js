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
        
        // Bugünün teslimatları - BU KISIM ÖNEMLİ
        const deliveryStats = data.deliveryStats;
        document.getElementById('ordersToday').textContent = `${deliveryStats.total_orders} Sipariş`;
        document.getElementById('pendingDeliveries').innerHTML = 
            `${deliveryStats.delivered_orders} / ${deliveryStats.total_orders} Teslimat
            <p class="text-muted">${deliveryStats.pending_orders} bekleyen teslimat</p>`;

        // Yarının ürün ihtiyaçları - BÜTÜN LİSTEYİ GÖSTER
        const stockList = document.getElementById('low-stock-list');
        stockList.innerHTML = data.tomorrowNeeds.map(item => `
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
