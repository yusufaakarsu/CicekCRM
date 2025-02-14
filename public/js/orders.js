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
                <td>#${order.id}</td>
                <td>
                    <div>${formatDate(order.created_at)}</div>
                    <small class="text-muted">Teslimat: ${formatDate(order.delivery_date)}</small>
                </td>
                <td>
                    <div>${order.customer_name || '-'}</div>
                    <small class="text-muted">${order.customer_phone || ''}</small>
                </td>
                <td>
                    <div class="text-wrap" style="max-width: 200px;">
                        ${order.delivery_address || '-'}
                        <small class="d-block text-muted">${order.delivery_notes || ''}</small>
                    </div>
                </td>
                <td>
                    <div>${order.recipient_name || '-'}</div>
                    <small class="text-muted">${order.recipient_phone || ''}</small>
                    ${order.card_message ? `<small class="d-block text-info">"${order.card_message}"</small>` : ''}
                </td>
                <td>
                    <div class="text-wrap" style="max-width: 150px;">
                        ${order.items_list ? order.items_list.split(',').map(item => 
                            `<div>${item.trim()}</div>`
                        ).join('') : '-'}
                    </div>
                </td>
                <td>
                    <div class="mb-1">${getStatusBadge(order.status)}</div>
                    <div>${getPaymentStatusBadge(order.payment_status)}</div>
                </td>
                <td>
                    <div class="fw-bold">${formatCurrency(order.total_amount)}</div>
                    <div>${getPaymentStatusBadge(order.payment_status)}</div>
                    <small class="text-muted">${formatPaymentMethod(order.payment_method)}</small>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-info" onclick="showOrderDetails('${order.id}')" title="Detay">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-outline-primary" onclick="editOrder('${order.id}')" title="Düzenle">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </div>
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
        
        // Tüm detay alanlarını doldur
        Object.keys(order).forEach(key => {
            const element = document.getElementById(`order-detail-${key}`);
            if (element) {
                switch(key) {
                    case 'status':
                        element.innerHTML = getStatusBadge(order[key]);
                        break;
                    case 'payment_status':
                        element.innerHTML = getPaymentStatusBadge(order[key]);
                        break;
                    case 'total_amount':
                        element.textContent = formatCurrency(order[key]);
                        break;
                    case 'payment_method':
                        element.textContent = formatPaymentMethod(order[key]);
                        break;
                    case 'items_list':
                        element.innerHTML = order[key] ? order[key].split(',').map(item => 
                            `<div class="list-group-item">${item.trim()}</div>`
                        ).join('') : '-';
                        break;
                    default:
                        element.textContent = order[key] || '-';
                }
            }
        });

        // Durum butonlarını aktif/pasif yap
        updateStatusButtons(order.status);

        // Modal göster
        const modal = new bootstrap.Modal(document.getElementById('orderDetailModal'));
        modal.show();
    } catch (error) {
        showToast('Sipariş detayları yüklenemedi', 'error');
    }
}

// Sipariş düzenleme fonksiyonu ekle
async function editOrder(orderId) {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/details`);
        if (!response.ok) throw new Error('API Hatası');
        const order = await response.json();

        // Form elemanlarını doldur
        const form = document.getElementById('editOrderForm');
        form.querySelector('[name="id"]').value = order.id;
        form.querySelector('[name="delivery_date"]').value = formatDateForInput(order.delivery_date);
        form.querySelector('[name="delivery_address"]').value = order.delivery_address;
        form.querySelector('[name="status"]').value = order.status;

        // Modalı göster
        const modal = new bootstrap.Modal(document.getElementById('editOrderModal'));
        modal.show();
    } catch (error) {
        showToast('Sipariş bilgileri yüklenemedi', 'error');
    }
}

// Form gönderme işlemi
async function updateOrder() {
    const form = document.getElementById('editOrderForm');
    const orderId = form.querySelector('[name="id"]').value;
    
    try {
        const formData = {
            delivery_date: form.querySelector('[name="delivery_date"]').value,
            delivery_address: form.querySelector('[name="delivery_address"]').value,
            status: form.querySelector('[name="status"]').value
        };

        const response = await fetch(`${API_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Güncelleme başarısız');

        // Modalı kapat
        bootstrap.Modal.getInstance(document.getElementById('editOrderModal')).hide();
        
        // Tabloyu yenile
        loadOrders();
        
        // Başarı mesajı göster
        showToast('Sipariş başarıyla güncellendi', 'success');
    } catch (error) {
        showToast('Sipariş güncellenirken hata oluştu', 'error');
    }
}

// Input için tarih formatı
function formatDateForInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // "YYYY-MM-DDThh:mm" formatı
}

// Durum badge'leri için yardımcı fonksiyonlar
function getStatusBadge(status) {
    const statusMap = {
        new: ['Yeni', 'warning'],
        preparing: ['Hazırlanıyor', 'info'],
        delivering: ['Yolda', 'primary'],
        delivered: ['Teslim Edildi', 'success'],
        cancelled: ['İptal', 'danger']
    };
    
    const [text, color] = statusMap[status] || ['Bilinmiyor', 'secondary'];
    return `<span class="badge bg-${color}">${text}</span>`;
}

function getPaymentStatusBadge(status) {
    const statusMap = {
        paid: ['Ödendi', 'success'],
        pending: ['Bekliyor', 'warning'],
        cancelled: ['İptal', 'danger']
    };
    
    const [text, color] = statusMap[status] || ['Bilinmiyor', 'secondary'];
    return `<span class="badge bg-${color}">${text}</span>`;
}

// Sipariş durumu güncelle
async function updateOrderStatus(status) {
    const orderId = document.getElementById('order-detail-id').textContent;
    
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) throw new Error('Güncelleme başarısız');

        // Status badge'i güncelle
        document.getElementById('order-detail-status').innerHTML = getStatusBadge(status);
        
        // Durum butonlarını güncelle
        updateStatusButtons(status);
        
        // Tabloyu yenile
        await loadOrders();
        
        showToast('Sipariş durumu güncellendi', 'success');
    } catch (error) {
        showToast('Durum güncellenirken hata oluştu', 'error');
    }
}

// Durum butonlarının aktif/pasif durumunu güncelle
function updateStatusButtons(currentStatus) {
    const statusFlow = ['new', 'preparing', 'ready', 'delivering', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    // Butonları bul ve güncelle
    const buttons = {
        'preparing': document.querySelector('[onclick="updateOrderStatus(\'preparing\')"]'),
        'ready': document.querySelector('[onclick="updateOrderStatus(\'ready\')"]'),
        'delivering': document.querySelector('[onclick="updateOrderStatus(\'delivering\')"]'),
        'delivered': document.querySelector('[onclick="updateOrderStatus(\'delivered\')"]')
    };

    // Her butonu kontrol et ve durumunu güncelle
    Object.entries(buttons).forEach(([status, button]) => {
        if (button) {
            const statusIndex = statusFlow.indexOf(status);
            if (statusIndex <= currentIndex) {
                button.classList.add('active', 'disabled');
                button.setAttribute('disabled', 'disabled');
            } else if (statusIndex === currentIndex + 1) {
                button.classList.remove('disabled');
                button.removeAttribute('disabled');
            } else {
                button.classList.add('disabled');
                button.setAttribute('disabled', 'disabled');
            }
        }
    });
}
