// Import library yang dibutuhkan
import { UrlGetPendaftarById } from "../controller/template.js";
import { formatTanggalWaktu } from "../style/formatdate.js";
import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";

// Untuk Get Token
const token = CihuyGetCookie("login");

// Untuk Get Data Pembuat Akun By ID
// Ambil terlebih dahulu id dari URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

document.addEventListener("DOMContentLoaded", function () {
    // URL endpoint
    const apiUrl = UrlGetPendaftarById;
  
    // Select elements by ID
    const namaMhsElement = document.getElementById("nama_mhs");
    const noHandphoneElement = document.getElementById("no_handphone");
    const emailElement = document.getElementById("email");
    const tglDaftarAkunElement = document.getElementById("tgl_daftar_akun");
    const asalSekolahElement = document.getElementById("asal_sekolah");
    const kotaSekolahElement = document.getElementById("kota_sekolah");
    const provinsiSekolahElement = document.getElementById("provinsi_sekolah");
  
    // Function to fetch and display data
    function fetchDataAndDisplay() {
      // Fetch data from the API
      CihuyDataAPI(`${apiUrl}?id=${id}`, token, function (error, data) {
        if (error) {
            tablebody.innerHTML = `<tr><td colspan="5">Terjadi kesalahan: ${error.message}</td></tr>`;
        } else {
          if (data.code === 200 && data.success) {
            const dataDetails = data.data;

            // Ubah format tanggal
            const tglDaftar = new Date(dataDetails.tgl_daftar_mhs);
            const formattedTglDaftar = formatTanggalWaktu(tglDaftar);
  
            // Populate HTML elements with data
            namaMhsElement.textContent = dataDetails.nama_mhs;
            noHandphoneElement.textContent = `Nomor Whatsapp: ${dataDetails.hp_mhs}`;
            emailElement.textContent = `Email: ${dataDetails.email_mhs}`;
            tglDaftarAkunElement.value = formattedTglDaftar;
            asalSekolahElement.value = dataDetails.asal_sekolah;
            kotaSekolahElement.value = dataDetails.kota_sekolah;
            provinsiSekolahElement.value = dataDetails.provinsi_sekolah;
          } else {
            console.error("Failed to fetch data:", data.status);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    }
  
    // Call the function to fetch and display data
    fetchDataAndDisplay();
  });