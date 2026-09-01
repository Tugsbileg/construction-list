(() => {
  const data = window.assetData;
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));

  const definitions = {
    apartments: {
      detail: 'apartment-detail.html',
      columns: [
        ['Төслийн нэр', 'project'], ['Байрны тоот', 'number'], ['Давхар', 'floor'],
        ['м²', 'sqm'], ['1 м² үнэ', 'pricePerSqm'], ['Нийт үнэ', 'totalPrice'],
        ['Ашиглалтад орох хугацаа', 'completion']
      ]
    },
    cars: {
      detail: 'car-detail.html',
      columns: [
        ['Үйлдвэрлэгч', 'make'], ['Үйлдвэрлэсэн он', 'year'], ['Орж ирсэн он', 'importYear'],
        ['Улсын дугаар', 'plate'], ['Үнэ', 'price']
      ]
    },
    others: {
      detail: 'other-detail.html',
      columns: [['Хөрөнгийн нэр', 'name'], ['Тодорхойлолт', 'description'], ['Үнэ', 'price']]
    }
  };

  const page = document.body.dataset.page;
  if (!page || !data || !definitions[page]) return;

  const config = definitions[page];
  const list = data[page] || [];
  const tableHead = document.querySelector('[data-table-head]');
  const tableBody = document.querySelector('[data-table-body]');
  const count = document.querySelector('[data-count]');

  if (tableHead && tableBody) {
    tableHead.innerHTML = `<tr>${config.columns.map(([label]) => `<th>${label}</th>`).join('')}<th>Зураг</th></tr>`;
    tableBody.innerHTML = list.length
      ? list.map((item, index) => `<tr>${config.columns.map(([, key]) => `<td>${escapeHtml(item[key])}</td>`).join('')}<td><a class="detail-link" href="${config.detail}?id=${index}">Дэлгэрэнгүй үзэх →</a></td></tr>`).join('')
      : `<tr><td class="empty" colspan="${config.columns.length + 1}">Одоогоор бүртгэлтэй хөрөнгө алга.</td></tr>`;
  }

  if (count) count.textContent = `${list.length} хөрөнгө`;

  const detailRoot = document.querySelector('[data-detail]');
  if (!detailRoot) return;

  const index = Number(new URLSearchParams(location.search).get('id'));
  const item = list[index];
  if (!item) {
    detailRoot.innerHTML = '<p class="empty">Таны хайсан хөрөнгө олдсонгүй.</p>';
    return;
  }

  const title = page === 'apartments' ? `${item.project} · ${item.number}` : page === 'cars' ? item.make : item.name;
  const specs = config.columns.slice(page === 'apartments' ? 2 : 0).map(([label, key]) => `<div class="spec"><span>${label}</span><strong>${escapeHtml(item[key])}</strong></div>`).join('');
  const images = (item.images || []).map((src, imageIndex) => `<img src="${escapeHtml(src)}" alt="${escapeHtml(title)} — зураг ${imageIndex + 1}">`).join('');

  detailRoot.innerHTML = `
    <div class="detail-shell">
      <div class="detail-main">
        <p class="eyebrow">Construction List</p>
        <h1>${escapeHtml(title)}</h1>
        <span class="detail-tag">${page === 'apartments' ? 'Орон сууц' : page === 'cars' ? 'Автомашин' : 'Бусад хөрөнгө'}</span>
        <div class="gallery">${images}</div>
      </div>
      <aside class="detail-sidebar">
        <h2>Хөрөнгийн мэдээлэл</h2>
        ${page === 'apartments' ? `<div class="spec"><span>Төслийн нэр</span><strong>${escapeHtml(item.project)}</strong></div><div class="spec"><span>Байрны тоот</span><strong>${escapeHtml(item.number)}</strong></div>` : ''}
        ${specs}
        <div class="contact-box"><p>Дэлгэрэнгүй мэдээлэл болон үзлэгийн цаг авах бол холбогдоно уу.</p><a class="button" href="tel:+97677112026">Холбоо барих</a></div>
      </aside>
    </div>`;
})();

