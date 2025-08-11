// Função principal que será chamada quando o Web App for acessado.
// 'e' é o objeto de evento que contém informações sobre a requisição, incluindo parâmetros da URL.
function doGet(e) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // ATENÇÃO: Verifique se o nome da sua aba é realmente 'respostas_tech_words'.
  const sheet = spreadsheet.getSheetByName('respostas_tech_words');

  if (!sheet) {
    const errorMessage = `
      <h1>Erro: A aba "respostas_tech_words" não foi encontrada.</h1>
      <p>Verifique o nome da aba na sua planilha.</p>
    `;
    return HtmlService.createHtmlOutput(errorMessage).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Lê todos os dados da planilha, excluindo o cabeçalho.
  const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
  let data = dataRange.getValues();

  // Lê o parâmetro 'letra' da URL para filtrar os resultados.
  const initialLetter = e.parameter.letra ? String(e.parameter.letra).toUpperCase() : null;

  let filteredData = [];
  if (initialLetter) {
    // Se uma letra inicial foi fornecida, filtra os dados.
    filteredData = data.filter(row => {
      const termo = String(row[3]).toUpperCase(); // Pega a palavra (termo) da coluna D
      return termo.startsWith(initialLetter);
    });
  } else {
    // Se nenhuma letra foi fornecida, exibe uma mensagem de erro ou instrução.
    const errorLetter = `
      <h1>Erro: Letra inicial não especificada.</h1>
      <p>Por favor, adicione <code>?letra=X</code> à URL do seu Web App (substituindo X pela letra desejada).</p>
    `;
    return HtmlService.createHtmlOutput(errorLetter).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Ordenação Alfabética
  filteredData.sort((a, b) => {
    const termoA = String(a[3]).toLowerCase();
    const termoB = String(b[3]).toLowerCase();
    return termoA.localeCompare(termoB); // Método mais robusto para ordenar strings
  });

  // Constrói o HTML dinamicamente usando Template Literals para mais clareza.
  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Glossário Tech - Letra ${escapeHtml(initialLetter)}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
      
      <style>
        body { 
          font-family: 'Raleway', sans-serif; 
          margin: 25px; 
          color: #333; 
        }
        .termo-container { 
          margin-bottom: 30px; 
          padding-bottom: 20px; 
          border-bottom: 1px solid #eee; 
        }
        .termo-container:last-child { 
          border-bottom: none; 
          margin-bottom: 0; 
          padding-bottom: 0; 
        }

        /* Subheading: Raleway, bold, italic, 24px */
        h2 { 
          font-family: 'Raleway', sans-serif;
          font-size: 24px; 
          font-weight: bold; 
          font-style: italic; 
          margin-top: 0;
          margin-bottom: 8px; 
        }
        
        /* Normal text (Autor): Raleway, italic, 12px */
        .autor { 
          font-family: 'Raleway', sans-serif;
          font-size: 12px; 
          font-style: italic;
          margin-bottom: 15px;
        }

        /* Normal text (Descrição): Raleway, bold, 13px */
        .descricao { 
          font-family: 'Raleway', sans-serif;
          font-size: 13px; 
          font-weight: bold;
          line-height: 1.5;
          margin-bottom: 15px;
        }
        
        /* Normal text (Fonte): Raleway, italic, 12px, #4a86e8 */
        .fonte-container, .fonte-container a {
          font-family: 'Raleway', sans-serif;
          font-size: 12px; 
          font-style: italic;
          color: #4a86e8;
          text-decoration: none;
          word-break: break-all;
        }
        .fonte-container a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      ${generateTermsHtml(filteredData, initialLetter)}
    </body>
  </html>
  `;

  return HtmlService.createHtmlOutput(htmlContent).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Gera o HTML para a lista de termos ou uma mensagem de "não encontrado".
 * @param {Array<Array<String>>} data - Os dados filtrados e ordenados da planilha.
 * @param {String} letter - A letra que foi pesquisada.
 * @return {String} O conteúdo HTML para o corpo da página.
 */
function generateTermsHtml(data, letter) {
  if (data.length === 0) {
    return `<p>Nenhum termo encontrado para a letra ${escapeHtml(letter)}.</p>`;
  }

  return data.map(row => {
    const termo = row[3];
    const autor = row[1];
    const descricao = row[4];
    const fonte = row[5];

    if (!termo || termo.toString().trim() === '') {
      return ''; // Pula linhas vazias
    }

    const autorHtml = (autor && autor.toString().trim() !== '') 
      ? `<p class="autor">Autor: ${escapeHtml(autor)}</p>` 
      : '';
      
    const descricaoHtml = (descricao && descricao.toString().trim() !== '') 
      ? `<p class="descricao">${escapeHtml(descricao)}</p>` 
      : '';
      
    let fonteHtml = '';
    if (fonte && fonte.toString().trim() !== '') {
      if (isValidUrl(fonte.toString())) {
        fonteHtml = `<p class="fonte-container">Fonte: <a href="${escapeHtml(fonte)}" target="_blank">${escapeHtml(fonte)}</a></p>`;
      } else {
        fonteHtml = `<p class="fonte-container">Fonte: ${escapeHtml(fonte)}</p>`;
      }
    }

    return `
      <div class="termo-container">
        <h2>${escapeHtml(termo)}</h2>
        ${autorHtml}
        ${descricaoHtml}
        ${fonteHtml}
      </div>
    `;
  }).join('');
}


// Função de segurança para prevenir ataques de script (XSS).
function escapeHtml(text) {
  const strText = String(text);
  return strText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Função auxiliar para verificar se é um URL válido (simples).
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (e) {
    return false;
  }
}