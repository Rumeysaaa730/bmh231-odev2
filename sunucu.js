// Sadece Node.js'in kendi modulleri kullaniliyor (Express yok)
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const PUBLIC_KLASORU = path.join(__dirname, "public");
const VERI_DOSYASI = path.join(__dirname, "etkinlikler.json");

// Dosya uzantisina gore Content-Type
const icerikTurleri = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

// JSON yanit gonderen yardimci fonksiyon
function jsonGonder(yanit, durumKodu, veri) {
  yanit.writeHead(durumKodu, { "Content-Type": "application/json; charset=utf-8" });
  yanit.end(JSON.stringify(veri));
}

// Duz metin yanit gonderen yardimci fonksiyon
function metinGonder(yanit, durumKodu, metin, ekBasliklar) {
  const basliklar = { "Content-Type": "text/plain; charset=utf-8", ...ekBasliklar };
  yanit.writeHead(durumKodu, basliklar);
  yanit.end(metin);
}

const sunucu = http.createServer(function (istek, yanit) {
  // Her istegin yontemini ve yolunu terminale yaz
  console.log(istek.method + " " + istek.url);

  // 1) GET disindaki yontemler: 405
  if (istek.method !== "GET") {
    metinGonder(yanit, 405, "Bu yönteme izin verilmiyor.", { "Allow": "GET" });
    return;
  }

  // Adresi URL sinifiyla parcaliyoruz
  const adres = new URL(istek.url, "http://localhost:" + PORT);
  const yol = adres.pathname;

  // 2) API istekleri
  if (yol === "/api/etkinlikler" || yol.startsWith("/api/etkinlikler/")) {
    fs.readFile(VERI_DOSYASI, "utf-8", function (hata, icerik) {
      if (hata) {
        jsonGonder(yanit, 500, { hata: "Veri okunamadı" });
        return;
      }

      const etkinlikler = JSON.parse(icerik);

      // GET /api/etkinlikler ve GET /api/etkinlikler?tur=atolye
      if (yol === "/api/etkinlikler") {
        const tur = adres.searchParams.get("tur");
        if (tur) {
          const suzulmus = etkinlikler.filter(function (e) {
            return e.tur === tur;
          });
          jsonGonder(yanit, 200, suzulmus);
        } else {
          jsonGonder(yanit, 200, etkinlikler);
        }
        return;
      }

      // GET /api/etkinlikler/3
      const parcalar = yol.split("/"); // ["", "api", "etkinlikler", "3"]
      const id = Number(parcalar[3]);
      const etkinlik = etkinlikler.find(function (e) {
        return e.id === id;
      });

      if (etkinlik) {
        jsonGonder(yanit, 200, etkinlik);
      } else {
        jsonGonder(yanit, 404, { hata: "Etkinlik bulunamadı" });
      }
    });
    return;
  }

  // 3) public klasorundeki dosyalar
  const istenenDosya = yol === "/" ? "index.html" : yol;
  const dosyaYolu = path.join(PUBLIC_KLASORU, istenenDosya);

  // public klasorunun disina cikilmasini engelle
  if (!dosyaYolu.startsWith(PUBLIC_KLASORU + path.sep)) {
    metinGonder(yanit, 404, "Sayfa bulunamadı.");
    return;
  }

  const uzanti = path.extname(dosyaYolu);
  const icerikTuru = icerikTurleri[uzanti];

  if (!icerikTuru) {
    metinGonder(yanit, 404, "Sayfa bulunamadı.");
    return;
  }

  fs.readFile(dosyaYolu, function (hata, icerik) {
    if (hata) {
      metinGonder(yanit, 404, "Sayfa bulunamadı.");
      return;
    }
    yanit.writeHead(200, { "Content-Type": icerikTuru });
    yanit.end(icerik);
  });
});

sunucu.listen(PORT, function () {
  console.log("Sunucu çalışıyor: http://localhost:" + PORT);
});
