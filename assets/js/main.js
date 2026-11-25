/* ==========================================================================
   Atelier Derme — main.js (arquivo único de interações)
   --------------------------------------------------------------------------
   1. Utilidades
   2. Ano no rodapé
   3. Cabeçalho: estado ao rolar + barra de progresso
   4. Menu móvel (Esc, clique fora, trava de rolagem, foco preso)
   5. Navegação ativa (scrollspy)
   6. Acordeões (teclado, links profundos, atalhos do hero)
   7. Revelação suave ao rolar (com escalonamento)
   8. Barra fixa de agendamento no celular
   9. Efeitos de rolagem entre seções (variáveis --enter/--progress/--exit)
  10. Formulário → WhatsApp (máscara, validação, pré-seleção)
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  /* 1. Utilidades ---------------------------------------------------------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileQuery = window.matchMedia('(max-width: 760px)');
  var hasIO = 'IntersectionObserver' in window;

  var rafThrottle = function (fn) {
    var queued = false;
    return function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; fn(); });
    };
  };

  var scrollToEl = function (el) {
    el.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
  };

  /* 2. Ano no rodapé ------------------------------------------------------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* 3. Cabeçalho + progresso de leitura ------------------------------------ */
  var header = $('.site-header');
  var progress = document.createElement('span');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  if (header) header.appendChild(progress);

  var onScroll = rafThrottle(function () {
    var y = window.scrollY;
    var max = root.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* 4. Menu móvel ---------------------------------------------------------- */
  var toggle = $('.nav-toggle');
  var nav = $('#nav');

  if (toggle && nav) {
    var isOpen = function () { return toggle.getAttribute('aria-expanded') === 'true'; };
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      nav.classList.toggle('is-open', open);
      root.classList.toggle('menu-open', open);
    };

    toggle.addEventListener('click', function () { setMenu(!isOpen()); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

    document.addEventListener('click', function (e) {
      if (isOpen() && !e.target.closest('.site-header')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (!isOpen()) return;
      if (e.key === 'Escape') { setMenu(false); toggle.focus(); return; }
      if (e.key !== 'Tab') return;
      // Mantém o foco entre o botão e os links enquanto o menu está aberto
      var items = [toggle].concat($$('a', nav));
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    var onBreakpoint = function (e) { if (!e.matches) setMenu(false); };
    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', onBreakpoint);
    else mobileQuery.addListener(onBreakpoint);
  }

  /* 5. Navegação ativa ----------------------------------------------------- */
  var navLinks = $$('.nav-links a[href^="#"]');
  if (hasIO && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var sections = Object.keys(byId).map(function (id) { return document.getElementById(id); }).filter(Boolean);

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
        byId[entry.target.id].setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });

    // Limpa o destaque quando o topo da página volta à tela
    var hero = $('.hero');
    if (hero) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
      }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
    }
  }

  /* 6. Acordeões ----------------------------------------------------------- */
  var setItem = function (item, open) {
    item.classList.toggle('is-open', open);
    $('.index-row', item).setAttribute('aria-expanded', String(open));
  };
  var openOnly = function (item) {
    var group = item.closest('[data-accordion]');
    if (!group) return;
    $$('.index-item.is-open', group).forEach(function (i) { if (i !== item) setItem(i, false); });
    setItem(item, true);
  };

  $$('[data-accordion]').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var row = e.target.closest('.index-row');
      if (!row) return;
      var item = row.closest('.index-item');
      if (item.classList.contains('is-open')) setItem(item, false);
      else openOnly(item);
    });

    // Setas, Home e End navegam entre as perguntas/tratamentos
    group.addEventListener('keydown', function (e) {
      var row = e.target.closest('.index-row');
      if (!row) return;
      var rows = $$('.index-row', group);
      var i = rows.indexOf(row);
      var next = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: rows.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      rows[(next + rows.length) % rows.length].focus();
    });
  });

  // Atalhos (#t-01…) e links diretos abrem o item correspondente
  var openFromHash = function (hash, scroll) {
    if (!hash || hash.length < 2) return;
    var target;
    try { target = $(hash); } catch (err) { return; }
    var item = target && target.closest('.index-item');
    if (!item) return;
    openOnly(item);
    if (scroll) scrollToEl(item);
  };

  $$('a[href^="#t-"], a[href^="#f-"]').forEach(function (link) {
    link.addEventListener('click', function () { openFromHash(link.getAttribute('href'), false); });
  });
  openFromHash(window.location.hash, true);
  window.addEventListener('hashchange', function () { openFromHash(window.location.hash, false); });

  /* 7. Revelação ao rolar -------------------------------------------------- */
  var reveals = $$('.reveal');
  // Escalona elementos irmãos para entrarem em sequência
  reveals.forEach(function (el) {
    var siblings = $$(':scope > .reveal', el.parentElement);
    el.style.setProperty('--reveal-delay', (siblings.indexOf(el) * 90) + 'ms');
  });

  if (hasIO && !reduceMotion.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* 8. Barra fixa de agendamento (celular) --------------------------------- */
  var dock = $('.mobile-cta');
  var heroSection = $('.hero');
  var contact = $('#agendar');
  if (dock && hasIO && heroSection && contact) {
    var heroVisible = true;
    var contactVisible = false;
    var updateDock = function () {
      var show = !heroVisible && !contactVisible;
      dock.classList.toggle('is-visible', show);
      dock.toggleAttribute('inert', !show);
    };
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; updateDock(); }).observe(heroSection);
    new IntersectionObserver(function (e) { contactVisible = e[0].isIntersecting; updateDock(); }, { threshold: 0.1 }).observe(contact);
    updateDock();
  }

  /* 9. Efeitos de rolagem entre seções -------------------------------------
     Cada [data-scroll] recebe três variáveis CSS, de 0 a 1:
       --enter    a seção chegando (topo no pé da tela → topo a 35% da altura)
       --progress a travessia completa da seção pela tela
       --exit     a seção saindo pelo topo
     O CSS decide o que fazer com elas (seção 14b do style.css). */
  var scrollFx = $$('[data-scroll]');
  if (scrollFx.length && !reduceMotion.matches) {
    root.classList.add('has-scroll-fx');
    var clamp01 = function (n) { return n < 0 ? 0 : n > 1 ? 1 : n; };
    var active = scrollFx.slice();

    var measure = function (el) {
      var vh = window.innerHeight;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--enter', clamp01((vh - r.top) / (vh * .65)).toFixed(4));
      el.style.setProperty('--progress', clamp01((vh - r.top) / (vh + r.height)).toFixed(4));
      el.style.setProperty('--exit', clamp01(-r.top / r.height).toFixed(4));
    };
    var updateFx = rafThrottle(function () { active.forEach(measure); });

    scrollFx.forEach(measure);
    if (hasIO) {
      // Só recalcula as seções próximas da tela
      active = [];
      var fxObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var i = active.indexOf(entry.target);
          if (entry.isIntersecting && i < 0) active.push(entry.target);
          if (!entry.isIntersecting && i > -1) { active.splice(i, 1); measure(entry.target); }
        });
        updateFx();
      }, { rootMargin: '15% 0px' });
      scrollFx.forEach(function (el) { fxObserver.observe(el); });
    }
    window.addEventListener('scroll', updateFx, { passive: true });
    window.addEventListener('resize', updateFx);
  }

  /* 10. Formulário → WhatsApp ---------------------------------------------- */
  var form = $('form[data-whatsapp]');
  if (!form) return;

  var note = $('.form-note', form);
  var submit = $('button[type="submit"]', form);
  var phone = $('#telefone', form);
  var select = $('#interesse', form);
  submit.disabled = false;

  // Máscara de telefone brasileiro: (00) 0000-0000 ou (00) 00000-0000
  var digits = function (v) { return v.replace(/\D/g, '').slice(0, 11); };
  var formatPhone = function (v) {
    var d = digits(v);
    if (d.length === 0) return '';
    if (d.length <= 2) return '(' + d;
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  };

  var rules = {
    nome: function (v) { return v.trim().length >= 2 ? '' : 'Informe seu nome.'; },
    telefone: function (v) { return digits(v).length >= 10 ? '' : 'Informe um telefone com DDD.'; }
  };

  var validate = function (input) {
    var rule = rules[input.name];
    if (!rule) return true;
    var msg = rule(input.value);
    var field = input.closest('.field');
    var error = $('.field-error', field);
    field.classList.toggle('has-error', !!msg);
    field.classList.toggle('is-valid', !msg && input.value.trim() !== '');
    input.setAttribute('aria-invalid', String(!!msg));
    if (error) error.textContent = msg;
    return !msg;
  };

  if (phone) {
    phone.addEventListener('input', function () {
      var atEnd = phone.selectionStart === phone.value.length;
      phone.value = formatPhone(phone.value);
      if (atEnd) phone.setSelectionRange(phone.value.length, phone.value.length);
    });
  }

  Object.keys(rules).forEach(function (name) {
    var input = form.elements[name];
    if (!input) return;
    // Valida ao sair do campo; depois de um erro, corrige em tempo real
    input.addEventListener('blur', function () { if (input.value) validate(input); });
    input.addEventListener('input', function () {
      if (input.closest('.field').classList.contains('has-error')) validate(input);
    });
  });

  // Botões "Agendar este tratamento" pré-selecionam o interesse
  $$('[data-treatment]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (select) select.value = link.getAttribute('data-treatment');
      window.setTimeout(function () { $('#nome', form).focus({ preventScroll: true }); }, reduceMotion.matches ? 0 : 600);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var invalid = Object.keys(rules)
      .map(function (name) { return form.elements[name]; })
      .filter(function (input) { return input && !validate(input); });

    if (invalid.length) {
      note.textContent = invalid.length > 1 ? 'Preencha nome e telefone para continuar.' : 'Confira o campo destacado.';
      invalid[0].focus();
      return;
    }

    var d = new FormData(form);
    var lines = [
      'Olá! Gostaria de agendar uma avaliação.',
      'Nome: ' + d.get('nome').trim(),
      'Telefone: ' + d.get('telefone'),
      'Interesse: ' + (d.get('interesse') || 'Ainda não sei')
    ];
    var msg = (d.get('mensagem') || '').trim();
    if (msg) lines.push('Mensagem: ' + msg);

    var url = 'https://wa.me/' + form.dataset.whatsapp + '?text=' + encodeURIComponent(lines.join('\n'));
    form.classList.add('is-sent');
    note.textContent = 'Abrindo o WhatsApp… Se nada acontecer, verifique se pop-ups estão liberados.';
    window.open(url, '_blank', 'noopener');
    window.setTimeout(function () { form.classList.remove('is-sent'); }, 2400);
  });
})();
