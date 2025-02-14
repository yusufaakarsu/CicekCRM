document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadDashboardData();
    setInterval(loadDashboardData, 30000); // Her 30 saniyede bir güncelle
});

async function loadDashboardData() {
    try {
        const [dashboard, today, tomorrow, week] = await Promise.all([
            fetch(`${API_URL}/api/dashboard`).then(r => r.json()),
            fetch(`${API_URL}/orders/filtered?date_filter=today`).then(r => r.json()),
            fetch(`${API_URL}/orders/filtered?date_filter=tomorrow`).then(r => r.json()),
            fetch(`${API_URL}/orders/filtered?date_filter=week`).then(r => r.json())
        ]);

        // İstatistikleri güncelle
        updateStats(dashboard);
        
        // Teslimat sayılarını güncelle
        updateDeliveryCounts(today.orders);
        
        // Sipariş tablolarını güncelle
        updateOrdersTable('todayOrders', today.orders);
        updateOrdersTable('tomorrowOrders', tomorrow.orders);
        updateOrdersTable('weekOrders', week.orders);

    } catch (error) {
        console.error('Dashboard yüklenirken hata:', error);
        showToast('Veriler yüklenirken hata oluştu', 'error');
    }
}

function refreshDashboard() {
    showToast('Yenileniyor...', 'info');
    loadDashboardData();
}

// Diğer yardımcı fonksiyonlar buraya eklenecek...
