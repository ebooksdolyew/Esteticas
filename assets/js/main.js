/* Atelier Derme — interações
   - menu móvel
   - acordeão do índice (tratamentos e dúvidas)
   - revelação suave ao rolar
   - formulário → WhatsApp
*/
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* Ano no rodapé */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Menu móvel */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  var setMenu = function (open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  /* Acordeão — um item aberto por vez dentro de cada [data-accordion] */
  var openItem = function (item, open) {
    item.classList.toggle('is-open', open);
    item.querySelector('.index-row').setAttribute('aria-expanded', String(open));
  };

  document.querySelectorAll('[data-accordion]').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var row = e.target.closest('.index-row');
      if (!row) return;
      var item = row.closest('.index-item');
      var willOpen = !item.classList.contains('is-open');
      group.querySelectorAll('.index-item.is-open').forEach(function (i) { openItem(i, false); });
      openItem(item, willOpen);
    });
  });

  /* Links do hero (#t-01…) abrem o tratamento correspondente */
  document.querySelectorAll('a[href^="#t-"]').forEach(function (link) {
    link.addEventListener('click', function () {
      var item = document.querySelector(link.getAttribute('href'));
      if (!item) return;
      var group = item.closest('[data-accordion]');
      group.querySelectorAll('.index-item.is-open').forEach(function (i) { openItem(i, false); });
      openItem(item, true);
    });
  });

  /* Revelação ao rolar */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Formulário → WhatsApp */
  var form = document.querySelector('form[data-whatsapp]');
  if (form) {
    var note = form.querySelector('.form-note');
    form.querySelector('button[type="submit"]').disabled = false;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid;
      form.querySelectorAll('[required]').forEach(function (input) {
        var ok = input.value.trim() !== '';
        input.closest('.field').classList.toggle('has-error', !ok);
        input.setAttribute('aria-invalid', String(!ok));
        if (!ok && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        note.textContent = 'Preencha nome e telefone.';
        firstInvalid.focus();
        return;
      }
      var d = new FormData(form);
      var lines = [
        'Olá! Gostaria de agendar uma avaliação.',
        'Nome: ' + d.get('nome'),
        'Telefone: ' + d.get('telefone'),
        'Interesse: ' + (d.get('interesse') || 'Ainda não sei')
      ];
      if (d.get('mensagem')) lines.push('Mensagem: ' + d.get('mensagem'));
      var url = 'https://wa.me/' + form.dataset.whatsapp + '?text=' + encodeURIComponent(lines.join('\n'));
      note.textContent = 'Abrindo o WhatsApp…';
      window.open(url, '_blank', 'noopener');
    });
  }
})();
