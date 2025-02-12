document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    loadTodayDeliveries();
});

async function loadTodayDeliveries() {
    try {
        const response = await fetch(`${API_URL}/orders/today`);
        const deliveries = await response.json();
        
        const container = document.getElementById('todayDeliveries');
        document.getElementById('todayCount').textContent = deliveries.length;

        if (deliveries.length === 0) {
            container.innerHTML = `
                <div class="list-group-item text-center text-muted py-4">
                    Bugün teslimat yok
                </div>
            `;
            return;
        }

        container.innerHTML = deliveries.map(delivery => `
            <div class="list-group-item delivery-item ${delivery.time_slot}">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <div class="fw-bold">${delivery.recipient_name}</div>
                        <small>${delivery.delivery_address}</small>
                    </div>
                    <span class="badge bg-secondary">${formatTime(delivery.delivery_time)}</span>
                </div>
                <div class="mt-2">
                    <small class="text-muted">${delivery.notes || ''}</small>
                </div>
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
        firstDay: 1,
        height: 'auto',
        eventClick: function(info) {
            // Sipariş detaylarını göster
            showOrderDetails(info.event.id);
        },
        events: async function(fetchInfo, successCallback, failureCallback) {
            try {
                const response = await fetch(`${API_URL}/orders/calendar?start=${fetchInfo.startStr}&end=${fetchInfo.endStr}`);
                const events = await response.json();
                successCallback(events.map(event => ({
                    id: event.id,
                    title: event.recipient_name,
                    start: event.delivery_date,
                    className: `status-${event.status}`,
                    extendedProps: {
                        status: event.status,
                        address: event.delivery_address
                    }
                })));
            } catch (error) {
                failureCallback(error);
            }
        }
    });

    calendar.render();
}

function formatTime(time) {
    return new Date(time).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}
