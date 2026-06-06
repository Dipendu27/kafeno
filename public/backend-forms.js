(function () {
  const cafePhone = '7003148840';
  const cafeEmail = 'kafenocafebistro@gmail.com';
  const tomorrow = () => {
    const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return date.toISOString().slice(0, 10);
  };

  const timeOptions = [
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '04:00 PM',
    '06:00 PM',
    '07:30 PM',
    '09:00 PM',
  ];

  const field = ({ label, name, type = 'text', required = true, attrs = '', options = null, wide = false }) => {
    if (options) {
      return `
        <label class="backend-field${wide ? ' backend-field-full' : ''}">
          <span>${label}</span>
          <select name="${name}" ${required ? 'required' : ''} ${attrs}>
            ${options.map((option) => `<option value="${option}">${option}</option>`).join('')}
          </select>
        </label>
      `;
    }

    return `
      <label class="backend-field${wide ? ' backend-field-full' : ''}">
        <span>${label}</span>
        <input name="${name}" type="${type}" ${required ? 'required' : ''} ${attrs} />
      </label>
    `;
  };

  const formShell = ({ eyebrow, title, accent, description, cardTitle, formId, fields, help }) => `
    <section class="backend-form-section" data-backend-route="${location.pathname}">
      <div class="backend-form-shell">
        <div class="backend-form-copy">
          <a class="backend-back-link" href="/">Back Home</a>
          <div class="backend-eyebrow">${eyebrow}</div>
          <h1>${title} <em>${accent}</em></h1>
          <p>${description}</p>
          <div class="backend-contact-strip">
            <span>Phone: ${cafePhone}</span>
            <span>Email: ${cafeEmail}</span>
          </div>
        </div>
        <div class="backend-card">
          <h2>${cardTitle}</h2>
          <form id="${formId}" class="backend-form-grid">
            ${fields}
            <div class="backend-actions backend-field-full">
              <button class="backend-submit" type="submit">Submit Request</button>
              <span class="backend-status" aria-live="polite"></span>
            </div>
          </form>
          <p class="backend-help">${help}</p>
        </div>
      </div>
    </section>
  `;

  const reservationMarkup = () => formShell({
    eyebrow: 'Reserve a Table',
    title: 'Your seat',
    accent: 'awaits.',
    description: 'Send your preferred date, time, and guest count. The Kafeno team will confirm your table by phone or email.',
    cardTitle: 'Reservation details',
    formId: 'kafeno-reservation-form',
    fields: [
      field({ label: 'Full Name', name: 'name', attrs: 'autocomplete="name"' }),
      field({ label: 'Phone Number', name: 'phone', type: 'tel', attrs: `placeholder="${cafePhone}" autocomplete="tel"` }),
      field({ label: 'Email', name: 'email', type: 'email', required: false, attrs: `placeholder="${cafeEmail}" autocomplete="email"` }),
      field({ label: 'Guests', name: 'guests', type: 'number', attrs: 'min="1" max="30" value="2"' }),
      field({ label: 'Date', name: 'date', type: 'date', attrs: `min="${new Date().toISOString().slice(0, 10)}" value="${tomorrow()}"` }),
      field({ label: 'Time', name: 'time', options: timeOptions }),
      field({ label: 'Occasion', name: 'occasion', required: false, attrs: 'placeholder="Birthday, meeting, date night..."', wide: true }),
      `
        <label class="backend-field backend-field-full">
          <span>Special Notes</span>
          <textarea name="notes" placeholder="Any seating preference, allergy note, or celebration detail?"></textarea>
        </label>
      `,
    ].join(''),
    help: 'Your request is stored securely in the backend. Confirmation is handled manually by the cafe team.',
  });

  const takeawayMarkup = () => formShell({
    eyebrow: 'Takeaway Order',
    title: 'Kafeno',
    accent: 'to go.',
    description: 'Tell us what you would like and when you want to collect it. The team will call or email back to confirm availability.',
    cardTitle: 'Pickup details',
    formId: 'kafeno-takeaway-form',
    fields: [
      field({ label: 'Full Name', name: 'name', attrs: 'autocomplete="name"' }),
      field({ label: 'Phone Number', name: 'phone', type: 'tel', attrs: `placeholder="${cafePhone}" autocomplete="tel"` }),
      field({ label: 'Email', name: 'email', type: 'email', required: false, attrs: `placeholder="${cafeEmail}" autocomplete="email"` }),
      field({ label: 'Pickup Date', name: 'pickupDate', type: 'date', attrs: `min="${new Date().toISOString().slice(0, 10)}" value="${new Date().toISOString().slice(0, 10)}"` }),
      field({ label: 'Pickup Time', name: 'pickupTime', options: timeOptions }),
      `
        <label class="backend-field backend-field-full">
          <span>Items</span>
          <textarea name="items" required placeholder="Example: 2 cappuccinos, 1 tiramisu, 1 pesto pasta"></textarea>
        </label>
      `,
      `
        <label class="backend-field backend-field-full">
          <span>Notes</span>
          <textarea name="notes" placeholder="Packaging, spice level, allergies, or pickup instructions"></textarea>
        </label>
      `,
    ].join(''),
    help: 'This sends an order request, not an instant paid order. The cafe will confirm before preparation.',
  });

  const routeMarkup = () => {
    if (location.pathname === '/reserve') return reservationMarkup();
    if (location.pathname === '/takeaway') return takeawayMarkup();
    return null;
  };

  const renderBackendForm = () => {
    const markup = routeMarkup();
    if (!markup) return;

    const main = document.querySelector('main');
    const section = main && main.querySelector('section');
    if (!main || !section) {
      window.setTimeout(renderBackendForm, 80);
      return;
    }

    if (section.getAttribute('data-backend-route') === location.pathname) return;
    section.outerHTML = markup;
  };

  const submitJson = async (form, endpoint) => {
    const status = form.querySelector('.backend-status');
    const button = form.querySelector('.backend-submit');
    const data = Object.fromEntries(new FormData(form).entries());

    status.textContent = 'Sending...';
    status.dataset.tone = '';
    button.disabled = true;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Could not submit right now.');
      }

      form.reset();
      status.textContent = `${result.message} Reference: ${result.id}`;
      status.dataset.tone = 'success';
    } catch (error) {
      status.textContent = error.message || 'Could not submit right now.';
      status.dataset.tone = 'error';
    } finally {
      button.disabled = false;
    }
  };

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    if (form.id === 'kafeno-reservation-form') {
      event.preventDefault();
      submitJson(form, '/api/reservations');
    }

    if (form.id === 'kafeno-takeaway-form') {
      event.preventDefault();
      submitJson(form, '/api/takeaway');
    }
  });

  const notifyRouteChange = () => window.setTimeout(renderBackendForm, 80);
  for (const method of ['pushState', 'replaceState']) {
    const original = history[method];
    history[method] = function (...args) {
      const result = original.apply(this, args);
      notifyRouteChange();
      return result;
    };
  }

  window.addEventListener('popstate', notifyRouteChange);
  window.addEventListener('DOMContentLoaded', notifyRouteChange);
  notifyRouteChange();
})();
