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

// C2: Filtre ve arama
let seciliTur = "tumu";
let aramaMetni = "";

const filtreDugmeleri = document.querySelectorAll(".filtre");
const aramaKutusu = document.getElementById("arama");

// Secili ture ve arama metnine gore listeyi suzup yeniden cizer
function listeyiGuncelle() {
  const sonuc = etkinlikler.filter(function (etkinlik) {
    const turUyuyor = seciliTur === "tumu" || etkinlik.tur === seciliTur;
    const baslik = etkinlik.baslik.toLocaleLowerCase("tr-TR");
    const aramaUyuyor = baslik.includes(aramaMetni);
    return turUyuyor && aramaUyuyor;
  });

  kartlariCiz(sonuc);

  if (sonuc.length === 0) {
    durumYazisi.textContent = "Aramanıza uygun etkinlik yok.";
  } else {
    durumYazisi.textContent = "";
  }
}

// Filtre dugmelerine tiklama olayi
filtreDugmeleri.forEach(function (dugme) {
  dugme.addEventListener("click", function () {
    filtreDugmeleri.forEach(function (d) {
      d.classList.remove("secili");
    });
    dugme.classList.add("secili");
    seciliTur = dugme.dataset.tur;
    listeyiGuncelle();
  });
});

// Arama kutusuna her yazildiginda calisir
aramaKutusu.addEventListener("input", function () {
  aramaMetni = aramaKutusu.value.trim().toLocaleLowerCase("tr-TR");
  listeyiGuncelle();
});

// Sayfa ilk acildiginda tum etkinlikleri goster
listeyiGuncelle();
// C3: Form dogrulama
const form = document.getElementById("oneri-formu");
const formMesaj = document.getElementById("form-mesaj");

form.addEventListener("submit", function (olay) {
  olay.preventDefault(); // sayfanin yenilenmesini durdur

  const ad = form.ad.value.trim();
  const tarih = form.tarih.value;
  const eposta = form.eposta.value.trim();
  const hatalar = [];

  // 1) Ad en az 5 karakter olmali
  if (ad.length < 5) {
    hatalar.push("Etkinlik adı en az 5 karakter olmalıdır.");
  }

  // 2) Tarih bos ya da gecmis bir gun olamaz
  if (tarih === "") {
    hatalar.push("Tarih boş bırakılamaz.");
  } else {
    const secilenTarih = new Date(tarih + "T00:00:00");
    const bugun = new Date();
    bugun.setHours(0, 0, 0, 0); // saati sifirla, sadece gunu karsilastir
    if (secilenTarih < bugun) {
      hatalar.push("Tarih geçmiş bir gün olamaz.");
    }
  }

  // 3) E-posta gecerli bicimde olmali
  const epostaKalibi = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!epostaKalibi.test(eposta)) {
    hatalar.push("Geçerli bir e-posta adresi giriniz.");
  }

  // Sonucu goster
  if (hatalar.length > 0) {
    formMesaj.className = "hata";
    formMesaj.textContent = hatalar.join("\n");
  } else {
    formMesaj.className = "basarili";
    formMesaj.textContent = "Teşekkürler! Etkinlik öneriniz alındı.";
    form.reset();
  }
});