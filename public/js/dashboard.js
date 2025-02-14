document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadDashboardData();
    setInterval(loadDashboardData, 30000); // Her 30 saniyede bir güncelle
});

async function loadDashboardData() {
    try {
        const response = await fetch(`${API_URL}/api/dashboard`);
        if (!response.ok) throw new Error('API Hatası');
        const data = await response.json();

        // İstatistik kartları güncelleme
        updateStats(data);
        updateDeliveryCounts();

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

// Teslimat sayılarını güncelle
async function updateDeliveryCounts() {
    try {
        const response = await fetch(`${API_URL}/orders/filtered?date_filter=today`);
        if (!response.ok) throw new Error('API Hatası');
        const data = await response.json();

        const counts = {
            morning: 0,
            afternoon: 0,
            evening: 0
        };

        // Teslimat saatlerine göre say
        data.orders.forEach(order => {
            if (counts.hasOwnProperty(order.delivery_time_slot)) {
                counts[order.delivery_time_slot]++;
            }
        });

        // Badge'leri güncelle
        document.getElementById('morning-count').textContent = counts.morning;
        document.getElementById('afternoon-count').textContent = counts.afternoon;
        document.getElementById('evening-count').textContent = counts.evening;

        // Siparişleri tabloya ekle
        updateOrdersTable(data.orders);

    } catch (error) {
        console.error('Teslimat sayıları yüklenemedi:', error);
    }
}

// Sipariş tablosunu güncelle
function updateOrdersTable(orders) {
    const tableId = 'todayOrders';
    const table = document.getElementById(tableId);
    if (!table) return;

    // Tablo başlıklarını ekle
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
                        <div>${order.recipient_name}</div>
                        <small>${order.recipient_phone}</small>
                    </td>
                    <td>
                        <div>${order.delivery_address}</div>
                        <small>${order.delivery_notes || ''}</small>
                    </td>
                    <td>${getStatusBadge(order.status)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-info" 
                                onclick="showOrderDetails('${order.id}')">
                            <i class="bi bi-eye"></i>
                        </button>
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
