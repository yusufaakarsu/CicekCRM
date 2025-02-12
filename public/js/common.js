const API_URL = 'https://cicek-crm-api.yusufaakarsu.workers.dev';

// Header yükleme fonksiyonu
async function loadHeader() {
    try {
        const response = await fetch('/common/header.html');
        const html = await response.text();
        document.getElementById('header').innerHTML = html;
        
        // Aktif sayfayı işaretle
        const currentPage = document.body.dataset.page;
        if (currentPage) {
            document.querySelector(`[data-page="${currentPage}"]`)?.classList.add('active');
        }
    } catch (error) {
        console.error('Header yüklenemedi:', error);
    }
}

// Format para birimi
function formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(amount);
}

async function fetchAPI(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) throw new Error('API Hatası');
    return response.json();
}

function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Format tarih
function formatDate(date) {
    return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Status badge oluştur
function getStatusBadge(status) {
    const statusMap = {
        new: ['Yeni', 'warning'],
        preparing: ['Hazırlanıyor', 'info'],
        delivering: ['Yolda', 'primary'],
        completed: ['Tamamlandı', 'success']
    };

    const [text, color] = statusMap[status] || ['Bilinmiyor', 'secondary'];
    return `<span class="badge bg-${color}">${text}</span>`;
}

async function loadDashboardData() {
    try {
        const [statsResponse, lowStockResponse, orderSummaryResponse] = await Promise.all([
            fetch(`${API_URL}/stats`),
            fetch(`${API_URL}/products/low-stock`),
            fetch(`${API_URL}/orders/summary`)
        ]);

        const stats = await statsResponse.json();
        const lowStock = await lowStockResponse.json();
        const orderSummary = await orderSummaryResponse.json();

        // İstatistik kartları
        document.getElementById('ordersToday').textContent = `${stats.ordersToday} Sipariş`;
        document.getElementById('pendingDeliveries').textContent = `${stats.deliveredToday}/${stats.pendingDeliveries} Teslimat`;
        document.getElementById('lowStockCount').textContent = `${stats.lowStockCount} Ürün`;

        // Teslimat programı - 3 günlük
        document.getElementById('today-orders').textContent = `${orderSummary.today} Sipariş`;
        document.getElementById('tomorrow-orders').textContent = `${orderSummary.tomorrow} Sipariş`;
        document.getElementById('future-orders').textContent = `${orderSummary.nextDay} Sipariş`;

        // Düşük stok listesi
        const lowStockList = document.getElementById('low-stock-list');
        if (lowStock.length > 0) {
            lowStockList.innerHTML = lowStock
                .map(item => `
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        <span>${item.name}</span>
                        <span class="badge bg-warning">${item.stock} adet</span>
                    </div>
                `).join('');
        } else {
            lowStockList.innerHTML = '<div class="list-group-item text-center">Düşük stok yok</div>';
        }

        // Son siparişler tablosu
        const recentOrdersTable = document.getElementById('recentOrders').getElementsByTagName('tbody')[0];
        const recentOrdersResponse = await fetch(`${API_URL}/orders/recent-detailed`);
        const recentOrders = await recentOrdersResponse.json();
        
        if (recentOrders.length > 0) {
            recentOrdersTable.innerHTML = recentOrders.map(order => `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.customer_name}</td>
                    <td>${order.items.map(item => `${item.quantity}x ${item.name}`).join('<br>')}</td>
                    <td>
                        ${formatDate(order.delivery_date)}<br>
                        <small class="text-muted">${order.delivery_address}</small>
                    </td>
                    <td>${getStatusBadge(order.status)}</td>
                    <td>${formatCurrency(order.total_amount)}</td>
                </tr>
            `).join('');
        }

        document.getElementById('status').innerHTML = `
            <i class="bi bi-check-circle"></i> Son güncelleme: ${new Date().toLocaleTimeString()}
        `;
    } catch (error) {
        document.getElementById('status').innerHTML = `
            <i class="bi bi-exclamation-triangle"></i> Bağlantı hatası!
        `;
    }
}
