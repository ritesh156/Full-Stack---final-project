const API = 'http://localhost:4000';

const entityEl = document.getElementById('entity');
const fnameEl = document.getElementById('fname');
const fvalueEl = document.getElementById('fvalue');
const ingestBtn = document.getElementById('ingest');
const queryBtn = document.getElementById('query');
const out = document.getElementById('output');

ingestBtn.addEventListener('click', async () => {
  const payload = {
    entity_id: entityEl.value,
    name: fnameEl.value,
    value: fvalueEl.value
  };

  const response = await fetch(API + '/features', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  out.textContent = JSON.stringify(data, null, 2);
});

queryBtn.addEventListener('click', async () => {
  const entity = entityEl.value;

  const response = await fetch(API + '/query?entity_id=' + encodeURIComponent(entity));
  const data = await response.json();

  out.textContent = JSON.stringify(data, null, 2);
});
