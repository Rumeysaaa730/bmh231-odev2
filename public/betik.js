// Veriler artik API'den gelecek (D2), bu yuzden dizi bos basliyor
let etkinlikler = [];

// Sayfadaki ogeleri seciyoruz
const kartlarKutusu = document.getElementById("kartlar");
const durumYazisi = document.getElementById("durum");

// Tur adlarini ekranda Turkce gostermek icin
const turAdlari = {
  atolye: "Atölye",
  soylesi: "Söyleşi",
  topluluk: "Topluluk"
};

// C1: Tek bir etkinlik icin kart olusturan fonksiyon
function kartOlustur(etkinlik) {
  const kart = document.createElement("article");
  kart.className = "kart";

  const baslik = document.createElement("h2");
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

  durumYazisi.className = "";
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

// D2: Etkinlikleri API'den fetch ile cek
async function etkinlikleriYukle() {
  durumYazisi.className = "";
  durumYazisi.textContent = "Yükleniyor...";

  try {
    const yanit = await fetch("/api/etkinlikler");

    if (!yanit.ok) {
      throw new Error("Sunucu hatası: " + yanit.status);
    }

    etkinlikler = await yanit.json();
    listeyiGuncelle(); // C1 ve C2'deki cizim kodunu kullan
  } catch (hata) {
    console.error("Etkinlikler yüklenemedi:", hata);
    durumYazisi.className = "hata";
    durumYazisi.textContent = "Etkinlikler yüklenemedi. Sunucunun çalıştığından emin olup sayfayı yenileyin.";
  }
}

// Sayfa acildiginda verileri yukle
etkinlikleriYukle();