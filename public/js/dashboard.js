document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadDashboardData();
    
    // Tab değişikliğini dinle
    document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', (e) => {
            const target = e.target.getAttribute('data-bs-target').replace('#', '');
            updateDeliveryCounts(document.getElementById(target + 'Orders'));
        });
    });
});

async function loadDashboardData() {
    try {
        // Ana veriyi yükle
        const dashboard = await fetch(`${API_URL}/api/dashboard`).then(r => r.json());
        updateStats(dashboard);
        
        // Tüm sonuçları getir
        const todayOrders = await fetch(`${API_URL}/orders/filtered?date_filter=today&per_page=1000`).then(r => r.json());
        const tomorrowOrders = await fetch(`${API_URL}/orders/filtered?date_filter=tomorrow&per_page=1000`).then(r => r.json());
        const weekOrders = await fetch(`${API_URL}/orders/filtered?date_filter=week&per_page=10&page=1`).then(r => r.json());
        
        // Teslimat sayılarını güncelle
        updateDeliveryCounts(todayOrders.orders);
        
        // Tabloları güncelle
        updateOrdersTable('todayOrders', todayOrders.orders);
        updateOrdersTable('tomorrowOrders', tomorrowOrders.orders);
        updateOrdersTableWithPagination('weekOrders', weekOrders);

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

function updateDeliveryCounts(tableElement) {
    if (!tableElement) return;
    
    const counts = {
        morning: 0,
        afternoon: 0,
        evening: 0
    };

    // Tablodaki görünür satırları say
    tableElement.querySelectorAll('tbody tr:not(.d-none)').forEach(row => {
        const timeSlot = row.querySelector('.delivery-time')?.classList[1];
        if (timeSlot) {
            counts[timeSlot]++;
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

    // Siparişleri sırala
    const sortedOrders = orders.sort((a, b) => {
        // Önce teslimat saatine göre sırala
        const timeSlotOrder = {
            'morning': 1,
            'afternoon': 2,
            'evening': 3
        };

        // Teslim edilenler en sona
        if (a.status === 'delivered' && b.status !== 'delivered') return 1;
        if (a.status !== 'delivered' && b.status === 'delivered') return -1;

        // Aynı durumdaysa teslimat saatine göre sırala
        return timeSlotOrder[a.delivery_time_slot] - timeSlotOrder[b.delivery_time_slot];
    });

    table.innerHTML = `
        <thead>
            <tr>
                <th>Saat</th>
                <th>Müşteri</th>
                <th>Alıcı</th>
                <th>Teslimat</th>
                <th>Durum</th>
            </tr>
        </thead>
        <tbody>
            ${sortedOrders.map(order => `
                <tr class="order-row ${order.status === 'delivered' ? 'delivered-order' : ''}" 
                    data-order-id="${order.id}" 
                    style="cursor: pointer;">
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
                </tr>
                <tr class="order-details d-none" data-order-id="${order.id}">
                    <td colspan="5">
                        <div class="p-3 bg-light">
                            <h6 class="mb-3">Sipariş Durumu Güncelle</h6>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-outline-warning" onclick="updateOrderStatus('${order.id}', 'preparing')">
                                    <i class="bi bi-box-seam"></i> Hazırlanıyor
                                </button>
                                <button class="btn btn-sm btn-outline-info" onclick="updateOrderStatus('${order.id}', 'ready')">
                                    <i class="bi bi-box"></i> Hazır
                                </button>
                                <button class="btn btn-sm btn-outline-primary" onclick="updateOrderStatus('${order.id}', 'delivering')">
                                    <i class="bi bi-truck"></i> Yolda
                                </button>
                                <button class="btn btn-sm btn-outline-success" onclick="updateOrderStatus('${order.id}', 'delivered')">
                                    <i class="bi bi-check-circle"></i> Teslim Edildi
                                </button>
                            </div>
                            <div class="mt-3">
                                <p class="mb-2"><strong>Sipariş Detayları:</strong></p>
                                <p class="mb-1">Kart Mesajı: ${order.card_message || '-'}</p>
                                <p class="mb-1">Toplam: ${formatCurrency(order.total_amount)}</p>
                                <p class="mb-0">Oluşturulma: ${formatDate(order.created_at)}</p>
                            </div>
                        </div>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;

    // Satıra tıklama olayı ekle
    table.querySelectorAll('.order-row').forEach(row => {
        row.addEventListener('click', () => {
            const orderId = row.dataset.orderId;
            const detailsRow = table.querySelector(`.order-details[data-order-id="${orderId}"]`);
            detailsRow.classList.toggle('d-none');
        });
    });
}

// Sipariş durumu güncelleme fonksiyonu
async function updateOrderStatus(orderId, newStatus) {
    // Onay modalı göster
    if (!confirm(`Sipariş durumunu "${getStatusText(newStatus)}" olarak güncellemek istediğinizden emin misiniz?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('API Hatası');

        // Başarılı güncelleme sonrası sayfayı yenile
        loadDashboardData();
        showToast('Sipariş durumu güncellendi', 'success');
    } catch (error) {
        console.error('Durum güncelleme hatası:', error);
        showToast('Durum güncellenirken hata oluştu');
    }
}

// Durum metni alma yardımcı fonksiyonu
function getStatusText(status) {
    const statusMap = {
        'new': 'Yeni',
        'preparing': 'Hazırlanıyor',
        'ready': 'Hazır',               // Eklendi
        'delivering': 'Yolda',
        'delivered': 'Teslim Edildi',   // Eklendi
        'cancelled': 'İptal'
    };
    return statusMap[status] || status;
}

function updateOrdersTableWithPagination(tableId, data) {
    const table = document.getElementById(tableId);
    if (!table) return;

    // Tablo içeriğini oluştur
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
            ${data.orders.map(order => `
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
        <tfoot>
            <tr>
                <td colspan="6">
                    <nav aria-label="Sayfalama" class="mt-3">
                        <ul class="pagination justify-content-center mb-0">
                            ${generatePaginationButtons(data.page, data.total_pages)}
                        </ul>
                    </nav>
                </td>
            </tr>
        </tfoot>
    `;

    // Sayfalama butonlarına tıklama olaylarını ekle
    table.querySelectorAll('.page-link').forEach(button => {
        button.addEventListener('click', () => {
            const page = button.dataset.page;
            loadWeekPage(page);
        });
    });
}

function generatePaginationButtons(currentPage, totalPages) {
    let buttons = [];
    
    // Önceki sayfa butonu
    buttons.push(`
        <li class="page-item ${currentPage == 1 ? 'disabled' : ''}">
            <button class="page-link" data-page="${currentPage - 1}">Önceki</button>
        </li>
    `);

    // Sayfa numaraları
    for (let i = 1; i <= totalPages; i++) {
        buttons.push(`
            <li class="page-item ${i == currentPage ? 'active' : ''}">
                <button class="page-link" data-page="${i}">${i}</button>
            </li>
        `);
    }

    // Sonraki sayfa butonu
    buttons.push(`
        <li class="page-item ${currentPage == totalPages ? 'disabled' : ''}">
            <button class="page-link" data-page="${currentPage + 1}">Sonraki</button>
        </li>
    `);

    return buttons.join('');
}

async function loadWeekPage(page) {
    try {
        const response = await fetch(`${API_URL}/orders/filtered?date_filter=week&per_page=10&page=${page}`);
        const data = await response.json();
        updateOrdersTableWithPagination('weekOrders', data);
    } catch (error) {
        console.error('Sayfa yüklenirken hata:', error);
        showToast('Sayfa yüklenemedi', 'error');
    }
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
setInterval(loadDashboardData, 120000); // 2 dakikada bir güncelle
