async function findSeat() {
  const reg = document.getElementById("reg").value.trim();
  if (!reg) return;

  const res = await fetch(
    "https://seat-finder-api.harjeetgowda644.workers.dev/lookup",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reg })
    }
  );

  const data = await res.json();
  const result = document.getElementById("result");

  if (data.error) {
    result.innerHTML = `<div class="error">${data.error}</div>`;
    return;
  }

  let html = `<div class="results">`;

  if (data.FN) {
    html += `
      <div class="session-box">
        <div class="session-title">FN</div>
        <p>Name: ${data.FN.name}</p>
        <p>Hall: ${data.FN.hall}</p>
        <p>Seat: ${data.FN.seat}</p>
      </div>`;
  }

  if (data.AN) {
    html += `
      <div class="session-box">
        <div class="session-title">AN</div>
        <p>Name: ${data.AN.name}</p>
        <p>Hall: ${data.AN.hall}</p>
        <p>Seat: ${data.AN.seat}</p>
      </div>`;
  }

  html += `</div>`;
  result.innerHTML = html;
}
