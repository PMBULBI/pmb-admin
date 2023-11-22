import { UrlGetJalurById } from "../controller/template.js";

// Get Data Jalur Pendaftaran By Id
// Ambil terlebih dahulu id dari URL
const urlParams = new URLSearchParams(window.location.search);
const id_jalur = urlParams.get('id');

document.addEventListener("DOMContentLoaded", function () {
    // URL endpoint
    const apiUrl = UrlGetJalurById;
    // Buat fungsi untuk tampilkan data
    fetch(apiUrl + `?id=${id_jalur}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update nilai input pada formulir dengan data yang diterima
                document.getElementById('jalur').value = data.data.jalur;
                document.getElementById('nama_jalur').value = data.data.nama_jalur;
                document.getElementById('keterangan_jalur').value = data.data.keterangan_jalur;
            } else {
                alert('Gagal mendapatkan data. Silakan coba lagi.');
            }
        })
        .catch(error => console.error('Terjadi kesalahan:', error));
});

// Put Data Jalur Pendaftaran By Id
