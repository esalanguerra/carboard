const { pegarXPATH, pegarXPATH3, pegarXPATH2 } = require("./utils/xPath");
const mongoose = require("mongoose");
const carSchema = require("./models/Car");
const removerEmojis = require("./utils/removerEmojis");
const clickButtons = require("./utils/clickButtons");

const sleep = require("./utils/sleep");
const puppeteer = require("puppeteer");

require("dotenv").config();

const mongoUrl = process.env.MONGO_URI;

if (!mongoUrl) {
  throw new Error("MONGO_URI não definido.");
}

var links_antigos = ["Nulo"];
var pagina = 0;
var novos_carro = [];
var navegador = null;

var site_url = "https://www.nettiauto.com/uusimmat";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Conectado ao MongoDB.");
  })
  .catch((error) => {
    console.error(`Erro ao conectar ao MongoDB: ${error}`);
  });

async function iniciarBot() {
  async function start() {
    async function AbrirNav(url, retries = 10) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

      let browser;
      let page;

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          browser = await puppeteer.launch({
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

          page = await browser.newPage();

          const client = await page.target().createCDPSession();

          await client.send("Network.enable", {}, { timeout: 12000000 });

          await page.setViewport({ width: 1920, height: 1080 });
          await page.goto(url, {
            waitUntil: ["networkidle2", "load"],
            timeout: 12000000,
          });
          await page.deleteCookie(...(await page.cookies()));

          await page.evaluate(() => {
            document.body.style.transform = "scale(0.25)";
            document.body.style.transformOrigin = "0 0";
            document.body.style.width = "400%";
            document.body.style.overflow = "auto";
          });

          navegador = browser;

          return page;
        } catch (error) {
          console.error(`Erro na tentativa ${attempt}: ${error.message}`);

          if (attempt < retries) {
            console.log(`Tentando novamente em 20 minutos...`);

            await sleep(1200000);
          } else {
            console.log("Todas as tentativas falharam.");
          }
        }
      }
    }

    async function pegarNumeroDeTelefoneEclicar(page) {
      const xpathTelefone = '//*[@id="showUserMobileNumber"]';
      const xpathClicar = '//*[@id="contact_block"]/div/div[2]/div[3]/a';

      try {
        const telefone = await page.evaluate((xpath) => {
          const element = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          return element ? element.getAttribute("data-phone") : null;
        }, xpathTelefone);

        await page.evaluate((xpath) => {
          const element = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (element) {
            element.click();
          } else {
            console.log("Elemento não encontrado");
          }
        }, xpathClicar);

        return telefone;
      } catch (error) {
        console.error(`Erro ao processar os XPaths:`, error);

        return "Erro ao tentar obter o número de telefone e clicar no elemento";
      }
    }

    async function FecharNav(navegador) {
      await navegador.close();
    }

    while (true) {
      pagina += 1;

      var parametros = {
        posted_by: "seller",
        page: pagina,
      };

      var site = `${site_url}?${new URLSearchParams(parametros).toString()}`;

      var page = await AbrirNav(site);

      let links = await page.evaluate(() => {
        const anchorElements = document.querySelectorAll(
          "#listingData > div:nth-child(1) > div > a"
        );
        return Array.from(anchorElements).map((anchor) => anchor.href);
      });

      await FecharNav(navegador);

      if (links === links_antigos[0]) {
        pagina = 0;

        break;
      } else {
        links_antigos = [];
      }

      links_antigos.push(links);

      for (let link of links) {
        var page = await AbrirNav(link);
        // var page = await AbrirNav("https://www.nettiauto.com/bmw/316/14763835");

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

        let condic_car = await page.evaluate(() => {
          const element = document.querySelector(
            ".details-page-header__road-worthy"
          );
          return element ? element.innerText : null;
        });
        condic_car = removerEmojis(condic_car);

        let preco_carro = await page.evaluate(() => {
          const element = document.querySelector(
            ".details-page-header__item-price-main"
          );
          return element ? element.innerText : null;
        });
        preco_carro = removerEmojis(preco_carro);

        preco_carro = preco_carro.replace(" €", "");
        preco_carro = preco_carro.replace(" ", "");

        let status_carro = await pegarXPATH(page, [
          '//*[@id="slideEffect"]/div[19]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[4]/div/div[2]',
          '//*[@id="slideEffect"]/div[20]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[4]/div/div[2]',
          '//*[@id="slideEffect"]/div[21]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[4]/div/div[2]',
          '//*[@id="slideEffect"]/div[22]/div[1]/div[1]/div[4]/div[3]/div/div[2]/div[4]/div/div[2]',
        ]);
        status_carro = removerEmojis(status_carro);

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

        await clickButtons(page);

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

        let power = null;

        if (especificacoes_carro.includes("Teho,,, ")) {
          power = especificacoes_carro.split("Teho,,, ")[1].split(",")[0];
        } 

        let topSpeed = null;

        if (especificacoes_carro.includes("Huippunopeus,,, ")) {
          topSpeed = especificacoes_carro
            .split("Huippunopeus,,, ")[1]
            .split(",")[0];
        } 

        let acceleration = null;

        if (especificacoes_carro.includes("Kiihtyvyys (0-100),,, ")) {
          acceleration = especificacoes_carro
            .split("Kiihtyvyys (0-100),,, ")[1]
            .split(",")[0];
        } 

        let numberOfPeople = null;

        if (especificacoes_carro.includes("Henkilömäärä,,, ")) {
          numberOfPeople = especificacoes_carro
            .split("Henkilömäärä,,, ")[1]
            .split(",")[0];
        } 

        let numberOfDoors = null;

        if (especificacoes_carro.includes("Ovien lkm,,, ")) {
          numberOfDoors = especificacoes_carro
            .split("Ovien lkm,,, ")[1]
            .split(",")[0];
        } 

        let meterReading;

        if (especificacoes_carro.includes("Mittarilukema,,, ")) {
          meterReading = especificacoes_carro
            .split("Mittarilukema,,, ")[1]
            .split(",")[0];
        } 

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
        seguranca_carro = seguranca_carro.replace("Turvallisuus ", "");
        seguranca_carro = seguranca_carro.replace("Turvallisuus", "");
        seguranca_carro = seguranca_carro.split(" ");
        seguranca_carro = seguranca_carro.filter((item, index) => {
          return seguranca_carro.indexOf(item) === index && item !== "";
        });

        let interior_carro = await pegarXPATH2(
          page,
          "Sisätilat ja mukavuudet",
          [
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
          ]
        );

        interior_carro = removerEmojis(interior_carro);

        interior_carro = interior_carro.replace("Sisätilat ja mukavuudet ", "");
        interior_carro = interior_carro.replace("Sisätilat ja mukavuudet ", "");

        interior_carro = interior_carro.split(" ");
        interior_carro = interior_carro.filter((item, index) => {
          return interior_carro.indexOf(item) === index && item !== "";
        });

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
        eletronica_carro = eletronica_carro.replace("Elektroniikka ", "");
        eletronica_carro = eletronica_carro.replace("Elektroniikka", "");

        eletronica_carro = eletronica_carro.split(" ");
        eletronica_carro = eletronica_carro.filter((item, index) => {
          return eletronica_carro.indexOf(item) === index && item !== "";
        });

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

        infor_adicionais_carro = infor_adicionais_carro.replace(
          "Lisätiedot ",
          ""
        );
        infor_adicionais_carro = infor_adicionais_carro.replace(
          "Lisätiedot",
          ""
        );

        infor_adicionais_carro = infor_adicionais_carro.replace("+", ",");
        infor_adicionais_carro = infor_adicionais_carro.replace(/\n/g, " ");

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
            const imagens = [];
            const elementos = document.querySelectorAll(
              ".swiper-slide .swiper-large-slider__image_main"
            );

            elementos.forEach((elemento) => {
              imagens.push(elemento.getAttribute("src"));
            });

            return imagens;
          });
        } catch (error) {
          imagem_carro = [];
        }

        const telefone = await pegarNumeroDeTelefoneEclicar(page);

        if (!page.isClosed()) {
          await FecharNav(navegador);
        }

        const carro = {
          id_car: id_carro,
          seller: nome_dono,
          name: nome_carro,
          price: preco_carro,
          owners: proprietarios_carro,
          condition: condic_car,
          mileage: quilometragem_carro,
          year: ano_carro ? parseInt(ano_carro.slice(0, 4)) : undefined,
          engine: motor_carro,
          gearbox: cambio_carro,
          inspected: inspecionado_carro,
          driveType: sistema_de_trans_carro,
          plate: placa_carro,
          power: power,
          topSpeed: topSpeed,
          acceleration: acceleration,
          numberOfPeople: numberOfPeople ? parseInt(numberOfPeople) : undefined,
          numberOfDoors: numberOfDoors ? parseInt(numberOfDoors) : undefined,
          safety: seguranca_carro,
          interior: interior_carro,
          electronics: eletronica_carro,
          additionalInfo: infor_adicionais_carro,
          others: outros_carro,
          images: imagem_carro,
          phone: telefone,
          link: link,
        };

        if (!(await carSchema.exists({ id_car: id_carro }))) {
          try {
            await carSchema.create(carro);

            console.log(`Carro ${id_carro} adicionado com sucesso!`);
          } catch (error) {
            console.log(`Erro ao adicionar carro ${id_carro}!`, error);
          }
        }
      }
    }
  }

  while (true) {
    await start();

    await sleep(7200000);
  }
}

function enviarJsonParaServidor() {}

iniciarBot();

setInterval(enviarJsonParaServidor, 3600000);
