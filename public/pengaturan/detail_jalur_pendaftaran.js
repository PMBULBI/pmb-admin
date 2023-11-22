import { UrlGetJalurById } from "../controller/template.js";

// Get Data Jalur Pendaftaran By Id
// Ambil terlebih dahulu id dari URL
const urlParams = new URLSearchParams(window.location.search);
const id_jalur = urlParams.get('id_jalur');

document.addEventListener("DOMContentLoaded", function () {
    // Pilih element by id
    const jalurElement = document.getElementById("jalur");
    const namaJalurElement = document.getElementById("nama_jalur");
    const keteranganJalurElement = document.getElementById("keterangan_jalur");
    const statusElement = document.getElementById("status");

    // Buat fungsi untuk tampilkan data
    function fetchDataAndDisplay() {
        fetch(UrlGetJalurById + `?id_jalur=${id_jalur}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.code === 200 && data.success) {
                    const jalurDetails = data.data;

                    jalurElement.textContent = jalurDetails.jalur;
                    namaJalurElement.textContent = jalurDetails.nama_jalur;
                    keteranganJalurElement.textContent = jalurDetails.keterangan_jalur;
                    statusElement.textContent = jalurDetails.status;
                } else {
                    console.error(data.status);
                }
            })
            .catch((error) => {
                console.error("Error fetching data : ", error);
            })
    }
    fetchDataAndDisplay();
})