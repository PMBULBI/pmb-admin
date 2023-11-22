import { UrlGetJalurById, UrlPostJalur, UrlPutJalur } from "../controller/template.js";
import { token } from "../controller/cookies.js";

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

// Post Data Jalur Pendaftaran
var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

function addJalurPendaftaran(postData) {
    fetch(UrlPostJalur, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Display success SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Jalur Pendaftaran Berhasil Ditambahkan!',
        }).then(() => {
          // Refresh the page after successful addition
          window.location.href = 'seluruh-karyawan.html';
        });
      } else {
        // Display error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Jalur Pendaftaran Gagal Ditambahkan!',
        });
      }
    })
    .catch(error => {
      console.error("Error while adding employee data:", error);
    });
}

// Event listener for the "Tambah Karyawan" button
const tambahButton = document.querySelector('#tambahButton');
tambahButton.addEventListener('click', () => {
  // Get input values
  const jalurInput = document.querySelector('#jalur').value;
  const namaJalurInput = document.querySelector('#nama_jalur').value;
  const keteranganJalurInput = document.querySelector('#keterangan_jalur').value;
  const statusInput = document.querySelector('#status').value;
  
  // Check if any of the fields is empty
  if (!jalurInput || !namaJalurInput || !keteranganJalurInput || !statusInput) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Semua field harus diisi!',
    });
    return; // Stop further processing
  }

  // Create a data object to be sent
  const postData = {
    jalur: jalurInput,
    nama_jalur: namaJalurInput,
    keterangan_jalur: keteranganJalurInput,
    status: statusInput
  };
  
  // Display SweetAlert for confirmation
  Swal.fire({
    title: 'Tambah Jalur',
    text: 'Anda Yakin Menambah Jalur Pendaftaran?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      // Call function to add employee data
      addJalurPendaftaran(postData);
    }
  });
});

// Put Data Jalur Pendaftaran By Id
// Buat terlebih dahulu event listener Update
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('updateButton').addEventListener('click', function () {
        Swal.fire({
            title: 'Perubahan Jalur Pendaftaran',
            text: "Apakah anda yakin ingin melakukan perubahan?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedData = {
                    jalur: document.getElementById('jalur').value,
                    nama_jalur: document.getElementById('nama_jalur').value,
                    keterangan_jalur: document.getElementById('keterangan_jalur').value,
                    status: document.getElementById('status').value
                };

                fetch(UrlPutJalur + `?id=${id_jalur}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                })
                .then(response => response.json())
                .then(data => {
                    // Add SweetAlert2 success alert
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukses!',
                        text: 'Jalur Pendaftaran Berhasil Diperbarui',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = 'jalur_pendaftaran.html'
                        console.log('Update successful:', data);
                    })
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Jalur pendaftaran Gagal Diperbarui!',
                    });
                    console.error('Error updating data:', error);
                });
            }
        });
    });
});