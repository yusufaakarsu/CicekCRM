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
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today: 'Bugün',
            month: 'Ay',
            week: 'Hafta',
            day: 'Gün'
        },
        views: {
            timeGridDay: {
                titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
                allDaySlot: false,
                slotMinTime: '09:00:00',
                slotMaxTime: '21:00:00',
                slotDuration: '01:00:00',
            },
            timeGridWeek: {
                titleFormat: { year: 'numeric', month: 'long' },
                allDaySlot: false,
                slotMinTime: '09:00:00',
                slotMaxTime: '21:00:00',
                slotDuration: '01:00:00',
            },
            dayGridMonth: {
                titleFormat: { year: 'numeric', month: 'long' },
                dayMaxEvents: true,
            }
        },
        events: function(info, successCallback, failureCallback) {
            fetch(`${API_URL}/calendar/events?start=${info.startStr}&end=${info.endStr}`)
                .then(response => response.json())
                .then(events => {
                    const formattedEvents = events.map(event => {
                        const timeSlots = {
                            'morning': '09:00',
                            'afternoon': '13:00',
                            'evening': '17:00'
                        };
                        
                        // Teslimat tarihini ve saatini birleştir
                        const deliveryDate = event.delivery_date.split('T')[0];
                        const deliveryTime = timeSlots[event.delivery_time_slot] || '09:00';
                        const start = `${deliveryDate}T${deliveryTime}`;

                        return {
                            id: event.id,
                            title: event.recipient_name,
                            start: start,
                            className: `delivery-status-${event.status}`,
                            extendedProps: {
                                timeSlot: event.delivery_time_slot,
                                customer: event.customer_name,
                                address: event.delivery_address,
                                status: event.status,
                                items: event.items_list
                            }
                        };
                    });

                    // Ay görünümü için siparişleri grupla
                    if (info.view.type === 'dayGridMonth') {
                        const groupedEvents = formattedEvents.reduce((acc, event) => {
                            const date = event.start.split('T')[0];
                            if (!acc[date]) acc[date] = [];
                            acc[date].push(event);
                            return acc;
                        }, {});

                        const monthEvents = Object.entries(groupedEvents).map(([date, events]) => ({
                            start: date,
                            title: `${events.length} Sipariş`,
                            className: 'month-view-event',
                            extendedProps: {
                                events: events
                            }
                        }));

                        successCallback(monthEvents);
                    } else {
                        successCallback(formattedEvents);
                    }
                })
                .catch(failureCallback);
        },
        eventContent: function(arg) {
            if (arg.view.type === 'dayGridMonth') {
                return {
                    html: `<div class="fc-event-count">${arg.event.title}</div>`
                };
            }

            const timeSlotIcons = {
                'morning': '🌅',
                'afternoon': '🌞',
                'evening': '🌙'
            };

            const icon = timeSlotIcons[arg.event.extendedProps.timeSlot] || '';
            return {
                html: `
                    <div class="fc-event-time">${icon} ${arg.timeText}</div>
                    <div class="fc-event-title">${arg.event.title}</div>
                `
            };
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

async function showDeliveryDetails(orderId) {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/details`);
        if (!response.ok) throw new Error('API Hatası');
        const order = await response.json();

        // Modal içeriğini doldur
        document.getElementById('modal-customer-name').textContent = order.customer_name || '-';
        document.getElementById('modal-customer-phone').textContent = order.customer_phone || '-';
        document.getElementById('modal-delivery-date').textContent = formatDate(order.delivery_date);
        document.getElementById('modal-delivery-time').textContent = formatDeliveryTime(order.delivery_time_slot);
        document.getElementById('modal-order-status').innerHTML = getStatusBadge(order.status);
        document.getElementById('modal-recipient-name').textContent = order.recipient_name || '-';
        document.getElementById('modal-recipient-phone').textContent = order.recipient_phone || '-';
        document.getElementById('modal-delivery-address').textContent = order.delivery_address || '-';
        document.getElementById('modal-recipient-note').textContent = order.recipient_note || '-';

        // Ürün listesini doldur
        const itemsContainer = document.getElementById('modal-order-items');
        if (order.items_list) {
            itemsContainer.innerHTML = order.items_list.split(',').map(item => `
                <div class="list-group-item">
                    <i class="bi bi-flower1"></i> ${item.trim()}
                </div>
            `).join('');
        } else {
            itemsContainer.innerHTML = '<div class="list-group-item">Ürün bilgisi bulunamadı</div>';
        }

        // Durum butonlarını güncelle
        updateStatusButtons(order.status);

        // Modalı göster
        const modal = new bootstrap.Modal(document.getElementById('orderDetailModal'));
        modal.show();
    } catch (error) {
        console.error('Sipariş detayları alınamadı:', error);
        alert('Sipariş detayları yüklenirken hata oluştu');
    }
}

function updateStatusButtons(currentStatus) {
    const statusFlow = ['new', 'preparing', 'ready', 'delivering', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    document.querySelectorAll('.modal-footer .btn').forEach(button => {
        const action = button.dataset.action;
        const actionIndex = statusFlow.indexOf(action);
        
        button.disabled = actionIndex <= currentIndex;
        if (action === currentStatus) {
            button.classList.remove('btn-outline-' + getButtonStyle(action));
            button.classList.add('btn-' + getButtonStyle(action));
        }
    });
}

function getButtonStyle(status) {
    const styles = {
        'preparing': 'warning',
        'ready': 'info',
        'delivering': 'primary',
        'delivered': 'success'
    };
    return styles[status] || 'secondary';
}

function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}
