// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
        });

        // Close menu when a link is clicked
        links.querySelectorAll('a:not(.coming-soon):not(.nav-dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                links.classList.remove('open');
            });
        });
    }

    // Tooltip for coming soon links
    document.querySelectorAll('.coming-soon').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
        });
        link.setAttribute('title', 'Coming soon');
    });
});

// Grants dropdown (mobile: tap to expand; desktop: CSS hover)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggle.closest('.nav-dropdown').classList.toggle('open');
        });
    });
});

// Grant application form — repeatable fields + submit via Web3Forms without leaving the page
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('grant-form');
    const status = document.getElementById('form-status');
    if (!form || !status) return;

    // Build a new input row (input + remove button) mirroring the first one
    function makeRow(template) {
        const row = document.createElement('div');
        row.className = 'repeat-row';
        const input = document.createElement('input');
        input.type = template.type || 'text';
        input.className = 'repeat-input';
        input.placeholder = template.placeholder || '';
        const mode = template.getAttribute('inputmode');
        if (mode) input.setAttribute('inputmode', mode);
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'repeat-remove';
        remove.setAttribute('aria-label', 'Remove');
        remove.textContent = '\u00D7';
        remove.addEventListener('click', () => row.remove());
        row.appendChild(input);
        row.appendChild(remove);
        return row;
    }

    // "Add another" buttons
    form.querySelectorAll('.repeat-add').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.closest('.form-group').querySelector('.repeat-group');
            const row = makeRow(group.querySelector('.repeat-input'));
            group.appendChild(row);
            row.querySelector('.repeat-input').focus();
        });
    });

    // Gather each repeatable group's values into its hidden field before sending
    function collectRepeats() {
        form.querySelectorAll('.repeat-group').forEach(group => {
            const hidden = group.closest('.form-group').querySelector('.repeat-hidden');
            if (!hidden) return;
            const values = Array.from(group.querySelectorAll('.repeat-input'))
                .map(i => i.value.trim())
                .filter(Boolean);
            hidden.value = values.join('\n');
        });
    }

    // Build a safe email subject from the org name (attacker-controlled input)
    function setSubject() {
        const subjectField = form.querySelector('[name="subject"]');
        if (!subjectField) return;
        const base = '[New grant application] from akhiezer.org';
        const orgEl = document.getElementById('org_name');
        let org = orgEl ? orgEl.value : '';
        // Strip control chars / newlines (header-injection hygiene), collapse
        // whitespace, trim, and cap length.
        org = org
            .replace(/[\u0000-\u001F\u007F]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 60);
        subjectField.value = org
            ? '[New grant application] from ' + org
            : base;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        collectRepeats();
        setSubject();
        status.className = 'form-status';
        status.textContent = 'Sending… · Надсилання…';

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                form.style.display = 'none';
                status.className = 'form-status success';
                status.textContent = 'Thank you — your application has been received. We will be in touch. · Дякуємо — вашу заявку отримано. Ми зв\u2019яжемося з вами.';
            } else {
                status.className = 'form-status error';
                status.textContent = 'Something went wrong. Please email contact@akhiezer.org. · Сталася помилка. Напишіть, будь ласка, на contact@akhiezer.org.';
            }
        } catch (err) {
            status.className = 'form-status error';
            status.textContent = 'Something went wrong. Please email contact@akhiezer.org. · Сталася помилка. Напишіть, будь ласка, на contact@akhiezer.org.';
        }
    });
});
