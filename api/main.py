from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

cars = [
    {
        "nome": "Ford Focus",
        "ID": "ID 14754696",
        "placa": "FIY-463 - Vaasa, Pohjanmaa",
        "vendedor": "Joel Algren",
        "preco": "1 350 €",
        "data": "Päivitetty 13.12.2024",
        "condicao": "Não encontrado",
        "contato": "+358465881143",
        "quilometragem": "423 000 km",
        "ano": "2008 (ensirek. 9-2008)",
        "motor": "1.6 l, Diesel",
        "cambio": "Manuaali",
        "proprietarios": "Não encontrado",
        "inspecionado": "12-2024",
        "sistema_de_transmissao": "Etuveto",
        "especificacoes": {
            "teho": "66 kW / 90 Hv",
            "torque": "215 Nm",
            "velocidade_maxima": "177 km/h",
            "aceleracao_0_100": "12,90 s",
            "peso": "1 386 kg",
            "consumo": {
                "cidade": "5,6 l/100 km",
                "estrada": "3,8 l/100 km",
                "combinado": "4,5 l/100 km"
            }
        },
        "seguranca": [
            "Ajonvakautusjärjestelmä",
            "Luistonestojärjestelmä",
            "Sumuvalot",
            "Varashälytin",
            "Käynnistyksenesto",
            "Lukkiutumattomat jarrut (ABS)",
            "Turvatyynyt"
        ],
        "interior_comodidades": [
            "Ajotietokone",
            "Kaadettavat takaistuimet",
            "Ohjaustehostin",
            "Sähkökäyttöiset ikkunat",
            "Ilmastointi: Manuaalinen",
            "Penkinlämmittimet"
        ],
        "eletronica": [
            "Äänentoistojärjestelmä"
        ],
        "informacoes_adicionais": "Myyntiin juuri leimattu Ford Focus. Auto on suht siistissä kunnossa sisältä ja päältä. 423tkm, ei kilisee tai kolise.",
        "outros": [
            "Kahdet renkaat",
            "Sadetunnistin",
            "Vetokoukku",
            "Turbo"
        ],
        "imagem": "https://images.nettiauto.com/live/2024/12/13/54b7bc5aa257bb69-medium.jpg"
    },
    {
        "nome": "BMW M550d",
        "ID": "ID 14754695",
        "placa": "XNL-613 - Kittilä, Lappi",
        "vendedor": "Arttu Majava",
        "preco": "22 500 €",
        "data": "Päivitetty 13.12.2024",
        "condicao": "Sport A xDrive F11 Touring",
        "contato": "0409643694",
        "quilometragem": "240 000 km",
        "ano": "2012 (ensirek. 12-2012)",
        "motor": "3.0 l, Diesel",
        "cambio": "Automaatti",
        "proprietarios": "Não encontrado",
        "inspecionado": "Não encontrado",
        "sistema_de_transmissao": "Neliveto",
        "especificacoes": {
            "teho": "280 kW / 381 Hv",
            "torque": "740 Nm",
            "velocidade_maxima": "250 km/h",
            "aceleracao_0_100": "4,7 s",
            "peso": "2 065 kg",
            "consumo": {
                "cidade": "7,2 l/100 km",
                "estrada": "6,0 l/100 km",
                "combinado": "6,4 l/100 km"
            }
        },
        "seguranca": [
            "Ajonvakautusjärjestelmä",
            "Lukkiutumattomat jarrut (ABS)",
            "Turvatyynyt"
        ],
        "interior_comodidades": [
            "Vakionopeudensäädin",
            "Sähköpeilit",
            "Ilmastointi: Automaattinen"
        ],
        "eletronica": [
            "Navigointijärjestelmä",
            "Äänentoistojärjestelmä"
        ],
        "informacoes_adicionais": "Erittäin siisti auto, jossa hyvä huoltohistoria.",
        "outros": [
            "Sadetunnistin",
            "Panoraamakatto",
            "Vetokoukku"
        ],
        "imagem": "https://images.nettiauto.com/live/2024/12/13/54b7bc5aa257bb70-medium.jpg"
    }
]

origins = [
    "http://localhost",
    "http://localhost:3333",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def map_cars(cars):
    for car in cars:
        car["ID"] = car["ID"].replace("ID ", "")
        car["preco"] = car["preco"].replace(" €", "")
        car["preco"] = car["preco"].replace(" ", "")

        car["data"] = car["data"].replace("Päivitetty", "")
        car["quilometragem"] = car["quilometragem"].replace(" km", "")
        car["quilometragem"] = car["quilometragem"].replace(" ", "")
        
        car["especificacoes"]["peso"] = car["especificacoes"]["peso"].replace(" kg", "")
        car["especificacoes"]["peso"] = car["especificacoes"]["peso"].replace(" ", "")

    return cars

@app.get("/")
def read_root():
    return {"message": "ok"}

@app.get("/carros")
def get_cars():
    return map_cars(cars)
