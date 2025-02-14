document.addEventListener('DOMContentLoaded', function() {
    loadTodayDeliveries();
    initializeCalendar();
    
    // Header'ı yükle
    fetch('/common/header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header').innerHTML = html;
            document.querySelector('[data-page="calendar"]').classList.add('active');
        });
});

async function loadTodayDeliveries() {
    try {
        const response = await fetch(`${API_URL}/calendar/today`);
        const deliveries = await response.json();
        
        const container = document.getElementById('todayDeliveries');
        document.getElementById('todayCount').textContent = deliveries.length;

        if (deliveries.length === 0) {
            container.innerHTML = '<div class="list-group-item text-center py-4">Bugün teslimat yok</div>';
            return;
        }

        container.innerHTML = deliveries.map(delivery => `
            <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">${delivery.recipient_name}</h6>
                    <small>${formatTime(delivery.delivery_date)}</small>
                </div>
                <p class="mb-1">${delivery.delivery_address}</p>
                <small class="text-muted">${delivery.notes || ''}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Teslimatlar yüklenemedi:', error);
    }
}

function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'tr',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
        },
        buttonText: {
            today: 'Bugün',
            month: 'Ay',
            week: 'Hafta'
        },
        events: function(info, successCallback, failureCallback) {
            fetch(`${API_URL}/calendar/events?start=${info.startStr}&end=${info.endStr}`)
                .then(response => response.json())
                .then(events => {
                    successCallback(
                        events.map(event => ({
                            title: event.recipient_name,
                            start: event.delivery_date,
                            className: `status-${event.status}`,
                            extendedProps: {
                                customer: event.customer_name,
                                address: event.delivery_address,
                                status: event.status
                            }
                        }))
                    );
                })
                .catch(failureCallback);
        },
        eventDidMount: function(info) {
            // Teslimat detay tooltip'i
            const delivery = info.event.extendedProps;
            tippy(info.el, {
                content: `
                    <div class="p-2">
                        <div class="fw-bold">${info.event.title}</div>
                        <div class="text-muted">${delivery.customer}</div>
                        <div class="small">${delivery.address}</div>
                        <div class="badge bg-${getStatusColor(delivery.status)}">${getStatusText(delivery.status)}</div>
                    </div>
                `,
                allowHTML: true,
                placement: 'top',
                theme: 'light-border'
            });
        },

        eventClick: function(info) {
            showDeliveryDetails(info.event.id);
        },

        eventClassNames: function(arg) {
            return [`delivery-status-${arg.event.extendedProps.status}`];
        }
    });

    calendar.render();
}

async function showDeliveryDetails(deliveryId) {
    try {
        const response = await fetch(`${API_URL}/orders/${deliveryId}/details`);
        const delivery = await response.json();

        // Modal içeriği
        const modal = new bootstrap.Modal(document.getElementById('deliveryModal'));
        document.getElementById('delivery-details').innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h6>Teslimat Bilgileri</h6>
                    <dl class="row mb-0">
                        <dt class="col-sm-4">Alıcı:</dt>
                        <dd class="col-sm-8">${delivery.recipient_name}</dd>
                        
                        <dt class="col-sm-4">Telefon:</dt>
                        <dd class="col-sm-8">${delivery.recipient_phone}</dd>
                        
                        <dt class="col-sm-4">Adres:</dt>
                        <dd class="col-sm-8">${delivery.delivery_address}</dd>
                        
                        <dt class="col-sm-4">Saat:</dt>
                        <dd class="col-sm-8">${formatDeliveryTime(delivery.delivery_time_slot)}</dd>
                        
                        <dt class="col-sm-4">Not:</dt>
                        <dd class="col-sm-8">${delivery.delivery_notes || '-'}</dd>
                    </dl>
                </div>
            </div>
        `;
        modal.show();
    } catch (error) {
        console.error('Teslimat detayları alınamadı:', error);
    }
}

function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}
