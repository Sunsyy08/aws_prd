const records = [
  {
    date: "2025-01-12",
    time: "08:32",
    studentId: "20250101",
    name: "김민준",
    result: "교복",
    violation: false
  },
  {
    date: "2025-01-12",
    time: "09:14",
    studentId: "20250108",
    name: "박서연",
    result: "사복",
    violation: true
  }
];

const tbody = document.getElementById("historyBody");
const searchInput = document.getElementById("searchInput");

function render(data) {
  tbody.innerHTML = "";
  data.forEach(r => {
    tbody.innerHTML += `
      <tr>
        <td>${r.date}</td>
        <td>${r.time}</td>
        <td>${r.studentId}</td>
        <td>${r.name}</td>
        <td>
          <span class="badge ${r.result === '교복' ? 'blue' : 'red'}">
            ${r.result === '교복' ? '👔 교복' : '👕 사복'}
          </span>
        </td>
        <td>
          <span class="badge ${r.violation ? 'red' : 'green'}">
            ${r.violation ? '위반' : '정상'}
          </span>
        </td>
      </tr>
    `;
  });
}

render(records);

searchInput.addEventListener("input", e => {
  const q = e.target.value;
  render(
    records.filter(r =>
      r.name.includes(q) || r.studentId.includes(q)
    )
  );
});
