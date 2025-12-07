document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('history-table-body');
    if (!tableBody) return;   // 안전장치

    loadHistory();

    tableBody.addEventListener('click', (event) => {
        const tr = event.target.closest('tr');
        if (tr) {
            const gameId = tr.dataset.gameId;
            window.location.href = `review.php?gameId=${gameId}`;
        }
    });
});


function loadHistory() {
    if (!USER_ID) return;

    fetch(`./api/bringHistory.php?uid=${USER_ID}`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById("history-table-body");

            if (!tbody) {
                console.log("tbody 못 찾음");
                return;
            }

            if (data.length === 0) {
                tbody.innerHTML = `
                    <tr><td colspan="4" class="empty-msg">기록이 없습니다.</td></tr>
                `;
                return;
            }

            tbody.innerHTML = ""; 

            data.forEach((row, idx) => {
                const tr = document.createElement("tr");

                tr.dataset.gameId = row.game_id;  // ← 클릭 이동용 중요!

                tr.innerHTML = `
                    <td>${idx + 1}</td>
                    <td>${row.opponent_name}</td>
                    <td>${row.result === "win" ? "승" : "패"}</td>
                    <td>${row.created_at}</td>
                `;

                tbody.appendChild(tr);
            });
        })
        .catch(err => {
            console.error("history load error:", err);
        });
}




    

