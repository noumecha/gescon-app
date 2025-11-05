function generateStatsHtml({ stats, structure, year }) {
  const months = [
    "Jan", "Fév", "Mar", "Avr", "Mai", "Jui",
    "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc", "Année"
  ];

  let rows = "";
  for (const [personnel, data] of Object.entries(stats.stats)) {
    rows += `
      <tr>
        <td style="border:1px solid #000; padding:4px;">${personnel}</td>
        ${months.map(m => `
          <td style="border:1px solid #000; padding:4px;">${data.fonctionnaire?.[m] ?? '-'}</td>
          <td style="border:1px solid #000; padding:4px;">${data.contractuel?.[m] ?? '-'}</td>
        `).join('')}
      </tr>
    `;
  }

  return `
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: 'Helvetica', sans-serif; font-size: 10px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid black; padding: 4px; text-align: center; }
      h1 { text-align: center; font-size: 14px; margin-bottom: 20px; }
    </style>
  </head>
  <body>
    <h1>STATISTIQUES DES CONGÉS - ${structure?.value ?? 'Structure'} - ${year?.value ?? new Date().getFullYear()}</h1>
    <table>
      <thead>
        <tr>
          <th>Personnel</th>
          ${months.map(m => `<th colspan="2">${m}</th>`).join('')}
        </tr>
        <tr>
          <th></th>
          ${months.map(() => `<th>Fnc</th><th>Con</th>`).join('')}
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </body>
  </html>`;
}

module.exports = generateStatsHtml ;
