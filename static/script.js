function lookup() {
    const regNo = document.getElementById("regNo").value.trim();

    fetch("/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reg_no: regNo })
    })
    .then(res => res.json())
    .then(data => {
        const result = document.getElementById("result");

        if (data.error) {
            result.style.color = "red";
            result.innerText = data.error;
        } else {
            result.style.color = "green";
            result.innerHTML = `
                <b>Name:</b> ${data.name}<br>
                <b>Hall:</b> ${data.hall}<br>
                <b>Desk:</b> ${data.desk}
            `;
        }
    });
}
