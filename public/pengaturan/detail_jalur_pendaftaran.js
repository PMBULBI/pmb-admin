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
// Buat terlebih dahulu event listener Update
const updateButton = document.querySelector('#updateButton')
updateButton.addEventListener('click', () => {
    const jalurUpdate = document.getElementById('jalur').value;
    const namaJalurUpdate = document.getElementById('nama_jalur').value;
    const keteranganJalurUpdate = document.getElementById('keterangan_jalur').value;
    const statusUpdate = document.getElementById('status').value;

    const updatedData = {
        jalur : jalurUpdate,
        nama_jalur : namaJalurUpdate,
        keterangan_jalur : keteranganJalurUpdate,
        status : statusUpdate
    };

    if (isDataChanged(data, updatedData)) {
        
    }
})

// Fungsi untuk membandingkan apakah ada perubahan pada data
function isDataChanged(existingData, newData) {
	return (
		existingData.jalur !== newData.jalur ||
		existingData.nama_jalur !== newData.nama_jalur ||
		existingData.keterangan_jalur !== newData.keterangan_jalur ||
        existingData.status != newData.status
	);
}

