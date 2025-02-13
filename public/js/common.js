// API URL'ini düzelt
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
        const response = await fetch(`${API_URL}/api/dashboard`);
        if (!response.ok) throw new Error('API Hatası');
        const data = await response.json();

        // İstatistik kartları güncelleme
        document.getElementById('ordersToday').textContent = `${data.deliveryStats.total_orders} Sipariş`;
        document.getElementById('pendingDeliveries').textContent = 
            `${data.deliveryStats.delivered_orders} / ${data.deliveryStats.total_orders} Teslimat`;

        // Yarının ürün ihtiyaçları
        const stockList = document.getElementById('low-stock-list');
        if (data.tomorrowNeeds.results && data.tomorrowNeeds.results.length > 0) {
            stockList.innerHTML = data.tomorrowNeeds.results.map(item => `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <span>${item.name}</span>
                    <span>İhtiyaç: ${item.needed_quantity} adet</span>
                </div>
            `).join('');
        }

        // Teslimat programı güncelleme
        const summary = data.orderSummary.results;
        if (summary && summary.length >= 3) {
            document.getElementById('today-orders').textContent = `${summary[0].count} Sipariş`;
            document.getElementById('tomorrow-orders').textContent = `${summary[1].count} Sipariş`;
            document.getElementById('future-orders').textContent = `${summary[2].count} Sipariş`;
        }

        // Düşük stok sayısı
        document.getElementById('lowStockCount').textContent = `${data.lowStock} Ürün`;

        document.getElementById('status').innerHTML = `
            <i class="bi bi-check-circle"></i> Son güncelleme: ${new Date().toLocaleTimeString()}
        `;
    } catch (error) {
        console.error('Dashboard hatası:', error);
        document.getElementById('status').innerHTML = `
            <i class="bi bi-exclamation-triangle"></i> Bağlantı hatası!
        `;
    }
}

async function loadRecentOrders() {
    try {
        const response = await fetch(`${API_URL}/orders/recent-detailed`);
        if (!response.ok) throw new Error('API Hatası');
        const orders = await response.json();
        
        const recentOrdersTable = document.getElementById('recentOrders').getElementsByTagName('tbody')[0];
        
        if (orders && orders.length > 0) {
            recentOrdersTable.innerHTML = orders.map(order => `
                <tr>
                    <td>${order.customer_name}</td>
                    <td>${order.items ? order.items.map(item => `${item.quantity}x ${item.name}`).join('<br>') : '-'}</td>
                    <td>
                        ${formatDate(order.delivery_date)}<br>
                        <small class="text-muted">${order.delivery_address}</small>
                    </td>
                    <td>${getStatusBadge(order.status)}</td>
                    <td>${formatCurrency(order.total_amount)}</td>
                </tr>
            `).join('');
        } else {
            recentOrdersTable.innerHTML = '<tr><td colspan="5" class="text-center">Sipariş bulunamadı</td></tr>';
        }
    } catch (error) {
        console.error('Recent orders error:', error);
        document.getElementById('recentOrders').getElementsByTagName('tbody')[0].innerHTML = 
            '<tr><td colspan="5" class="text-center text-danger">Siparişler yüklenirken hata oluştu!</td></tr>';
    }
}
