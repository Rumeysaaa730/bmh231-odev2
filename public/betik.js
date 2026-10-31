// C1: Simdilik veriyi betigin icinde tanimliyoruz (D2'de API'den gelecek)
let etkinlikler = [
  { id: 1, baslik: "Git ve GitHub Atolyesi", tur: "atolye", tarih: "2026-11-12", yer: "Muhendislik Fakultesi Lab-2", kontenjan: 30 },
  { id: 2, baslik: "Web Programlama Atolyesi", tur: "atolye", tarih: "2026-11-14", yer: "Muhendislik Fakultesi Lab-1", kontenjan: 25 },
  { id: 3, baslik: "Yapay Zeka Soylesisi", tur: "soylesi", tarih: "2026-11-18", yer: "Konferans Salonu", kontenjan: 200 },
  { id: 4, baslik: "Yazilim Kariyeri Soylesisi", tur: "soylesi", tarih: "2026-11-21", yer: "Rektorluk Konferans Salonu", kontenjan: 150 },
  { id: 5, baslik: "Fotografcilik Toplulugu Tanisma Gunu", tur: "topluluk", tarih: "2026-11-25", yer: "Ogrenci Merkezi", kontenjan: 60 },
  { id: 6, baslik: "Siber Guvenlik Toplulugu Bulusmasi", tur: "topluluk", tarih: "2026-11-28", yer: "Kutuphane Seminer Odasi", kontenjan: 120 }
];

// Sayfadaki ogeleri seciyoruz
const kartlarKutusu = document.getElementById("kartlar");
const durumYazisi = document.getElementById("durum");

// Tur adlarini ekranda Turkce gostermek icin
const turAdlari = {
  atolye: "Atölye",
  soylesi: "Söyleşi",
  topluluk: "Topluluk"
};

// Tek bir etkinlik icin kart olusturan fonksiyon
function kartOlustur(etkinlik) {
  const kart = document.createElement("article");
  kart.className = "kart";

  const baslik = document.createElement("h3");
  baslik.textContent = etkinlik.baslik;

  const etiket = document.createElement("span");
  etiket.className = "etiket";
  etiket.textContent = turAdlari[etkinlik.tur];

  const tarih = document.createElement("p");
  const tarihNesnesi = new Date(etkinlik.tarih + "T00:00:00");
  tarih.textContent = "Tarih: " + tarihNesnesi.toLocaleDateString("tr-TR");

  const yer = document.createElement("p");
  yer.textContent = "Yer: " + etkinlik.yer;

  const kontenjan = document.createElement("p");
  kontenjan.textContent = "Kontenjan: " + etkinlik.kontenjan + " kişi";

  kart.append(baslik, etiket, tarih, yer, kontenjan);
  return kart;
}

// Verilen listedeki tum etkinlikleri ekrana cizen fonksiyon
function kartlariCiz(liste) {
  kartlarKutusu.replaceChildren(); // once eski kartlari temizle

  liste.forEach(function (etkinlik) {
    kartlarKutusu.append(kartOlustur(etkinlik));
  });
}

kartlariCiz(etkinlikler);