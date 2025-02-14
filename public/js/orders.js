document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadOrders();
    
    // Modal olaylarını dinle
    const orderDetailModal = document.getElementById('orderDetailModal');
    
    // Modal açılırken
    orderDetailModal.addEventListener('show.bs.modal', () => {
        // Butonların erişilebilirliğini etkinleştir
        orderDetailModal.querySelectorAll('.status-btn').forEach(btn => {
            btn.setAttribute('tabindex', '0');
        });
    });
    
    // Modal kapanırken
    orderDetailModal.addEventListener('hide.bs.modal', () => {
        // Butonların erişilebilirliğini devre dışı bırak
        orderDetailModal.querySelectorAll('.status-btn').forEach(btn => {
            btn.setAttribute('tabindex', '-1');
        });
    });
    
    // Durum butonları için event listener
    document.addEventListener('click', (e) => {
        if (e.target.closest('.status-btn')) {
            const button = e.target.closest('.status-btn');
            const status = button.dataset.status;
            updateOrderStatus(status);
        }
    });

    // Modal açıldığında inert attribute'unu kaldır
    orderDetailModal.addEventListener('shown.bs.modal', () => {
        const buttonGroup = orderDetailModal.querySelector('.btn-group');
        if (buttonGroup.hasAttribute('inert')) {
            buttonGroup.removeAttribute('inert');
        }
    });
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
        ready: ['Hazır', 'info'],
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

        // Modal ve tablo badge'lerini güncelle
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
    
    // Tüm durum butonlarını bul
    document.querySelectorAll('.status-btn').forEach(button => {
        const status = button.dataset.status;
        const statusIndex = statusFlow.indexOf(status);
        
        // Önce tüm class ve attributeleri temizle
        button.className = 'btn status-btn';
        button.removeAttribute('disabled');
        
        // Duruma göre stil uygula
        if (status === currentStatus) {
            button.classList.add('btn-' + getButtonStyle(status), 'active');
            button.setAttribute('disabled', 'true');
        } else if (statusIndex === currentIndex + 1) {
            button.classList.add('btn-outline-' + getButtonStyle(status));
        } else {
            button.classList.add('btn-outline-' + getButtonStyle(status));
            button.setAttribute('disabled', 'true');
        }
    });
}

// Buton stillerini belirle
function getButtonStyle(status) {
    const styles = {
        'preparing': 'warning',
        'ready': 'info',
        'delivering': 'primary',
        'delivered': 'success'
    };
    return styles[status] || 'secondary';
}

// Yeni sipariş modalını göster
function showNewOrderModal() {
    loadCustomers(); // Müşteri listesini yükle
    clearNewOrderForm(); // Formu temizle
    const modal = new bootstrap.Modal(document.getElementById('newOrderModal'));
    modal.show();
}

// Müşterileri yükle
async function loadCustomers() {
    try {
        const response = await fetch(`${API_URL}/customers`);
        if (!response.ok) throw new Error('API Hatası');
        const customers = await response.json();
        
        const select = document.querySelector('[name="customer_id"]');
        select.innerHTML = `
            <option value="">Müşteri Seçin</option>
            ${customers.map(customer => `
                <option value="${customer.id}">${customer.name} (${customer.phone})</option>
            `).join('')}
        `;
    } catch (error) {
        showToast('Müşteriler yüklenemedi', 'error');
    }
}

// Ürün satırı ekle
function addOrderItem() {
    const itemsContainer = document.getElementById('orderItems');
    const itemId = Date.now(); // Unique ID
    
    const itemHtml = `
        <div class="row mb-2 order-item" data-id="${itemId}">
            <div class="col-5">
                <select class="form-select form-select-sm" name="product_id" required onchange="updatePrice(${itemId})">
                    <option value="">Ürün Seçin</option>
                    <!-- Ürünler JavaScript ile doldurulacak -->
                </select>
            </div>
            <div class="col-2">
                <input type="number" class="form-control form-control-sm" name="quantity" 
                       value="1" min="1" required onchange="updatePrice(${itemId})">
            </div>
            <div class="col-3">
                <input type="text" class="form-control form-control-sm" name="price" readonly>
            </div>
            <div class="col-2">
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeOrderItem(${itemId})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    itemsContainer.insertAdjacentHTML('beforeend', itemHtml);
    loadProducts(itemId); // Ürünleri yükle
}

// Ürün satırını kaldır
function removeOrderItem(itemId) {
    document.querySelector(`.order-item[data-id="${itemId}"]`).remove();
    calculateTotals();
}

// Ürünleri yükle
async function loadProducts(itemId) {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('API Hatası');
        const products = await response.json();
        
        const select = document.querySelector(`.order-item[data-id="${itemId}"] [name="product_id"]`);
        select.innerHTML = `
            <option value="">Ürün Seçin</option>
            ${products.map(product => `
                <option value="${product.id}" data-price="${product.retail_price}">
                    ${product.name} - ${formatCurrency(product.retail_price)}
                </option>
            `).join('')}
        `;
    } catch (error) {
        showToast('Ürünler yüklenemedi', 'error');
    }
}

// Fiyatları güncelle
function updatePrice(itemId) {
    const item = document.querySelector(`.order-item[data-id="${itemId}"]`);
    const select = item.querySelector('[name="product_id"]');
    const quantity = parseInt(item.querySelector('[name="quantity"]').value) || 0;
    
    if (select.value) {
        const price = parseFloat(select.options[select.selectedIndex].dataset.price);
        item.querySelector('[name="price"]').value = formatCurrency(price * quantity);
    }
    
    calculateTotals();
}

// Toplamları hesapla
function calculateTotals() {
    let subtotal = 0;
    document.querySelectorAll('.order-item').forEach(item => {
        const select = item.querySelector('[name="product_id"]');
        const quantity = parseInt(item.querySelector('[name="quantity"]').value) || 0;
        
        if (select.value) {
            const price = parseFloat(select.options[select.selectedIndex].dataset.price);
            subtotal += price * quantity;
        }
    });
    
    const deliveryFee = 50; // Sabit teslimat ücreti
    const total = subtotal + deliveryFee;
    
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('deliveryFee').textContent = formatCurrency(deliveryFee);
    document.getElementById('totalAmount').textContent = formatCurrency(total);
}

// Formu temizle
function clearNewOrderForm() {
    document.getElementById('newOrderForm').reset();
    document.getElementById('orderItems').innerHTML = '';
    addOrderItem(); // İlk ürün satırını ekle
    calculateTotals();
}

// Siparişi kaydet
async function saveOrder() {
    const form = document.getElementById('newOrderForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    try {
        // Form verilerini topla
        const formData = {
            customer_id: form.querySelector('[name="customer_id"]').value,
            recipient_name: form.querySelector('[name="recipient_name"]').value,
            recipient_phone: form.querySelector('[name="recipient_phone"]').value,
            delivery_address: form.querySelector('[name="delivery_address"]').value,
            recipient_note: form.querySelector('[name="recipient_note"]').value,
            delivery_date: form.querySelector('[name="delivery_date"]').value,
            delivery_time_slot: form.querySelector('[name="delivery_time_slot"]').value,
            card_message: form.querySelector('[name="card_message"]').value,
            payment_method: form.querySelector('[name="payment_method"]').value,
            items: Array.from(document.querySelectorAll('.order-item')).map(item => ({
                product_id: item.querySelector('[name="product_id"]').value,
                quantity: parseInt(item.querySelector('[name="quantity"]').value)
            })).filter(item => item.product_id && item.quantity)
        };

        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Kayıt başarısız');

        // Modalı kapat
        bootstrap.Modal.getInstance(document.getElementById('newOrderModal')).hide();
        
        // Tabloyu yenile
        loadOrders();
        
        showToast('Sipariş başarıyla oluşturuldu', 'success');
    } catch (error) {
        showToast('Sipariş oluşturulurken hata oluştu', 'error');
    }
}
