async function cariSurat() {
    const input = document
        .getElementById("inputSurat")
        .value
        .toLowerCase();

    const hasil = document.getElementById("hasil");

    try {
        const res = await fetch(
            "https://equran.id/api/v2/surat"
        );

        const data = await res.json();

        const surat = data.data.find(item =>
            item.nomor == input ||
            item.namaLatin.toLowerCase() === input ||
            item.nama.toLowerCase() === input
        );

        if (!surat) {
            hasil.innerHTML = `
                <p class="error">
                    Surat tidak ditemukan.
                </p>
            `;
            return;
        }

        hasil.innerHTML = `
            <div class="card">
                <div class="nama-arab">
                    ${surat.nama}
                </div>

                <div class="nama-latin">
                    ${surat.namaLatin}
                </div>

                <div class="info">
                    <div class="box">
                        <strong>Nomor Surat</strong>
                        <p>${surat.nomor}</p>
                    </div>

                    <div class="box">
                        <strong>Jumlah Ayat</strong>
                        <p>${surat.jumlahAyat}</p>
                    </div>

                    <div class="box">
                        <strong>Tempat Turun</strong>
                        <p>${surat.tempatTurun}</p>
                    </div>

                    <div class="box">
                        <strong>Arti</strong>
                        <p>${surat.arti}</p>
                    </div>
                </div>

                <div class="deskripsi">
                    <strong>Deskripsi:</strong>
                    <p>${surat.deskripsi}</p>
                </div>
            </div>
        `;

    } catch (error) {
        hasil.innerHTML = `
            <p class="error">
                Gagal mengambil data.
            </p>
        `;
        console.log(error);
    }
}