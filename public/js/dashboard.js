document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadDashboardData();
    loadRecentOrders();
    setInterval(loadDashboardData, 30000);
});

async function loadDashboardData() {
    try {
        const response = await fetch(`${API_URL}/api/dashboard`);
        if (!response.ok) throw new Error('API yanıt vermedi');
        
        const data = await response.json();
        
        // Teslimat istatistikleri
        const { deliveryStats } = data;
        document.getElementById('ordersToday').textContent = `${deliveryStats.total_orders} Sipariş`;
        document.getElementById('pendingDeliveries').innerHTML = 
            `${deliveryStats.delivered_orders} / ${deliveryStats.total_orders} Teslimat
            <p class="text-muted">${deliveryStats.pending_orders} bekleyen teslimat</p>`;

        // Yarının ürün ihtiyaçları
        const stockList = document.getElementById('low-stock-list');
        if (data.tomorrowNeeds.results && data.tomorrowNeeds.results.length > 0) {
            stockList.innerHTML = data.tomorrowNeeds.results.map(item => `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <span>${item.name}</span>
                    <span>İhtiyaç: ${item.needed_quantity} adet</span>
                </div>
            `).join('');
        }

        // Teslimat programı
        const summary = data.orderSummary.results;
        if (summary && summary.length >= 3) {
            document.getElementById('today-orders').textContent = `${summary[0].count} Sipariş`;
            document.getElementById('tomorrow-orders').textContent = `${summary[1].count} Sipariş`;
            document.getElementById('future-orders').textContent = `${summary[2].count} Sipariş`;
        }

        // Düşük stok sayısı
        document.getElementById('lowStockCount').textContent = `${data.lowStock} Ürün`;

        document.getElementById('status').innerHTML = `
            <i class="bi bi-check-circle"></i> Son güncelleme: ${new Date().toLocaleTimeString()}
        `;
    } catch (error) {
        console.error('Dashboard hatası:', error);
        document.getElementById('status').innerHTML = `
            <i class="bi bi-exclamation-triangle"></i> Bağlantı hatası: ${error.message}
        `;
    }
}
