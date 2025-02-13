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
        
        // İstatistik kartları güncelleme
        document.getElementById('ordersToday').textContent = `${data.ordersToday} Sipariş`;
        document.getElementById('pendingDeliveries').textContent = `${data.pendingDeliveries} Teslimat`;
        document.getElementById('lowStockCount').textContent = `${data.lowStockCount} Ürün`;

        // Teslimat programı güncelleme
        document.getElementById('today-orders').textContent = `${data.ordersToday} Sipariş`;
        document.getElementById('tomorrow-orders').textContent = `${data.ordersTomorrow} Sipariş`;
        document.getElementById('future-orders').textContent = `${data.ordersWeek} Sipariş`;

        // Düşük stok listesi güncelleme
        if (data.lowStockItems && data.lowStockItems.length > 0) {
            document.getElementById('low-stock-list').innerHTML = data.lowStockItems
                .map(item => `
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        <span>${item.name}</span>
                        <span class="badge bg-warning">${item.stock} adet</span>
                    </div>
                `).join('');
        }

        document.getElementById('status').innerHTML = `
            <i class="bi bi-check-circle"></i> Son güncelleme: ${new Date().toLocaleTimeString()}
        `;
    } catch (error) {
        document.getElementById('status').innerHTML = `
            <i class="bi bi-exclamation-triangle"></i> Bağlantı hatası!
        `;
    }
}
