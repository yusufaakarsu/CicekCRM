document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadCustomers();
});

let customerModal;

async function loadCustomers() {
    try {
        const response = await fetch(`${API_URL}/customers`);
        if (!response.ok) throw new Error('API Hatası');
        const customers = await response.json();

        const tbody = document.querySelector('#customersTable tbody');
        
        if (customers.length > 0) {
            tbody.innerHTML = customers.map(customer => `
                <tr>
                    <td>${customer.name}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.email || '-'}</td>
                    <td>${customer.address}</td>
                    <td>${customer.last_order ? formatDate(customer.last_order) : 'Sipariş yok'}</td>
                    <td>${customer.total_orders || 0}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="showCustomerDetails(${customer.id})">
                            <i class="bi bi-info-circle"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning me-1" onclick="editCustomer(${customer.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="newOrder(${customer.id})">
                            <i class="bi bi-plus-lg"></i> Sipariş
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Müşteri bulunamadı</td></tr>';
        }
    } catch (error) {
        console.error('Müşteriler yüklenirken hata:', error);
        showError('Müşteriler yüklenemedi!');
    }
}

function showAddCustomerModal() {
    customerModal = new bootstrap.Modal(document.getElementById('addCustomerModal'));
    document.getElementById('addCustomerForm').reset();
    customerModal.show();
}

async function saveCustomer() {
    const form = document.getElementById('addCustomerForm');
    const formData = new FormData(form);
    
    try {
        const response = await fetch(`${API_URL}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });

        if (!response.ok) throw new Error('API Hatası');

        customerModal.hide();
        loadCustomers();
        showSuccess('Müşteri başarıyla eklendi!');
    } catch (error) {
        console.error('Müşteri eklenirken hata:', error);
        showError('Müşteri eklenemedi!');
    }
}

function showError(message) {
    // Toast veya alert ile hata göster
    alert(message);
}

function showSuccess(message) {
    // Toast veya alert ile başarı mesajı göster
    alert(message);
}

function showCustomerDetails(customerId) {
    // Müşteri detay modalını göster
    // TODO: Implement customer details view
}

function editCustomer(customerId) {
    // Müşteri düzenleme modalını göster
    // TODO: Implement customer edit
}

function newOrder(customerId) {
    // Yeni sipariş sayfasına yönlendir
    window.location.href = `/orders/new?customer=${customerId}`;
}
