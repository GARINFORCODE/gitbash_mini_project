let nomor = 1;
let kursiDipilih = "";
let kategoriDipilih = "";
let hargaDipilih = 0;

let keranjang = {
    popcorn: 0,
    minuman: 0,
    kaos: 0,
    lightstick: 0
};

const hargaItem = {
    popcorn: 50000,
    minuman: 30000,
    kaos: 250000,
    lightstick: 400000
};

function pilihKursi(tombol, warnaBootstrap) {
    let semuaKursi = document.querySelectorAll(".kursi");
    let kursiSaatIni = tombol.innerText.trim();

    if (kursiSaatIni.startsWith("VV")) {
        warnaBootstrap = "primary";
    } else if (kursiSaatIni.startsWith("V")) {
        warnaBootstrap = "danger";
    } else if (kursiSaatIni.startsWith("F")) {
        warnaBootstrap = "warning";
    }

    semuaKursi.forEach(function(kursi) {
        kursi.className = kursi.className.replace(/bg-\w+/g, "").replace(/text-white/g, "");
        kursi.classList.remove("btn-outline-primary", "btn-outline-danger", "btn-outline-warning");

        if (kursi.innerText.trim().startsWith("VV")) {
            kursi.classList.add("btn-outline-primary");
        } else if (kursi.innerText.trim().startsWith("V")) {
            kursi.classList.add("btn-outline-danger");
        } else if (kursi.innerText.trim().startsWith("F")) {
            kursi.classList.add("btn-outline-warning");
        }
    });

    tombol.classList.remove(`btn-outline-${warnaBootstrap}`);
    tombol.classList.add(`bg-${warnaBootstrap}`, "text-white");
    kursiDipilih = kursiSaatIni;

    if (kursiDipilih.startsWith("VV")) {
        kategoriDipilih = "VVIP";
        hargaDipilih = 6000000;
    } else if (kursiDipilih.startsWith("V")) {
        kategoriDipilih = "VIP";
        hargaDipilih = 4000000;
    } else if (kursiDipilih.startsWith("F")) {
        kategoriDipilih = "FESTIVAL";
        hargaDipilih = 2000000;
    }

    document.getElementById("hasilKursi").innerText = kursiDipilih;
    document.getElementById("hasilKategori").innerText = kategoriDipilih;
    document.getElementById("hasilHarga").innerText = "Rp" + hargaDipilih.toLocaleString("id-ID");
}

function ubahJumlah(item, perubahan) {
    keranjang[item] += perubahan;

    if (keranjang[item] < 0) {
        keranjang[item] = 0;
    }
    document.getElementById("jumlah-" + item).innerText = keranjang[item];
    hitungTotalTambahan();
}

function hitungTotalTambahan() {
    let total = 0;
    total += keranjang.popcorn * hargaItem.popcorn;
    total += keranjang.minuman * hargaItem.minuman;
    total += keranjang.kaos * hargaItem.kaos;
    total += keranjang.lightstick * hargaItem.lightstick;

    document.getElementById("totalTambahan").innerText = "Rp" + total.toLocaleString("id-ID");
    return total;
}

function pesanTiket() {
    // Mengambil value input yang benar sesuai ID di HTML
    let nama = document.getElementById("nama").value.trim();
    let umur = document.getElementById("umur").value.trim();
    let nomorHp = document.getElementById("nomorHp").value.trim();
    let email = document.getElementById("email").value.trim();

    // Validasi Data Diri & Kursi
    if (nama === "" || umur === "" || nomorHp === "" || email === "") {
        alert("Silakan lengkapi seluruh biodata Anda terlebih dahulu!");
        return;
    }
    if (!kursiDipilih) {
        alert("Silakan pilih kursi Anda terlebih dahulu!");
        return;
    }

    // Hitung rincian biaya
    let totalTambahan = hitungTotalTambahan();
    let totalBayar = hargaDipilih + totalTambahan;
    
    // Generate ID Tiket Acak (Contoh: BP-8372)
    let idTiket = "BP-" + Math.floor(1000 + Math.random() * 9000);

    // Format string untuk Food & Drink serta Merchandise ke Tabel
    let foodDrinkText = `Popcorn: ${keranjang.popcorn}, Drink: ${keranjang.minuman}`;
    let merchText = `T-Shirt: ${keranjang.kaos}, Lightstick: ${keranjang.lightstick}`;

    // 1. TAMPILKAN STRUK TIKET DI #hasilTiket
    let detailTiketHTML = `
            <div class="text-dark p-2 row">
              <div
                class="col-md-3 pt-4 border-top text-center bg-white rounded p-2 shadow-sm d-flex flex-column align-items-center justify-content-center"
              >
                <div id="qrcode" class="mb-2 mt-3"></div>
                <small class="text-muted text-center d-block"
                  >Scan QR Code ini di pintu masuk stadion.</small
                >
              </div>
              <div class="col-md-4 text-center border-bottom pb-3 pt-2 mb-3">
                <h4 class="fw-bold text-uppercase txt-pink mt-5 mb-1">
                  E-Ticket BLACKPINK Jakarta
                </h4>
                <small class="text-muted"
                  >ID TICKET:
                  <span class="fw-bold text-dark">${idTiket}</span></small
                >
              </div>
              <div class="col-md-4 row g-3">
                <div class="col-6">
                  <small class="text-muted d-block">Nama Penonton</small>
                  <span class="fw-bold">${nama} (${umur} Thn)</span>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block">Kategori Kelas</small>
                  <span class="badge bg-dark fs-6">${kategoriDipilih}</span>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block">Nomor Kursi</small>
                  <span class="fw-bold text-danger fs-5">${kursiDipilih}</span>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block">Total Pembayaran</small>
                  <span class="fw-bold text-success fs-5"
                    >Rp${totalBayar.toLocaleString("id-ID")}</span
                  >
                </div>
              </div>
            </div>
    `;
    document.getElementById("hasilTiket").innerHTML = detailTiketHTML;

    // Generate QR Code otomatis memanfaatkan library qrcode.js yang sudah kamu load di HTML
    new QRCode(document.getElementById("qrcode"), {
        text: idTiket,
        width: 128,
        height: 128
    });

    // 2. MASUKKAN DATA KE DALAM TABEL #isiTabel
    let tabelBodi = document.getElementById("isiTabel");
    let barisBaru = document.createElement("tr");

    barisBaru.innerHTML = `
        <td>${nomor++}</td>
        <td class="fw-bold text-secondary">${idTiket}</td>
        <td class="text-start">${nama}</td>
        <td>${email}</td>
        <td>${nomorHp}</td>
        <td><span class="badge bg-secondary">${kategoriDipilih}</span></td>
        <td>Rp${hargaDipilih.toLocaleString("id-ID")}</td>
        <td class="fw-bold text-primary">${kursiDipilih}</td>
        <td>${foodDrinkText}</td>
        <td>${merchText}</td>
        <td class="fw-bold text-success">Rp${totalBayar.toLocaleString("id-ID")}</td>
    `;
    tabelBodi.appendChild(barisBaru);

    // 3. RESET FORM & STATE UNTUK PEMESAN SELANJUTNYA
    document.getElementById("nama").value = "";
    document.getElementById("umur").value = "";
    document.getElementById("nomorHp").value = "";
    document.getElementById("email").value = "";
    
    // Reset Keranjang Belanja
    for (let key in keranjang) {
        keranjang[key] = 0;
        document.getElementById("jumlah-" + key).innerText = 0;
    }
    
    // Reset Tampilan Ringkasan Kursi bawah peta
    document.getElementById("hasilKursi").innerText = "Belum dipilih";
    document.getElementById("hasilKategori").innerText = "-";
    document.getElementById("hasilHarga").innerText = "-";
    document.getElementById("totalTambahan").innerText = "Rp0";

    // Kembalikan warna semua tombol kursi ke outline semula
    let semuaKursi = document.querySelectorAll(".kursi");
    semuaKursi.forEach(function(kursi) {
        kursi.className = kursi.className.replace(/bg-\w+/g, "").replace(/text-white/g, "");
        if (kursi.innerText.trim().startsWith("VV")) {
            kursi.classList.add("btn-outline-primary");
        } else if (kursi.innerText.trim().startsWith("V")) {
            kursi.classList.add("btn-outline-danger");
        } else if (kursi.innerText.trim().startsWith("F")) {
            kursi.classList.add("btn-outline-warning");
        }
    });

    kursiDipilih = "";
    kategoriDipilih = "";
    hargaDipilih = 0;

    alert("Tiket berhasil dipesan! Data Anda telah direkam ke tabel dan tiket fisik siap dicetak.");
    
    // Auto scroll ke section tiket agar user langsung melihat hasilnya
    document.getElementById("tiket").scrollIntoView({ behavior: 'smooth' });
}