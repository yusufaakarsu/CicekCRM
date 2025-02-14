document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadDashboardData();
    setInterval(loadDashboardData, 30000); // Her 30 saniyede bir güncelle
});

async function loadDashboardData() {
    try {
        // Tüm verileri tek seferde alalım
        const [dashboard, todayOrders, tomorrowOrders, weekOrders] = await Promise.all([
            fetch(`${API_URL}/api/dashboard`).then(r => r.json()),
            fetch(`${API_URL}/orders/filtered?date_filter=today`).then(r => r.json()),
            fetch(`${API_URL}/orders/filtered?date_filter=tomorrow`).then(r => r.json()),
            fetch(`${API_URL}/orders/filtered?date_filter=week`).then(r => r.json())
        ]);

        // İstatistikleri güncelle
        updateStats(dashboard);
        
        // Teslimat sayılarını güncelle
        updateDeliveryCounts(todayOrders.orders);
        
        // Tabloları güncelle
        updateOrdersTable('todayOrders', todayOrders.orders);
        updateOrdersTable('tomorrowOrders', tomorrowOrders.orders);
        updateOrdersTable('weekOrders', weekOrders.orders);

    } catch (error) {
        console.error('Dashboard hatası:', error);
        showToast('Veriler yüklenemedi', 'error');
    }
}

// İstatistikleri güncelle
function updateStats(data) {
    // Bugünün istatistikleri
    document.getElementById('ordersToday').innerHTML = `
        <div class="display-4">${data.deliveryStats.total_orders}</div>
        <small class="text-muted">Toplam Sipariş</small>
    `;
    
    document.getElementById('deliveredOrders').innerHTML = `
        ${data.deliveryStats.delivered_orders} / ${data.deliveryStats.total_orders}
    `;
}

function updateDeliveryCounts(orders) {
    const counts = {
        morning: 0,
        afternoon: 0,
        evening: 0
    };

    // Teslimat saatlerine göre say
    orders.forEach(order => {
        if (counts.hasOwnProperty(order.delivery_time_slot)) {
            counts[order.delivery_time_slot]++;
        }
    });

    // Badge'leri güncelle
    document.getElementById('morning-count').textContent = counts.morning;
    document.getElementById('afternoon-count').textContent = counts.afternoon;
    document.getElementById('evening-count').textContent = counts.evening;
}

function updateOrdersTable(tableId, orders) {
    const table = document.getElementById(tableId);
    if (!table) return;

    // Tablo başlıklarını ve içeriği oluştur
    table.innerHTML = `
        <thead>
            <tr>
                <th>Saat</th>
                <th>Müşteri</th>
                <th>Alıcı</th>
                <th>Teslimat</th>
                <th>Durum</th>
                <th>İşlem</th>
            </tr>
        </thead>
        <tbody>
            ${orders.map(order => `
                <tr>
                    <td>
                        <div class="delivery-time ${order.delivery_time_slot}">
                            ${formatDeliveryTime(order.delivery_time_slot)}
                        </div>
                    </td>
                    <td>${order.customer_name || '-'}</td>
                    <td>
                        <div>${order.recipient_name || '-'}</div>
                        <small>${order.recipient_phone || '-'}</small>
                    </td>
                    <td>
                        <div>${order.delivery_address || '-'}</div>
                        <small>${order.delivery_notes || ''}</small>
                    </td>
                    <td>${getStatusBadge(order.status)}</td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-info" 
                                    onclick="showOrderDetails('${order.id}')"
                                    title="Detay">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-outline-secondary" 
                                    onclick="editOrder('${order.id}')"
                                    title="Düzenle">
                                <i class="bi bi-pencil"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

// Toast mesajı göster
function showToast(message, type = 'error') {
    const toast = `
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div class="toast align-items-center text-bg-${type} border-0">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                            data-bs-dismiss="toast"></button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toast);
    const toastEl = document.querySelector('.toast');
    const bsToast = new bootstrap.Toast(toastEl);
    bsToast.show();
}

// Otomatik yenileme
setInterval(loadDashboardData, 30000); // Her 30 saniyede bir
