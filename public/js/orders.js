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

    // Custom date inputs
    ['startDate', 'endDate'].forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
            currentPage = 1;
            loadOrders();
        });
    });

    // Sort filter
    document.getElementById('sortFilter').addEventListener('change', () => {
        currentPage = 1;
        loadOrders();
    });
}

async function loadOrders() {
    try {
        // Filtreleri al
        const filters = getActiveFilters();
        const queryString = new URLSearchParams(filters).toString();

        // Filtered endpoint'ini kullan
        const response = await fetch(`${API_URL}/orders/filtered?${queryString}`);
        if (!response.ok) throw new Error('API Hatası');
        const data = await response.json();

        renderOrders(data.orders);
        renderPagination(data.total); // Toplam kayıt sayısını al

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
        filters.start_date = document.getElementById('startDate').value;
        filters.end_date = document.getElementById('endDate').value;
    } else {
        filters.date_filter = dateFilter;
    }

    return filters;
}

function renderOrders(orders) {
    const tbody = document.querySelector('#ordersTable tbody');
    
    if (orders && orders.length > 0) {
        tbody.innerHTML = orders.map(order => {
            // items string olarak geliyor, split ile array'e çeviriyoruz
            const items = order.items ? order.items.split(',') : [];
            
            return `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.customer_name}</td>
                    <td>${items.join('<br>')}</td>
                    <td>
                        ${formatDate(order.delivery_date)}<br>
                        <small class="text-muted">${order.delivery_address}</small>
                    </td>
                    <td>${formatCurrency(order.total_amount)}</td>
                    <td>${getStatusBadge(order.status)}</td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" onclick="showOrderDetails('${order.id}')">
                                <i class="bi bi-info-circle"></i>
                            </button>
                            <button class="btn btn-outline-warning" onclick="editOrder('${order.id}')">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="cancelOrder('${order.id}')">
                                <i class="bi bi-x-circle"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    } else {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Sipariş bulunamadı</td></tr>';
    }
}

function renderPagination(total) {
    const totalPages = Math.ceil(total / PER_PAGE);
    const pagination = document.getElementById('pagination');
    
    let html = '';
    
    if (totalPages > 1) {
        // Önceki sayfa
        html += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="javascript:void(0)" onclick="changePage(${currentPage - 1})">Önceki</a>
            </li>
        `;

        // İlk sayfa
        if (currentPage > 3) {
            html += `
                <li class="page-item">
                    <a class="page-link" href="javascript:void(0)" onclick="changePage(1)">1</a>
                </li>
                <li class="page-item disabled"><span class="page-link">...</span></li>
            `;
        }

        // Sayfa numaraları
        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="javascript:void(0)" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        }

        // Son sayfa
        if (currentPage < totalPages - 2) {
            html += `
                <li class="page-item disabled"><span class="page-link">...</span></li>
                <li class="page-item">
                    <a class="page-link" href="javascript:void(0)" onclick="changePage(${totalPages})">${totalPages}</a>
                </li>
            `;
        }

        // Sonraki sayfa
        html += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="javascript:void(0)" onclick="changePage(${currentPage + 1})">Sonraki</a>
            </li>
        `;
    }

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
