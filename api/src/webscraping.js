const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const {
  pegarXPATH,
  pegarXPATH3,
  pegarXPATH2,
  removerEmojis,
} = require("./utils");
const mongoose = require("mongoose");
const carSchema = require("./models");

require("dotenv").config();

const mongoUrl = process.env.MONGO_URI;

if (!mongoUrl) {
  throw new Error("MONGO_URI não definido.");
}

mongoose.connect(mongoUrl);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let links_antigos = [];
let pagina = 0;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function AbrirNav(url, retries = 10) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const browser = await puppeteer.launch({
        headless: false,
        args: [
          "--ignore-certificate-errors",
          "--no-sandbox",
          "--disable-gpu",
          "--disable-web-security",
        ],
        ignoreHTTPSErrors: true,
        timeout: 120000,
      });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });

      const links = await page.evaluate(() => {
        const anchorElements = document.querySelectorAll(
          "#listingData > div:nth-child(1) > div > a"
        );
        return Array.from(anchorElements).map((anchor) => anchor.href);
      });

      await browser.close();
      return links;
    } catch (error) {
      console.error(`Erro na tentativa ${attempt}: ${error.message}`);
      if (attempt < retries) {
        console.log(`Tentando novamente em 20 minutos...`);
        await sleep(1200000);
      } else {
        console.log("Todas as tentativas falharam.");
        throw error;
      }
    }
  }
}

async function startBot() {
  while (true) {
    const links = await AbrirNav(
      `https://www.nettiauto.com/uusimmat?posted_by=seller&page=${pagina}`
    );
    if (JSON.stringify(links) === JSON.stringify(links_antigos)) {
      console.log("Nenhum novo link encontrado.");
      await sleep(7200000);
      continue;
    }

    links_antigos = links;

    for (let link of links) {
      const browser = await puppeteer.launch({
        headless: false,
        args: [
          "--ignore-certificate-errors",
          "--no-sandbox",
          "--disable-gpu",
          "--disable-web-security",
        ],
        ignoreHTTPSErrors: true,
        timeout: 120000,
      });
      const page = await browser.newPage();

      await page.goto(link, { waitUntil: "networkidle2", timeout: 120000 });

      let nome_dono = await pegarXPATH(page, [
        '//*[@id="slideEffect"]/div[19]/div[1]/div[2]/div/div[1]/div[1]/div[1]/div[2]/div',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[2]/div/div[1]/div[1]/div[1]/div[2]/div',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[2]/div/div[1]/div[1]/div[1]/div[2]/div',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[2]/div/div[1]/div[1]/div[1]/div[2]/div',
      ]);
      nome_dono = removerEmojis(nome_dono);

      let nome_carro = await pegarXPATH(page, [
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[2]/div/h1',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[2]/div/h1',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[2]/div/h1',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[2]/div/h1',
      ]);
      nome_carro = removerEmojis(nome_carro);

      let preco_carro = await pegarXPATH(page, [
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[2]/div/h1',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[2]/div/h1',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[2]/div/h1',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[2]/div/h1',
      ]);
      preco_carro = removerEmojis(preco_carro);

      let status_carro = await pegarXPATH(page, [
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[4]/div/div[2]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[4]/div/div[2]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[4]/div/div[2]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[4]/div/div[2]',
      ]);
      status_carro = removerEmojis(status_carro);

      let condic_car = await pegarXPATH(page, [
        '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[2]/div[1]/div',
        '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[2]/div[1]/div',
        '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[2]/div[1]/div',
        '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[1]/div/div/div[2]/div[1]/div',
      ]);
      condic_car = removerEmojis(condic_car);

      let quilometragem_carro = await pegarXPATH(page, [
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[2]/div/div[2]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[2]/div/div[2]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[2]/div/div[2]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[2]/div/div[2]',
      ]);
      quilometragem_carro = removerEmojis(quilometragem_carro);

      let ano_carro = await pegarXPATH(page, [
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[4]/div/div[2]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[4]/div/div[2]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[4]/div/div[2]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[4]/div/div[2]',
      ]);
      ano_carro = removerEmojis(ano_carro);
      ano_carro = parseInt(ano_carro);

      let motor_carro = await pegarXPATH(page, [
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[3]/div/div[2]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[3]/div/div[2]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[3]/div/div[2]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[3]/div/div[2]',
      ]);
      motor_carro = removerEmojis(motor_carro);

      let cambio_carro = await pegarXPATH(page, [
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[5]/div/div[2]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[5]/div/div[2]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[5]/div/div[2]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[5]/div/div[2]',
      ]);
      cambio_carro = removerEmojis(cambio_carro);

      let proprietarios_carro = await pegarXPATH(page, [
        '//*[@id="slideEffect"]/div[20]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[7]/div[2]',
        '//*[@id="slideEffect"]/div[19]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[7]/div[2]',
        '//*[@id="slideEffect"]/div[21]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[7]/div[2]',
        '//*[@id="slideEffect"]/div[22]/div/div[1]/div[2]/div[1]/div[4]/div/div[3]/div/div[7]/div[2]',
      ]);
      proprietarios_carro = removerEmojis(proprietarios_carro);

      let inspecionado_carro = await pegarXPATH(page, [
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[7]/div/div[2]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[7]/div/div[2]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[7]/div/div[2]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[7]/div/div[2]',
      ]);
      inspecionado_carro = removerEmojis(inspecionado_carro);

      let sistema_de_trans_carro = await pegarXPATH(page, [
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[6]/div/div[2]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[6]/div/div[2]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[6]/div/div[2]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[6]/div/div[2]',
      ]);
      sistema_de_trans_carro = removerEmojis(sistema_de_trans_carro);

      let id_carro = await pegarXPATH(page, [
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[2]/div/div[5]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[2]/div/div[5]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[2]/div/div[5]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[2]/div/div[5]',
      ]);
      id_carro = removerEmojis(id_carro);
      id_carro = id_carro.replace("ID ", "");

      let placa_carro = await pegarXPATH(page, [
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[1]/div/div[2]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[1]/div/div[2]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[1]/div/div[2]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[1]/div/div[2]',
      ]);
      placa_carro = removerEmojis(placa_carro);

      let especificacoes_carro = await pegarXPATH3(page, "Tekniset tiedot", [
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[1]',
      ]);

      especificacoes_carro = removerEmojis(especificacoes_carro);

      let seguranca_carro = await pegarXPATH2(page, "Turvallisuus", [
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[1]',
      ]);

      seguranca_carro = removerEmojis(seguranca_carro);

      let interior_carro = await pegarXPATH2(page, "Sisätilat ja mukavuudet", [
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[1]',
      ]);

      interior_carro = removerEmojis(interior_carro);

      let eletronica_carro = await pegarXPATH2(page, "Elektroniikka", [
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[1]',
      ]);
      eletronica_carro = removerEmojis(eletronica_carro);

      let infor_adicionais_carro = await pegarXPATH2(page, "Lisätiedot", [
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[1]',
      ]);
      infor_adicionais_carro = removerEmojis(infor_adicionais_carro);

      let outros_carro = await pegarXPATH2(page, "Muut", [
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[1]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[12]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[11]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[10]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[9]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[8]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[7]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[6]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[5]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[4]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[3]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[2]',
        '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[1]',
      ]);
      outros_carro = removerEmojis(outros_carro);

      let imagem_carro = "";

      try {
        imagem_carro = await page.evaluate(() => {
          let element = document.evaluate(
            '//*[@id="big_img_slider"]/div[1]/div[2]/img',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (!element) {
            element = document.evaluate(
              '//*[@id="big_img_slider"]/div/div/img',
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;
          }

          return element ? element.getAttribute("src") : null;
        });
      } catch (error) {
        imagem_carro = null;
      }

      await browser.close();

      const DADOS_carro = {
        id: id_carro,
        name: nome_carro,
        owner: nome_dono,
        price: preco_carro,
        status: status_carro,
        condition: condic_car,
        mileage: quilometragem_carro,
        year: ano_carro,
        engine: motor_carro,
        transmission: cambio_carro,
        owners: proprietarios_carro,
        inspected: inspecionado_carro,
        transmission: sistema_de_trans_carro,
        plate: placa_carro,
        specifications: especificacoes_carro,
        safety: seguranca_carro,
        interior: interior_carro,
        electronics: eletronica_carro,
        additional_information: infor_adicionais_carro,
        others: outros_carro,
        image: imagem_carro,
        link: link,
      };

      try {
        await carSchema.create(DADOS_carro);

        console.log(`Carro ${id_carro} salvo com sucesso!`);
      } catch (error) {
        console.log(`Erro ao salvar carro ${id_carro}, já existente`);

        const car = await carSchema.findOne({ id: id_carro });

        if (car && car.condition != condic_car) {
          await carSchema.updateOne(
            { id: id_carro },
            { condition: condic_car }
          );
          console.log(`Carro ${id_carro} atualizado com sucesso!`);
        } else {
          console.log(`Carro ${id_carro} não precisa ser atualizado!`);
        }
      }
    }

    pagina += 1;
    await sleep(7200000);
  }
}

startBot();
