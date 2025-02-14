let currentPage = 1;
const PER_PAGE = 10;

document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    setupFilters();
    loadOrders();
});

// Filtre olaylarını ayarla
function setupFilters() {
    // Status filter
    document.getElementById('statusFilter').addEventListener('change', () => {
        currentPage = 1;
        loadOrders();
    });

    // Date filter
    document.getElementById('dateFilter').addEventListener('change', (e) => {
        const customDateRange = document.getElementById('customDateRange');
        if (e.target.value === 'custom') {
            customDateRange.style.display = 'block';
        } else {
            customDateRange.style.display = 'none';
            currentPage = 1;
            loadOrders();
        }
    });

    // Apply date filter button
    document.getElementById('applyDateFilter').addEventListener('click', () => {
        const start = document.getElementById('startDate').value;
        const end = document.getElementById('endDate').value;
        
        if (!start || !end) {
            showToast('Lütfen tarih aralığını tam olarak seçin', 'warning');
            return;
        }
        
        currentPage = 1;
        loadOrders();
    });

    // Sort filter
    document.getElementById('sortFilter').addEventListener('change', () => {
        currentPage = 1;
        loadOrders();
    });
}

async function loadOrders() {
    try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Siparişler yüklenemedi');
        const orders = await response.json();
        
        const tbody = document.getElementById('ordersTable'); // ID'yi düzelttik
        if (!tbody) {
            console.error('Tablo tbody elemanı bulunamadı');
            return;
        }
        
        tbody.innerHTML = orders.map(order => renderOrder(order)).join('');
    } catch (error) {
        console.error('Siparişler yüklenirken hata:', error);
        showToast('Siparişler yüklenemedi!', 'error');
    }
}

function getActiveFilters() {
    const filters = {
        page: currentPage,
        per_page: PER_PAGE,
        status: document.getElementById('statusFilter').value,
        sort: document.getElementById('sortFilter').value,
    };

    const dateFilter = document.getElementById('dateFilter').value;
    if (dateFilter === 'custom') {
        const start = document.getElementById('startDate').value;
        const end = document.getElementById('endDate').value;
        if (start && end) {
            filters.start_date = start;
            filters.end_date = end;
        }
    } else if (dateFilter !== 'all') {
        filters.date_filter = dateFilter;
    }

    return filters;
}

function renderOrders(orders) {
    const tbody = document.querySelector('#ordersTable tbody');
    
    if (orders && orders.length > 0) {
        tbody.innerHTML = orders.map(order => {
            const items = order.items ? order.items.split(',') : [];
            
            return `
                <tr style="cursor: pointer">
                    <td onclick="showOrderDetails('${order.id}')">${order.id}</td>
                    <td onclick="showOrderDetails('${order.id}')">
                        <div class="mb-1"><strong>${order.customer_name}</strong></div>
                        <div class="text-muted small">
                            <i class="bi bi-person"></i> ${order.recipient_name}<br>
                            <i class="bi bi-telephone"></i> ${order.recipient_phone}
                        </div>
                    </td>
                    <td onclick="showOrderDetails('${order.id}')">
                        <div class="mb-1">
                            <i class="bi bi-calendar"></i> ${formatDate(order.delivery_date)}
                            <small class="text-muted">${order.delivery_time_slot || ''}</small>
                        </div>
                        <div class="text-muted small">
                            <i class="bi bi-geo-alt"></i> ${order.recipient_address || order.delivery_address}
                        </div>
                    </td>
                    <td onclick="showOrderDetails('${order.id}')">${items.join('<br>')}</td>
                    <td onclick="showOrderDetails('${order.id}')">${formatCurrency(order.total_amount)}</td>
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-${getStatusColor(order.status)} dropdown-toggle btn-sm" 
                                    type="button" 
                                    data-bs-toggle="dropdown">
                                ${getStatusText(order.status)}
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item ${order.status === 'new' ? 'active' : ''}" 
                                      href="javascript:void(0)" 
                                      onclick="updateOrderStatus('${order.id}', 'new')">Yeni</a></li>
                                <li><a class="dropdown-item ${order.status === 'preparing' ? 'active' : ''}" 
                                      href="javascript:void(0)" 
                                      onclick="updateOrderStatus('${order.id}', 'preparing')">Hazırlanıyor</a></li>
                                <li><a class="dropdown-item ${order.status === 'ready' ? 'active' : ''}" 
                                      href="javascript:void(0)" 
                                      onclick="updateOrderStatus('${order.id}', 'ready')">Hazır</a></li>
                                <li><a class="dropdown-item ${order.status === 'delivering' ? 'active' : ''}" 
                                      href="javascript:void(0)" 
                                      onclick="updateOrderStatus('${order.id}', 'delivering')">Yolda</a></li>
                                <li><a class="dropdown-item ${order.status === 'delivered' ? 'active' : ''}" 
                                      href="javascript:void(0)" 
                                      onclick="updateOrderStatus('${order.id}', 'delivered')">Teslim Edildi</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-danger ${order.status === 'cancelled' ? 'active' : ''}" 
                                      href="javascript:void(0)" 
                                      onclick="confirmCancelOrder('${order.id}')">İptal Et</a></li>
                            </ul>
                        </div>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="showOrderDetails('${order.id}')">
                            <i class="bi bi-info-circle"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } else {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Sipariş bulunamadı</td></tr>';
    }
}

// Status renk ve metin fonksiyonları
function getStatusColor(status) {
    const colors = {
        new: 'secondary',
        preparing: 'info',
        ready: 'primary',
        delivering: 'warning',
        delivered: 'success',
        cancelled: 'danger'
    };
    return colors[status] || 'secondary';
}

function getStatusText(status) {
    const texts = {
        new: 'Yeni',
        preparing: 'Hazırlanıyor',
        ready: 'Hazır',
        delivering: 'Yolda',
        delivered: 'Teslim Edildi',
        cancelled: 'İptal'
    };
    return texts[status] || 'Bilinmiyor';
}

// Sipariş durumu güncelleme
async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('API Hatası');

        showToast(`Sipariş durumu "${getStatusText(newStatus)}" olarak güncellendi`, 'success');
        loadOrders(); // Tabloyu yenile
    } catch (error) {
        showToast('Sipariş durumu güncellenemedi!', 'error');
    }
}

function confirmCancelOrder(orderId) {
    if (confirm('Bu siparişi iptal etmek istediğinize emin misiniz?')) {
        updateOrderStatus(orderId, 'cancelled');
    }
}

function renderPagination(total, totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="javascript:void(0)" onclick="changePage(${currentPage - 1})" aria-label="Önceki">
                <i class="bi bi-chevron-left"></i>
            </a>
        </li>
    `;

    // Sayfa numaralarını oluştur
    if (totalPages <= 7) {
        // 7 veya daha az sayfa varsa hepsini göster
        for (let i = 1; i <= totalPages; i++) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="javascript:void(0)" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        }
    } else {
        // İlk sayfa
        html += `<li class="page-item ${currentPage === 1 ? 'active' : ''}">
                    <a class="page-link" href="javascript:void(0)" onclick="changePage(1)">1</a>
                </li>`;

        // Başlangıç elipsi
        if (currentPage > 3) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }

        // Ortadaki sayfalar
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="javascript:void(0)" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        }

        // Bitiş elipsi
        if (currentPage < totalPages - 2) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }

        // Son sayfa
        html += `<li class="page-item ${currentPage === totalPages ? 'active' : ''}">
                    <a class="page-link" href="javascript:void(0)" onclick="changePage(${totalPages})">${totalPages}</a>
                </li>`;
    }

    // Sonraki buton
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="javascript:void(0)" onclick="changePage(${currentPage + 1})" aria-label="Sonraki">
                <i class="bi bi-chevron-right"></i>
            </a>
        </li>
    `;

    // Toplam kayıt bilgisi
    html += `
        <li class="ms-3 d-flex align-items-center">
            <small class="text-muted">Toplam ${total} kayıt</small>
        </li>
    `;

    pagination.innerHTML = html;
}

function changePage(page) {
    if (page < 1) return;
    currentPage = page;
    loadOrders();
    // Sayfanın üstüne kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toast mesajları için fonksiyonlar
function showToast(message, type = 'error') {
    const toast = `
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div class="toast align-items-center text-bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi bi-${type === 'error' ? 'x-circle' : 'check-circle'}"></i> ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', toast);
    const toastEl = document.querySelector('.toast');
    const bsToast = new bootstrap.Toast(toastEl);
    bsToast.show();
}

// Sipariş detay modalını göster
async function showOrderDetails(orderId) {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/details`);
        if (!response.ok) throw new Error('API Hatası');
        const order = await response.json();

        const modal = new bootstrap.Modal(document.getElementById('orderDetailModal'));
        
        // Modal içeriğini doldur
        document.getElementById('order-detail-id').textContent = order.id;
        document.getElementById('order-detail-customer').textContent = order.customer_name;
        document.getElementById('order-detail-recipient-name').textContent = order.recipient.name;
        document.getElementById('order-detail-recipient-phone').textContent = order.recipient.phone;
        document.getElementById('order-detail-recipient-note').textContent = order.recipient.note || '-';
        document.getElementById('order-detail-card-message').textContent = order.recipient.card_message || '-';
        document.getElementById('order-detail-delivery').textContent = formatDate(order.delivery_date);
        document.getElementById('order-detail-address').textContent = order.delivery_address;
        document.getElementById('order-detail-amount').textContent = formatCurrency(order.total_amount);
        document.getElementById('order-detail-status').innerHTML = getStatusBadge(order.status);
        
        // Ürünleri listele
        const items = order.items ? order.items.split(',').map(item => {
            const [quantity, name] = item.trim().split('x ');
            return `${quantity}x ${name}`;
        }) : [];
        
        document.getElementById('order-detail-items').innerHTML = items.join('<br>') || '-';

        modal.show();
    } catch (error) {
        showToast('Sipariş detayları yüklenemedi!', 'error');
    }
}

// Sipariş düzenleme modalını göster
async function editOrder(orderId) {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/details`);
        if (!response.ok) throw new Error('API Hatası');
        const order = await response.json();

        const modal = new bootstrap.Modal(document.getElementById('editOrderModal'));
        const form = document.getElementById('editOrderForm');
        
        // Form alanlarını doldur
        form.elements['id'].value = order.id;
        // ISO string'i local datetime'a çevir
        const deliveryDate = new Date(order.delivery_date);
        form.elements['delivery_date'].value = deliveryDate.toISOString().slice(0, 16);
        form.elements['delivery_address'].value = order.delivery_address;
        form.elements['status'].value = order.status;

        modal.show();
    } catch (error) {
        showToast('Sipariş bilgileri yüklenemedi!', 'error');
    }
}

// Sipariş güncelle
async function updateOrder() {
    const form = document.getElementById('editOrderForm');
    const orderId = form.elements['id'].value;

    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                delivery_date: form.elements['delivery_date'].value,
                delivery_address: form.elements['delivery_address'].value,
                status: form.elements['status'].value
            })
        });

        if (!response.ok) throw new Error('API Hatası');

        bootstrap.Modal.getInstance(document.getElementById('editOrderModal')).hide();
        showToast('Sipariş güncellendi', 'success');
        loadOrders(); // Tabloyu yenile
    } catch (error) {
        showToast('Sipariş güncellenemedi!', 'error');
    }
}

// Sipariş iptal et
async function cancelOrder(orderId) {
    if (!confirm('Bu siparişi iptal etmek istediğinize emin misiniz?')) return;

    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
            method: 'PUT'
        });

        if (!response.ok) throw new Error('API Hatası');

        showToast('Sipariş iptal edildi', 'success');
        loadOrders(); // Tabloyu yenile
    } catch (error) {
        showToast('Sipariş iptal edilemedi!', 'error');
    }
}

async function fetchOrders() {
    try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Siparişler yüklenemedi');
        const orders = await response.json();
        
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>
                    <span class="badge ${getStatusClass(order.status)}">${getOrderStatus(order.status)}</span>
                    <span class="badge ${getDeliveryStatusClass(order.delivery_status)}">${getDeliveryStatus(order.delivery_status)}</span>
                </td>
                <td>
                    <div>${order.customer_name}</div>
                    <div class="small text-muted">${order.customer_phone}</div>
                </td>
                <td>
                    <div>${formatDate(order.delivery_date)} - ${order.delivery_time_slot}</div>
                    <div class="small">${order.delivery_address}</div>
                    <div class="small">${order.delivery_district}, ${order.delivery_city}</div>
                    ${order.delivery_notes ? `<div class="small text-danger">${order.delivery_notes}</div>` : ''}
                </td>
                <td>
                    <div>${order.recipient_name}</div>
                    <div class="small">${order.recipient_phone}</div>
                    ${order.recipient_note ? `<div class="small text-danger">${order.recipient_note}</div>` : ''}
                    ${order.card_message ? `<div class="small fst-italic">"${order.card_message}"</div>` : ''}
                </td>
                <td>
                    <div class="fw-bold">${formatPrice(order.total_amount)}</div>
                    <span class="badge ${getPaymentStatusClass(order.payment_status)}">${getPaymentStatus(order.payment_status)}</span>
                    <div class="small">${order.payment_method}</div>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="showOrderDetail('${order.id}')">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-outline-secondary" onclick="showEditOrder('${order.id}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Siparişler yüklenirken hata:', error);
        showError('Siparişler yüklenemedi');
    }
}

function getStatusClass(status) {
    const classes = {
        'new': 'bg-primary',
        'preparing': 'bg-warning',
        'delivering': 'bg-info',
        'delivered': 'bg-success',
        'cancelled': 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
}

function getDeliveryStatusClass(status) {
    const classes = {
        'pending': 'bg-secondary',
        'assigned': 'bg-info',
        'on_way': 'bg-warning',
        'completed': 'bg-success',
        'failed': 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
}

function getPaymentStatusClass(status) {
    const classes = {
        'pending': 'bg-warning',
        'paid': 'bg-success',
        'refunded': 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
}
