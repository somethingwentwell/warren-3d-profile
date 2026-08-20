/* Builds the page from js/config.js — runs before main.js binds events. */
import { CONFIG as C } from './config.js';

const ICONS = {
  email: '<span class="chip__icon"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.3L4.2 7h15.6L12 12.3ZM4 8.9V17h16V8.9l-7.5 5a1 1 0 0 1-1 0L4 8.9Z"/></svg></span>',
  whatsapp: '<span class="chip__icon chip__icon--wa"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.9-1.4A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.1 4c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.4-1.8-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5L9.5 8.2c-.2-.4-.4-.4-.6-.4Z"/></svg></span>',
  wechat: '<span class="chip__icon chip__icon--wc"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M9.5 4C5.4 4 2 6.7 2 10.1c0 1.9 1 3.5 2.7 4.7l-.7 2.1 2.4-1.2c.7.2 1.4.3 2.1.4a5 5 0 0 1-.2-1.5c0-3.2 3.1-5.8 7-5.8h.5C15.3 6 12.7 4 9.5 4ZM7 7.4a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm5 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm3.5 3.1c-3.4 0-6.1 2.2-6.1 4.9 0 2.7 2.7 4.9 6.1 4.9.6 0 1.2-.1 1.8-.2l2 1-.6-1.7c1.5-1 2.3-2.4 2.3-4 0-2.7-2.7-4.9-6.1-4.9h.6Zm-2.1 2.6a.8.8 0 1 1 0 1.5.8.8 0 0 1 0-1.5Zm4.2 0a.8.8 0 1 1 0 1.5.8.8 0 0 1 0-1.5Z"/></svg></span>',
  linkedin: '<span class="chip__icon chip__icon--in"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.2c0-1.2 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4V9.5Z"/></svg></span>',
  github: '<span class="chip__icon"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.2-.4-1.2.1-2.6 0 0 .8-.3 2.8 1a9.5 9.5 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg></span>',
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* nameplate */
document.getElementById('nameplate').innerHTML = `
  <p class="hud__kicker">${esc(C.kicker)}</p>
  <h1 class="hud__name">${esc(C.name.first)}<br>${esc(C.name.last)}</h1>
  <p class="hud__role">${esc(C.title)}</p>
  <a class="hud__company edge-item" href="${C.company.url}" target="_blank" rel="noopener">
    <img src="${C.company.logo}" alt="" class="hud__company-mark"><span>${esc(C.company.name)}</span>
  </a>`;

/* sales resource card */
const sales = document.getElementById('sales-link');
sales.href = C.salesResource.url;
sales.innerHTML = `
  <span class="sales-card__tag">${esc(C.salesResource.tag)}</span>
  <span class="sales-card__title">${esc(C.salesResource.label)}</span>
  <span class="sales-card__arrow">→</span>`;

/* contact chips · left rail */
const contactNav = document.getElementById('contact-nav');
contactNav.insertAdjacentHTML('beforeend', C.contacts.map((c) => {
  const inner = `${ICONS[c.type] || ''}<span class="chip__text">${esc(c.label)}</span>`;
  return c.copy
    ? `<button class="chip edge-item" type="button" data-copy="${esc(c.copy)}" data-toast="${esc(c.toast || 'Copied')}">${inner}</button>`
    : `<a class="chip edge-item" href="${c.href}" ${c.href.startsWith('mailto') ? '' : 'target="_blank" rel="noopener"'}>${inner}</a>`;
}).join(''));

/* past experience logo chips · right rail */
const pastNav = document.getElementById('pastexp-nav');
pastNav.insertAdjacentHTML('beforeend', C.experience.filter((x) => x.chip).map((x) => `
  <a class="logo-chip edge-item" href="#${x.id}" data-tip="${esc(x.tip || x.company)}">
    <img src="${x.logo}" alt="${esc(x.company)}">
  </a>`).join(''));

/* bottom strip — stats around the scroll hint */
const stats = C.stats.map((s) =>
  `<p class="hud__stat edge-item"><b>${esc(s.b)}</b>${s.text ? ' ' + esc(s.text) : ''}</p>`);
const mid = Math.ceil(stats.length / 2);
document.getElementById('bottom-strip').innerHTML =
  stats.slice(0, mid).join('') +
  `<a class="hud__scroll edge-item" href="#experience">${esc(C.scrollHint)}</a>` +
  stats.slice(mid).join('');

/* full-time experience cards */
document.getElementById('xp-list').innerHTML = C.experience.map((x) => `
  <article class="xp${x.current ? ' xp--current' : ''}" id="${x.id}">
    <div class="xp__head">
      <img class="xp__logo" src="${x.logo}" alt="${esc(x.company)} logo">
      <div>
        <h3>${esc(x.company)} <em>· ${esc(x.place)}</em></h3>
        <p class="xp__role">${esc(x.role)} <span class="xp__date">${esc(x.date)}</span></p>
      </div>
    </div>
    <ul>${x.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
    ${x.links ? `<div class="xp__links">${x.links.map((l) =>
      `<a class="btn${l.ghost ? ' btn--ghost' : ''}" href="${l.url}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}</div>` : ''}
    <div class="xp__badges">${x.badges.map((b) => `<span>${esc(b)}</span>`).join('')}</div>
  </article>`).join('');

/* other experience */
document.getElementById('mini-list').innerHTML = C.otherExperience.map((o) => `
  <article class="mini">
    <h3>${esc(o.title)}</h3>
    <p class="xp__date">${esc(o.date)}</p>
    <p>${esc(o.text)}</p>
  </article>`).join('');

/* skills + credentials */
document.getElementById('skill-grid').innerHTML = C.skills.map((s) =>
  `<div class="skill"><h3>${esc(s.group)}</h3><p>${esc(s.items)}</p></div>`).join('');

document.getElementById('cred-cols').innerHTML = `
  <div>
    <h3 class="cred-title">Certifications</h3>
    <ul class="cred-list">${C.certifications.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
  </div>
  <div>
    <h3 class="cred-title">Education</h3>
    <ul class="cred-list">${C.education.map((e) =>
      `<li>${esc(e.title)}<br><small>${esc(e.detail)}</small></li>`).join('')}</ul>
    <h3 class="cred-title">Languages</h3>
    <ul class="cred-list">${C.languages.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
  </div>`;

/* footer */
document.getElementById('footer').innerHTML = `
  <p class="footer__big">${esc(C.footer.headline)}</p>
  <div class="footer__links">${C.contacts.map((c) => c.copy
    ? `<button type="button" data-copy="${esc(c.copy)}" data-toast="${esc(c.toast || 'Copied')}" class="footer__wc">${esc(c.label)}</button>`
    : `<a href="${c.href}" ${c.href.startsWith('mailto') ? '' : 'target="_blank" rel="noopener"'}>${esc(c.label)}</a>`).join('')}
  </div>
  <p class="footer__fine">${esc(C.footer.fine)}</p>`;
