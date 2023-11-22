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
document.addEventListener("DOMContentLoaded", function() {
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
        showConfirmationAlert(updatedData);
    } else {
        showNoChangeAlert();
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

// Fungsi untuk menampilkan alert konfirmasi perubahan data
function showConfirmationAlert(data) {
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
			updateEmployeeData(data);
			// Menampilkan Data Alert Success
			Swal.fire({
				icon: 'success',
				title: 'Sukses!',
				text: 'Jalur Pendaftaran Berhasil Diperbarui',
				showConfirmButton: false,
				timer: 1500
			}).then(() => {
				window.location.href = 'jalur_pendaftaran.html';
			});
		} else {
			// Menampilkan Data Alert Error
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Jalur Pendaftaran Gagal Diperbarui!',
			});
		}
	});
}

// Fungsi untuk menampilkan alert jika tidak ada perubahan pada data
function showNoChangeAlert() {
	Swal.fire({
		icon: 'warning',
		title: 'Oops...',
		text : 'Tidak Ada Perubahan Data'
	});
}

// Untuk Update data ke data presensi
function updateJalurPendaftaran(data) {
	fetch(`https://komarbe.ulbi.ac.id/jalur/post?id=${id_jalur}`, {
		method: "PATCH",
		headers: header,
		body: JSON.stringify(data)
	})
		.catch(error => {
			console.error("Error saat melakukan PATCH data:", error);
		});
}
});