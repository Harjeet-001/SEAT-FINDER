const API_BASE = "https://seat-finder-api.harjeetgowda644.workers.dev";

// ---------- STUDENT LOOKUP ----------
function findSeat() {
  const reg = document.getElementById("reg").value.trim();
  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = "";

  if (!reg) {
    resultDiv.innerHTML = `<div class="error">Enter register number</div>`;
    return;
  }

  fetch(API_BASE + "/lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reg })
  })
    .then(res => res.json().then(data => ({ status: res.status, data })))
    .then(({ status, data }) => {
      if (status !== 200) {
        resultDiv.innerHTML = `<div class="error">${data.error}</div>`;
        return;
      }

      let html = `<div class="results">`;

      if (data.FN) {
        html += `
          <div class="session-box">
            <div class="session-title">FN</div>
            <p><b>Name:</b> ${data.FN.name}</p>
            <p><b>Hall:</b> ${data.FN.hall}</p>
            <p><b>Seat:</b> ${data.FN.seat}</p>
          </div>
        `;
      }

      if (data.AN) {
        html += `
          <div class="session-box">
            <div class="session-title">AN</div>
            <p><b>Name:</b> ${data.AN.name}</p>
            <p><b>Hall:</b> ${data.AN.hall}</p>
            <p><b>Seat:</b> ${data.AN.seat}</p>
          </div>
        `;
      }

      html += `</div>`;
      resultDiv.innerHTML = html;
    })
    .catch(() => {
      resultDiv.innerHTML = `<div class="error">Server error</div>`;
    });
}
