# 📚 Glossário Tech Words - Web App (Google Apps Script)

Este projeto é um **Web App** desenvolvido com **Google Apps Script** que lê dados de uma planilha Google Sheets e exibe termos de tecnologia filtrados pela letra inicial, formando um glossário dinâmico.

## 🚀 Funcionalidades

- Lê dados da aba `respostas_tech_words` no Google Sheets.
- Filtra os termos com base na letra inicial informada via parâmetro na URL (`?letra=X`).
- Ordena os termos filtrados em ordem alfabética.
- Gera uma página HTML estilizada com **Google Fonts**.
- Exibe informações como:
  - **Termo**
  - **Autor**
  - **Descrição**
  - **Fonte** (com link clicável, se for um URL válido)
- Prevenção contra **XSS** usando função de escape de HTML.
- Mensagens de erro amigáveis quando:
  - A aba não é encontrada.
  - A letra inicial não é informada.
  - Nenhum termo é encontrado para a letra escolhida.

---

## 📂 Estrutura do Código

- **`doGet(e)`**: Função principal executada quando o Web App é acessado.
- **`generateTermsHtml(data, letter)`**: Monta o HTML com os termos filtrados.
- **`escapeHtml(text)`**: Sanitiza strings para evitar ataques XSS.
- **`isValidUrl(string)`**: Valida se o texto informado é um URL.

---

## ⚙️ Como Usar

1. Abra o **Google Sheets** que contém os dados e crie a aba chamada **`respostas_tech_words`**.
   
   Estrutura esperada da planilha (a partir da linha 2):

2. No **Google Apps Script**:
- Cole o código fornecido.
- Salve o projeto.
- Publique como **Web App**:
  - Menu → **Publicar** → **Implantar como aplicativo da web**.
  - Defina **"Qualquer pessoa, mesmo anônima"** como acesso.

3. Acesse a URL do Web App adicionando o parâmetro `?letra=X`, substituindo `X` pela letra desejada:
   `https://script.google.com/macros/s/SEU_SCRIPT_ID/exec?letra=A`

---

## 🖌️ Estilo e Layout

O HTML gerado:
- Usa a fonte **Raleway** via Google Fonts.
- Possui espaçamento e separadores entre os termos.
- Links de fonte têm cor azul e sublinhado no hover.

---

## 🔒 Segurança

- O código utiliza **`escapeHtml()`** para prevenir **injeção de código malicioso (XSS)**.
- Apenas exibe links se forem URLs válidos.

---

## 📌 Exemplo de Uso

Se a planilha contiver:

| Autor   | Termo     | Descrição            | Fonte                  |
|---------|----------|----------------------|------------------------|
| João    | API      | Interface de software | https://developer.com  |
| Maria   | Algoritmo| Sequência de passos   | Livro de Matemática    |

E você acessar:
`https://script.google.com/macros/s/SEU_SCRIPT_ID/exec?letra=A`

Será exibido:
- API
- Algoritmo  
Com os respectivos autores, descrições e fontes.

---

## 📄 Licença

Este projeto pode ser adaptado livremente para fins educacionais e comerciais, desde que seja mantida a atribuição ao autor original.

© 2025 - Desenvolvido para o projeto Tech Words IF Sudeste MG - Campus Cataguases

