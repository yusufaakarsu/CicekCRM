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
        // API URL'ini kontrol et
        const API_URL = '/workers/api'; // API_URL'i tanımla
        const response = await fetch(`${API_URL}/orders`);
        
        console.log('API Response:', response); // Response detaylarını gör
        
        if (!response.ok) throw new Error(`API Hatası: ${response.status}`);
        const orders = await response.json();
        
        const tbody = document.getElementById('ordersTable');
        if (!tbody) {
            console.error('Tablo tbody elemanı bulunamadı (ordersTable)');
            return;
        }
        
        tbody.innerHTML = orders.map(order => renderOrder(order)).join('');
    } catch (error) {
        console.error('Siparişler yüklenirken hata:', error);
        showToast('Siparişler yüklenemedi! ' + error.message, 'error');
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
