document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadOrders();
});

async function loadOrders() {
    try {
        const response = await fetch(`${API_URL}/orders`);
        if (!response.ok) throw new Error('API Hatası');
        const orders = await response.json();
        
        const tbody = document.getElementById('ordersTable');
        if (!tbody) {
            console.error('Tablo tbody elemanı bulunamadı');
            return;
        }
        
        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer_name}</td>
                <td>${order.items ? order.items.map(item => `${item.quantity}x ${item.name}`).join('<br>') : '-'}</td>
                <td>
                    ${formatDate(order.delivery_date)}<br>
                    <small class="text-muted">${order.delivery_address}</small>
                </td>
                <td>${getStatusBadge(order.status)}</td>
                <td>${formatCurrency(order.total_amount)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="showOrderDetails('${order.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Siparişler yüklenirken hata:', error);
        showToast('Siparişler yüklenemedi');
    }
}

// Toast mesajı göster
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

// Sipariş detayları modalı
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
        document.getElementById('order-detail-status').innerHTML = getStatusBadge(order.status);
        document.getElementById('order-detail-amount').textContent = formatCurrency(order.total_amount);
        
        modal.show();
    } catch (error) {
        showToast('Sipariş detayları yüklenemedi');
    }
}
