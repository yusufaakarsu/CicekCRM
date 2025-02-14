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

        const response = await fetch(`${API_URL}/orders`); // Şimdilik basit sorgu
        if (!response.ok) throw new Error('API Hatası');
        const orders = await response.json();

        renderOrders(orders);
        renderPagination(orders.length);

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
                <a class="page-link" href="#" onclick="event.preventDefault(); changePage(${currentPage - 1})">Önceki</a>
            </li>
        `;

        // Sayfa numaraları
        for (let i = 1; i <= totalPages; i++) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="event.preventDefault(); changePage(${i})">${i}</a>
                </li>
            `;
        }

        // Sonraki sayfa
        html += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="event.preventDefault(); changePage(${currentPage + 1})">Sonraki</a>
            </li>
        `;
    }

    pagination.innerHTML = html;
}

function changePage(page) {
    if (page < 1) return;
    currentPage = page;
    loadOrders();
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
