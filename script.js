
/*
  GANTI NOMOR DI BAWAH DENGAN NOMOR WHATSAPP TOKO.
  Gunakan kode negara 62, tanpa tanda +, spasi, atau strip.
*/
const NOMOR_WA = "6281234567890";

const menu = [
  {
    id: 1,
    nama: "Seblak Original",
    harga: 10000,
    emoji: "🍜",
    deskripsi: "Seblak gurih dengan kerupuk dan bumbu khas."
  },
  {
    id: 2,
    nama: "Seblak Bakso Sosis",
    harga: 15000,
    emoji: "🍲",
    deskripsi: "Kerupuk, bakso, sosis, dan kuah pedas."
  },
  {
    id: 3,
    nama: "Seblak Ceker",
    harga: 18000,
    emoji: "🍗",
    deskripsi: "Seblak mantap dengan ceker empuk."
  },
  {
    id: 4,
    nama: "Seblak Komplit",
    harga: 22000,
    emoji: "🍛",
    deskripsi: "Bakso, sosis, ceker, telur, dan kerupuk."
  },
  {
    id: 5,
    nama: "Seblak Seafood",
    harga: 25000,
    emoji: "🦐",
    deskripsi: "Seblak spesial dengan topping seafood."
  },
  {
    id: 6,
    nama: "Seblak Mie",
    harga: 16000,
    emoji: "🍝",
    deskripsi: "Perpaduan mie dan kerupuk berbumbu."
  }
];

const topping = [
  { nama: "Telur", harga: 3000 },
  { nama: "Bakso", harga: 3000 },
  { nama: "Sosis", harga: 3000 },
  { nama: "Ceker", harga: 5000 },
  { nama: "Makaroni", harga: 2000 },
  { nama: "Keju", harga: 4000 }
];

let keranjang = [];

const rupiah = angka =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(angka);

function tampilkanMenu() {
  const grid = document.getElementById("menuGrid");

  grid.innerHTML = menu.map(item => `
    <article class="menu-card">
      <div class="food-emoji">${item.emoji}</div>
      <h3>${item.nama}</h3>
      <p>${item.deskripsi}</p>
      <div class="price">${rupiah(item.harga)}</div>

      <label for="pedas-${item.id}">Level pedas</label>
      <select id="pedas-${item.id}">
        <option value="0">Level 0 - Tidak pedas</option>
        <option value="1">Level 1 - Sedikit pedas</option>
        <option value="2" selected>Level 2 - Sedang</option>
        <option value="3">Level 3 - Pedas</option>
        <option value="4">Level 4 - Extra pedas</option>
        <option value="5">Level 5 - Super pedas</option>
      </select>

      <label for="topping-${item.id}">Topping tambahan</label>
      <select id="topping-${item.id}">
        <option value="-1">Tanpa topping tambahan</option>
        ${topping.map((t, i) => `
          <option value="${i}">${t.nama} (+${rupiah(t.harga)})</option>
        `).join("")}
      </select>

      <button class="add-button" onclick="tambahKeranjang(${item.id})">
        + Tambah ke keranjang
      </button>
    </article>
  `).join("");
}

function tambahKeranjang(id) {
  const item = menu.find(m => m.id === id);
  const level = document.getElementById(`pedas-${id}`).value;
  const pilihanTopping = Number(
    document.getElementById(`topping-${id}`).value
  );

  const tambahan = pilihanTopping >= 0
    ? topping[pilihanTopping]
    : null;

  const harga = item.harga + (tambahan ? tambahan.harga : 0);
  const toppingNama = tambahan ? tambahan.nama : "Tanpa topping";

  // Menu, level pedas, dan topping berbeda dihitung sebagai varian berbeda.
  const key = `${id}-${level}-${pilihanTopping}`;
  const existing = keranjang.find(k => k.key === key);

  if (existing) {
    existing.qty++;
  } else {
    keranjang.push({
      key,
      id,
      nama: item.nama,
      level,
      toppingNama,
      harga,
      qty: 1
    });
  }

  tampilkanKeranjang();

  document.getElementById("order").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function ubahJumlah(key, perubahan) {
  const item = keranjang.find(k => k.key === key);
  if (!item) return;

  item.qty += perubahan;

  if (item.qty <= 0) {
    keranjang = keranjang.filter(k => k.key !== key);
  }

  tampilkanKeranjang();
}

function hapusItem(key) {
  keranjang = keranjang.filter(k => k.key !== key);
  tampilkanKeranjang();
}

function tampilkanKeranjang() {
  const container = document.getElementById("cartItems");
  const total = keranjang.reduce(
    (sum, item) => sum + item.harga * item.qty, 0
  );

  document.getElementById("total").textContent = rupiah(total);

  if (keranjang.length === 0) {
    container.innerHTML =
      '<p class="empty-cart">Keranjangmu masih kosong nih.</p>';
    return;
  }

  container.innerHTML = keranjang.map(item => `
    <div class="cart-row">
      <div>
        <strong>${item.nama}</strong>
        <small>Level ${item.level} • ${item.toppingNama}</small>
        <small>${rupiah(item.harga)} / porsi</small>
        <button class="remove-button"
          onclick="hapusItem('${item.key}')">Hapus</button>
      </div>
      <div class="cart-controls">
        <button class="qty-button"
          onclick="ubahJumlah('${item.key}', -1)">−</button>
        <span>${item.qty}</span>
        <button class="qty-button"
          onclick="ubahJumlah('${item.key}', 1)">+</button>
      </div>
    </div>
  `).join("");
}

document.getElementById("checkoutForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    if (keranjang.length === 0) {
      alert("Keranjang masih kosong. Pilih menu seblak dulu ya!");
      return;
    }

    if (!/^62\d{8,15}$/.test(NOMOR_WA)) {
      alert("Nomor WhatsApp toko belum benar. Silakan ubah NOMOR_WA di script.js.");
      return;
    }

    const nama = document.getElementById("customerName").value.trim();
    const telepon = document.getElementById("customerPhone").value.trim();
    const jenis = document.getElementById("orderType").value;
    const alamat = document.getElementById("customerAddress").value.trim();
    const catatan = document.getElementById("notes").value.trim();

    if (!nama || !telepon) {
      alert("Nama dan nomor HP wajib diisi.");
      return;
    }

    if (jenis === "Diantar" && !alamat) {
      alert("Masukkan alamat pengantaran terlebih dahulu.");
      return;
    }

    const total = keranjang.reduce(
      (sum, item) => sum + item.harga * item.qty, 0
    );

    let pesan = `🌶️ *PESANAN SEBLAK YUK!*\n\n`;
    pesan += `Nama: ${nama}\n`;
    pesan += `No. HP pelanggan: ${telepon}\n`;
    pesan += `Jenis pesanan: ${jenis}\n`;

    if (alamat) pesan += `Alamat/catatan lokasi: ${alamat}\n`;

    pesan += `\n*DETAIL PESANAN:*\n`;

    keranjang.forEach((item, index) => {
      pesan += `\n${index + 1}. ${item.nama}\n`;
      pesan += `   Level pedas: ${item.level}\n`;
      pesan += `   Topping: ${item.toppingNama}\n`;
      pesan += `   Jumlah: ${item.qty} porsi\n`;
      pesan += `   Subtotal: ${rupiah(item.harga * item.qty)}\n`;
    });

    pesan += `\n*TOTAL: ${rupiah(total)}*\n`;
    pesan += `\nCatatan: ${catatan || "-"}\n`;
    pesan += `\nMohon konfirmasi ketersediaan dan ongkir. Terima kasih!`;

    const url = `https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }
);

tampilkanMenu();
tampilkanKeranjang();
