(() => {
  const {items, links, preview} = window.VAULT;
  let category = 'All';
  const grid = document.querySelector('#inventory');
  const search = document.querySelector('#search');
  const status = document.querySelector('#status');
  const dialog = document.querySelector('#item-dialog');
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = (value, kind) => {
    try { const u = new URL(value); if(kind === 'contact' && u.protocol === 'mailto:') return u.href;
      if(u.protocol !== 'https:') return '';
      const host = u.hostname.toLowerCase();
      if(kind === 'ebay' && !(host === 'ebay.com' || host.endsWith('.ebay.com'))) return '';
      if(kind === 'sportscardspro' && !(host === 'sportscardspro.com' || host.endsWith('.sportscardspro.com'))) return '';
      return u.href;
    } catch { return ''; }
  };
  const visibleItems = items.filter(item => preview || !item.sample);
  document.querySelector('#live-catalog').hidden = visibleItems.length === 0;
  document.querySelector('#collection-themes').hidden = visibleItems.length > 0;
  const money = item => item.sample ? 'Illustrative piece' : item.status === 'Available' && Number.isFinite(item.price) ? new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(item.price) : item.status === 'Available' ? 'Price on eBay' : item.status;
  document.querySelector('#year').textContent = new Date().getFullYear();
  document.querySelector('#preview').hidden = !preview;
  document.querySelectorAll('[data-link]').forEach(a => { const url = safeUrl(links[a.dataset.link],a.dataset.link); if(url){a.href=url; if(!url.startsWith('mailto:')){a.target='_blank';a.rel='noopener noreferrer';}} });
  if(Object.entries(links).every(([key,value]) => safeUrl(value,key))) document.querySelector('#connections').hidden = true;
  function render() {
    const query = search.value.trim().toLowerCase();
    const filtered = visibleItems.filter(item => (category === 'All' || item.category === category) && (status.value === 'All' || item.status === status.value) && [item.title,item.category,item.detail].join(' ').toLowerCase().includes(query));
    grid.innerHTML = filtered.map(item => `<article class="piece"><button class="piece-image" data-item="${escape(item.id)}" aria-label="View details: ${escape(item.title)}"><span class="badge">${escape(item.status)}</span>${item.image && /^(vault\/)[a-z0-9_./-]+$/i.test(item.image) ? `<img src="${escape(item.image)}" alt="${escape(item.title)}" loading="lazy">` : `<span class="mini-card ${escape(item.color || 'cream')}"><small>JKR / VAULT STUDY</small><strong>${escape(item.art || 'THE VAULT.').replace(/\n/g,'<br>')}</strong><small>FOR THE LOVE OF THE FIND</small></span>`}<span class="sample">${item.sample ? 'DESIGN SAMPLE' : item.image ? 'VIEW PIECE ↗' : 'PHOTO COMING SOON'}</span></button><p class="piece-category">${escape(item.category)}</p><h3>${escape(item.title)}</h3><p class="description">${escape(item.detail)}</p><div class="piece-bottom"><span>${escape(money(item))}</span><button data-item="${escape(item.id)}">View details ↗</button></div></article>`).join('');
    document.querySelector('#result-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'piece' : 'pieces'}${preview ? ' · Design preview' : ''}`;
    document.querySelector('#empty').hidden = filtered.length !== 0;
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click',() => {
    category=button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => {b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});render();
  }));
  search.addEventListener('input',render); status.addEventListener('change',render);
  grid.addEventListener('click',event => {
    const button = event.target.closest('[data-item]'); if(!button) return;
    const item = visibleItems.find(i => i.id === button.dataset.item); if(!item) return;
    const url = !item.sample && item.status === 'Available' && safeUrl(item.ebayUrl,'ebay');
    document.querySelector('#item-details').innerHTML = `<p class="dialog-status">${escape(item.category)} / ${escape(item.status)}${item.sample ? ' / DESIGN SAMPLE' : ''}</p><h2 id="dialog-title">${escape(item.title)}</h2><p>${escape(item.notes)}</p><p>${escape(money(item))}</p>${url ? `<a class="button gold dialog-link" href="${escape(url)}" target="_blank" rel="noopener noreferrer">View this item on eBay ↗</a><p>Check the live listing for final price, availability, shipping, and returns.</p>` : `<p>${item.sample ? 'This is a layout example, not an actual item offered for sale.' : item.status === 'Available' ? 'Listing link coming soon.' : 'This piece is not currently offered for purchase.'}</p>`}`;
    dialog.setAttribute('aria-labelledby','dialog-title');dialog.showModal();
  });
  dialog.querySelector('.close').addEventListener('click',() => dialog.close());
  dialog.addEventListener('click',event => {if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  render();
})();
