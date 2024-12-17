const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    "private_key_id": process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.NEXT_PUBLIC_FIREBASE_CLIENT_ID,
    "auth_uri": process.env.NEXT_PUBLIC_FIREBASE_AUTH_URI,
    "token_uri": process.env.NEXT_PUBLIC_FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.NEXT_PUBLIC_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.NEXT_PUBLIC_FIREBASE_CLIENT_X509_CERT_URL
  })
});
const db = admin.firestore();


function sleep(ms) { 
    return new Promise(resolve => setTimeout(resolve, ms)); 
}


async function iniciarBot(){
  async function ComeçarBot(){
      
      // Variáveis globais
      var links_antigos = ["Nulo"];
      var pagina = 0;
      var novos_carro = [];
      var navegador = null;


      async function AbrirNav(url, retries = 10) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        let browser;
        let page;

        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            browser = await puppeteer.launch({ 
              headless: false, 
              args: ['--ignore-certificate-errors', '--no-sandbox', '--disable-gpu', '--disable-web-security'], 
              ignoreHTTPSErrors: true,
              timeout: 120000 // Aumenta o tempo limite do navegador
            });
            page = await browser.newPage();

            // tempo limite do protocolo
            const client = await page.target().createCDPSession();
            await client.send('Network.enable', {}, { timeout: 12000000 });

            await page.setViewport({ width: 1920, height: 1080 });
            await page.goto(url, { waitUntil: ['networkidle2', 'load'], timeout: 12000000 }); // 200 minutos
            await page.deleteCookie(...await page.cookies());

            await page.evaluate(() => {
              document.body.style.transform = 'scale(0.25)';
              document.body.style.transformOrigin = '0 0';
              document.body.style.width = '400%';
              document.body.style.overflow = 'auto';
            });

            navegador = browser;
            return page; // Se a navegação for bem-sucedida, retorne a página
          } catch (error) {
            console.error(`Erro na tentativa ${attempt}: ${error.message}`);
            if (attempt < retries) {
              console.log(`Tentando novamente em 20 minutos...`);
              await sleep(1200000); // 20 minutos
            } else {
              console.log('Todas as tentativas falharam.');
              throw error; // Lança o erro após todas as tentativas falharem
            }
          }
        }
      }



      async function FecharNav(navegador) {
        await navegador.close();
      }


      while (true) {
        pagina += 1;
    
        // Abre o navegador e navega para a URL
        var page = await AbrirNav(`https://www.nettiauto.com/uusimmat?posted_by=seller&page=${pagina}`);

        
        let links = await page.evaluate(() => { 
            const anchorElements = document.querySelectorAll('#listingData > div:nth-child(1) > div > a'); 
            return Array.from(anchorElements).map(anchor => anchor.href); 
        });
        await FecharNav(navegador);

        // Comparação de links 
        if (links === links_antigos[0]) { 
            pagina = 0; 
            break
        } else { 
            links_antigos = []; 
            console.log('Links atualizados, limpando links antigos.'); 
        } 
        links_antigos.push(links);
        console.log('Links encontrados:', links);
    
    
        for (let link of links) {
          var page = await AbrirNav(link)

          function removerEmojis(text) {
            return text ? String(text).replace(/[\u{1F600}-\u{1F6FF}]/gu, '') : '';
          }
          async function pegarXPATH(page, xpaths) {
            for (let xpath of xpaths) {
              if (!xpath || typeof xpath !== 'string' || xpath.trim() === '') {
                continue;
              }
          
              const texto = await page.evaluate((xpath) => {
                const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                return element ? element.textContent.trim() : null;
              }, xpath);
          
              if (texto) {
                // Remove espaços em excesso e vírgulas duplicadas
                const textoLimpo = texto.replace(/\s\s+/g, ' ').replace(/,{2,}/g, ',');
                return textoLimpo;
              }
            }
            return "Não encontrado";
          }
            
          
          
          
          // Vendedor
          let nome_dono = await pegarXPATH(page, [
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[2]/div/div[1]/div[1]/div[2]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[2]/div/div[1]/div[1]/div[2]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[2]/div/div[1]/div[1]/div[2]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[2]/div/div[1]/div[1]/div[2]/div'
          ]);
          nome_dono = removerEmojis(nome_dono);
    

          // Modelo do carro
          let nome_carro = await pegarXPATH(page, [
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[2]/div[1]/h1',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[2]/div[1]/h1',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[2]/div[1]/h1',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[2]/div[1]/h1'
          ]);
          nome_carro = removerEmojis(nome_carro);
        

          // Preço do carro
          let preco_carro = await pegarXPATH(page, [
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[2]/div[2]/div/font',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[2]/div[2]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[2]/div[2]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[2]/div[2]/div'
          ]);
          preco_carro = removerEmojis(preco_carro);


          // Data
          let status_carro = await pegarXPATH(page, [
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[1]/div[2]',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[1]/div[2]/text()',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[1]/div[2]/text()',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[1]/div[2]/text()'
          ]);
          status_carro = removerEmojis(status_carro);


          // Condição do carro
          let condic_car = await pegarXPATH(page, [
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[2]/div[1]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[2]/div[1]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[2]/div[1]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[2]/div[1]/div'
          ]);
          condic_car = removerEmojis(condic_car);
    

          // Quilometragem
          let quilometragem_carro = await pegarXPATH(page, [
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[1]/div[2]',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[1]/div[2]',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[1]/div[2]',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[1]/div[2]'
          ]);
          quilometragem_carro = removerEmojis(quilometragem_carro);
    

          // Ano
          let ano_carro = await pegarXPATH(page, [
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[3]/div[2]',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[3]/div[2]',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[3]/div[2]',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[3]/div[2]'
          ]);
          ano_carro = removerEmojis(ano_carro);
      

          // Motor
          let motor_carro = await pegarXPATH(page, [
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[2]/div[2]',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[2]/div[2]',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[2]/div[2]',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[2]/div[2]'
          ]);
          motor_carro = removerEmojis(motor_carro);


          // Cambio
          let cambio_carro = await pegarXPATH(page, [
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[4]/div[2]',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[4]/div[2]',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[4]/div[2]',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[4]/div[2]'
          ]);
          cambio_carro = removerEmojis(cambio_carro);
      

          // Proprietários
          let proprietarios_carro = await pegarXPATH(page, [
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[7]/div[2]',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[7]/div[2]',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[7]/div[2]',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[7]/div[2]'
          ]);
          proprietarios_carro = removerEmojis(proprietarios_carro);
  

          // Inspecionado
          let inspecionado_carro = await pegarXPATH(page, [
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[6]/div[2]',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[6]/div[2]',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[6]/div[2]',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[6]/div[2]'
          ]);
          inspecionado_carro = removerEmojis(inspecionado_carro);


          // Sistema de transmissão
          let sistema_de_trans_carro = await pegarXPATH(page, [
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[5]/div[2]',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[5]/div[2]',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[5]/div[2]',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[5]/div[2]'
          ]);
          sistema_de_trans_carro = removerEmojis(sistema_de_trans_carro);
      

          // ID do carro
          let id_carro = await pegarXPATH(page, [
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[1]/div[1]',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[1]/div[1]',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[1]/div[1]',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[1]/div[1]'
          ]);
          id_carro = removerEmojis(id_carro);
      

          // Placa
          let placa_carro = await pegarXPATH(page, [
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[4]/div/div[2]/font',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[4]/div/div[2]',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[4]/div/div[2]',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[4]/div/div[2]'
          ]);
          placa_carro = removerEmojis(placa_carro);




          // parte 2
          async function pegarXPATH2(page, palavra, xpaths) {
            for (const xpath of xpaths) {
              if (!xpath || typeof xpath !== 'string' || xpath.trim() === '') {
                continue;
              }
          
              try {
                const elementoEspecificacoes = await page.evaluate((xpath) => {
                  const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                  return element ? element.innerHTML : null;  // Capture o HTML interno
                }, xpath);
          
                if (elementoEspecificacoes && elementoEspecificacoes.includes(palavra)) {
                  // Substituir tags HTML por quebras de linha e limpar o texto
                  const textoLimpo = elementoEspecificacoes
                    .replace(/<p>/g, '\n')                // Substituir <p> por \n
                    .replace(/<\/p>/g, '')                // Remover </p>
                    .replace(/<br\s*\/?>/g, '\n')         // Substituir <br> por \n
                    .replace(/<[^>]+>/g, '')              // Remover todas as outras tags HTML
                    .replace(/(\n{2,})/g, '\n')           // Remover \n duplicadas
                    .replace(/\s\s+/g, ' ')               // Remover espaços em excesso
                    .replace(/,{2,}/g, ',')               // Remover vírgulas duplicadas
                    .replace(/ ,/g, ',')                  // Remover espaços antes de vírgulas
                    .replace(/Lue lisää/g, '');           // Substituir texto específico
          
                  return textoLimpo.trim(); // Retornar o texto limpo e aparado
                }
              } catch (error) {
                continue;
              }
            }
            return "Não encontrado";
          }
          

          // clicar em ler mais...
          async function clickButtons(page) {
            // Executa no contexto da página para clicar em todos os elementos
            await page.evaluate(() => {
                const elements = document.querySelectorAll('#readMoreCaption');
                elements.forEach(element => {
                    try {
                        if (element.textContent.includes('Lue lisää')) {
                            element.click();
                        }
                    } catch (error) {
                        console.warn('Erro ao clicar em elemento:', error);
                    }
                });
            });
        
            // Espera um pouco para o conteúdo carregar após todos os cliques
            await sleep(2000)
            }
          await clickButtons(page)
        
          
          
          // Especificações
          async function pegarXPATH3(page, palavra, xpaths) {
            for (const xpath of xpaths) {
              if (!xpath || typeof xpath !== 'string' || xpath.trim() === '') {
                continue;
              }
          
              try {
                const elementoEspecificacoes = await page.evaluate((xpath) => {
                  const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                  return element ? element.textContent : null;
                }, xpath);
          
                if (elementoEspecificacoes && elementoEspecificacoes.includes(palavra)) {
                  // Remove espaços em excesso e vírgulas duplicadas
                  const textoLimpo = elementoEspecificacoes
                    .replace(/\n/g, ', ')        // Substitui quebras de linha por virgula
                    .replace(/\s\s+/g, ' ')      // Remove espaços em excesso
                    .replace(/,{2,}/g, ',')      // Remove vírgulas duplicadas
                    .replace(/ ,/g, ',')         // Remove espaços antes de vírgulas
                    .replace(/Lue lisää/g, '');
          
                  return textoLimpo; // Retorna o texto limpo
                }
              } catch (error) {
                continue;
              }
            }
            return "Não encontrado";
          }
          let especificacoes_carro = await pegarXPATH3(page, "Tekniset tiedot", [
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div'
          ])
          especificacoes_carro = removerEmojis(especificacoes_carro)


          // Segurança
          let seguranca_carro = await pegarXPATH2(page, "Turvallisuus", [
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[8]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[7]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[6]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[4]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[3]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[2]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[1]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[8]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[7]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[6]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[4]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[3]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[2]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[1]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[8]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[7]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[6]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[4]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[3]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[2]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[1]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[8]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[7]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[6]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[4]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[3]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[2]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[1]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div'
          ])
          seguranca_carro = removerEmojis(seguranca_carro)


          // Interior e comodidades
          let interior_carro = await pegarXPATH2(page, "Sisätilat ja mukavuudet", [
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div'
          ])
          interior_carro = removerEmojis(interior_carro)


          // eletronica
          let eletronica_carro = await pegarXPATH2(page, "Elektroniikka", [
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div'
          ])
          eletronica_carro = removerEmojis(eletronica_carro)


          // Informações adicionais
          let infor_adicionais_carro = await pegarXPATH2(page, "Lisätiedot", [
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div'
          ])
          infor_adicionais_carro = removerEmojis(infor_adicionais_carro)
          

          // outros
          let outros_carro = await pegarXPATH2(page, "Muut", [
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[8]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[7]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[6]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[5]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[4]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[3]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[2]/div',
            '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[5]/div/div[1]/div'
          ])
          outros_carro = removerEmojis(outros_carro)


          // imagem
          let imagem_carro = "";
          try {
            imagem_carro = await page.evaluate(() => {
              let element = document.evaluate('//*[@id="big_img_slider"]/div[1]/div[2]/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
              
              // Se o primeiro XPath falhar, tenta o segundo
              if (!element) {
                element = document.evaluate('//*[@id="big_img_slider"]/div/div/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
              }

              return element ? element.getAttribute('src') : "Não encontrado";
            });
          } catch (error) {
            imagem_carro = "Não encontrado";

          }




          // Numero de telefone
          async function pegarNumeroDeTelefoneEclicar(page) {
            const xpathTelefone = '//*[@id="showUserMobileNumber"]';
            const xpathClicar = '//*[@id="contact_block"]/div/div[2]/div[3]/a';

            try {
              // Pegar o número de telefone
              const telefone = await page.evaluate((xpath) => {
                const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                return element ? element.getAttribute('data-phone') : "Número de telefone não encontrado";
              }, xpathTelefone);

              // Clicar no elemento
              await page.evaluate((xpath) => {
                const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (element) {
                  element.click();
                } else {
                  console.log('Elemento não encontrado');
                }
              }, xpathClicar);

              return telefone;

            } catch (error) {
              console.error(`Erro ao processar os XPaths:`, error);
              return "Erro ao tentar obter o número de telefone e clicar no elemento";
            }
          }
          const telefone = await pegarNumeroDeTelefoneEclicar(page);
 


          // fechar navegador
          if (!page.isClosed()) {
            await FecharNav(navegador)
          }

          console.log('\n \n' + link)
          console.log(`\x1b[1;32m
          Nome:\x1b[0m ${nome_carro}
          \x1b[1;32mVendedor:\x1b[0m ${nome_dono}
          \x1b[1;32mID do Carro:\x1b[0m ${id_carro}
          \x1b[1;32mPlaca:\x1b[0m ${placa_carro}
          \x1b[1;32mData:\x1b[0m ${status_carro}
          \x1b[1;32mCondição:\x1b[0m ${condic_car}
          \x1b[1;32mPreço:\x1b[0m ${preco_carro}
          \x1b[1;32mContato:\x1b[0m ${telefone}
          \x1b[1;32mQuilometragem:\x1b[0m ${quilometragem_carro}
          \x1b[1;32mAno:\x1b[0m ${ano_carro}
          \x1b[1;32mMotor:\x1b[0m ${motor_carro}
          \x1b[1;32mCâmbio:\x1b[0m ${cambio_carro}
          \x1b[1;32mProprietários:\x1b[0m ${proprietarios_carro}
          \x1b[1;32mInspecionado:\x1b[0m ${inspecionado_carro}
          \x1b[1;32mSistema de Transmissão:\x1b[0m ${sistema_de_trans_carro}
          \x1b[1;32mEspecificações:\x1b[0m ${especificacoes_carro}
          \x1b[1;32mEletrônica:\x1b[0m ${eletronica_carro}
          \x1b[1;32mSegurança:\x1b[0m ${seguranca_carro}
          \x1b[1;32mInterior e Comodidades:\x1b[0m ${interior_carro}
          \x1b[1;32mInformações Adicionais:\x1b[0m ${infor_adicionais_carro}
          \x1b[1;32mOutros:\x1b[0m ${outros_carro}
          \x1b[1;32mImagem:\x1b[0m ${imagem_carro}`);


          

          // Dados do carro
          const DADOS_carro = {
            nome: nome_carro,
            ID: id_carro,
            placa: placa_carro,
            vendedor: nome_dono,
            preco: preco_carro,
            data: status_carro,
            condicao: condic_car,
            contato: telefone,
            quilometragem: quilometragem_carro,
            ano: ano_carro,
            motor: motor_carro,
            cambio: cambio_carro,
            proprietarios: proprietarios_carro,
            Inspecionado: inspecionado_carro,
            sistema_de_transmissao: sistema_de_trans_carro,
            especificacoes: especificacoes_carro,
            seguranca: seguranca_carro,
            interior_comodidades: interior_carro,
            eletronica: eletronica_carro,
            informacoes_adicionais: infor_adicionais_carro,
            outros: outros_carro,
            imagem: imagem_carro
          };

          


          if (telefone != "Não encontrado" && telefone != "Número de telefone não encontrado"){

            // Caminho do JSON
            const caminhoDiretorio = process.cwd();
            console.log(caminhoDiretorio);
            const caminhoJson = path.join(caminhoDiretorio, 'fones.json');

            // Leitura do JSON
            let dados_carros = [];
            try {
              const data = fs.readFileSync(caminhoJson, 'utf-8');
              dados_carros = JSON.parse(data);
            } catch (err) {
              console.error('Erro ao ler o arquivo JSON:', err);
            }

            if (!dados_carros.some(car => JSON.stringify(car) === JSON.stringify(DADOS_carro))) {
              dados_carros.push(DADOS_carro);
            }

            try {
            fs.writeFileSync(caminhoJson, JSON.stringify(dados_carros, null, 4), 'utf-8');
            console.log('Dados salvos com sucesso.');
          } catch (err) {
            console.error('Erro ao salvar o arquivo JSON:', err);
          }
          }

          

          
        }
      }

      // Caminho do JSON
      const caminhoDiretorio = process.cwd();
      const caminhoJson = path.join(caminhoDiretorio, 'fones.json');

      // Gravação do JSON
      try {
        fs.writeFileSync(caminhoJson, JSON.stringify(novos_carro, null, 4), 'utf-8');
        console.log('Dados salvos com sucesso.');
      } catch (err) {
        console.error('Erro ao salvar o arquivo JSON:', err);
      }




  }
  while (true){
    await ComeçarBot()

    await sleep(7200000)
  }
}


function enviarJsonParaServidor() {
  const caminhoDiretorio = process.cwd();
  const caminhoJson = path.join(caminhoDiretorio, 'fones.json');

  fs.readFile(caminhoJson, 'utf-8', async (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo JSON:', err);
      return;
    }

    let dados_carros_json;
    try {
      dados_carros_json = JSON.parse(data);

      // Verificação adicional para garantir que seja um objeto
      if (!Array.isArray(dados_carros_json)) {
        throw new Error('Dados não são uma lista de objetos.');
      }

      // Verificação e ajuste de cada objeto dentro do array
      dados_carros_json = dados_carros_json.map(carro => {
        // Remova caracteres inválidos ou ajuste as quebras de linha
        for (const key in carro) {
          if (typeof carro[key] === 'string') {
            carro[key] = carro[key].replace(/\\n/g, '\n');
          }
        }
        return carro;
      });

    } catch (err) {
      console.error('Erro ao analisar o JSON:', err);
      return;
    }

    try {
      const docRef = db.collection('carros').doc();
      await docRef.set({ carros: dados_carros_json });
      console.log('Dados enviados com sucesso:', dados_carros_json);
    } catch (err) {
      console.error('Erro ao enviar os dados para o Firebase:', err);
    }
  });
}






//enviarJsonParaServidor()

iniciarBot()

setInterval(enviarJsonParaServidor, 3600000)
