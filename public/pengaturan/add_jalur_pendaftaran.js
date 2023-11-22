import { UrlPostJalur } from "../controller/template.js";
import { token } from "../controller/cookies.js";

var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

// Post Data Jalur Pendaftaran
// Buat fungsi untuk post data
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
          window.location.href = 'jalur_pendaftaran.html';
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
      console.error("Error while adding jalur pendaftaran data:", error);
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