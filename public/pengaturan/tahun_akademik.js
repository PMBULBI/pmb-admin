// Import library yang dibutuhkan
import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { UrlGetTahunAkademik, UrlGetTahunAkademikById, UrlPostTahunAkademik, UrlPutTahunAkademik, UrlDeleteTahunAkademik } from "../controller/template.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { getValue } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.0.5/croot.js";
import { get } from "https://jscroot.github.io/api/croot.js";
import { token } from "../controller/cookies.js";

var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

// Get Data Tahun akademik
CihuyDomReady(() => {
    const tablebody = CihuyId("tablebody");
    const buttonPreviousPage = CihuyId("prevPageBtn");
    const buttonNextPage = CihuyId("nextPageBtn");
    const halamanSaatIni = CihuyId("currentPage");
    const itemPerPage = 8;
    let halamannow = 1;

    // Untuk Get All Data Pendaftar
    fetch(UrlGetTahunAkademik)
    .then((result) => {
        return result.json();
    })
    .then((data) => {
        let tableData = "";
        data.data.map((values, index) => {
            // Manipulasi data pegawai dan masukkan ke dalam bentuk tabel
            tableData += `
                        <tr style="text-align: center; vertical-align: middle">
                        <td>
                        <div class="min-width">
                            <p>${index + 1}</p>
                        </div>
                        </td>
                        <td class="min-width">
                            <p>${values.tahun_akademik}</p>
                        </td>
                        <td class="min-width">
                            <p>${values.kode_tahun}</p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <button type="button" class="btn btn-warning" style="color: white;" tahunakademik-id=${values.id_tahun_akademik} data-bs-toggle="modal" data-bs-target="#update-tahunakademik">Edit</button>
                            <button type="button" class="btn btn-danger" tahunakademik-id=${values.id_tahun_akademik}>Hapus</button>
                        </td>
                    </tr>`;
        });
        // Tampilkan data pegawai ke dalam tabel
        document.getElementById("tablebody").innerHTML = tableData;

        // Untuk Listener Button Edit
        const updateButton = document.querySelectorAll(".btn-warning");
            updateButton.forEach(updateButton => {
                updateButton.addEventListener("click", () => {
                    const idahunAkademik = updateButton.getAttribute('tahunakademik-id');
                    if (idahunAkademik) {
                        // Use idahunAkademik instead of idProdi here
                        getTahunAkademikById(idahunAkademik, (error, tahunakademikData) => {
                        if (error) {
                            console.error("Gagal mengambil data Tahun kaademik : ", error);
                            return;
                        }
        
                        // Mengisi formulir update dengan data prodi yang diperoleh
                        document.getElementById('update-id_tahun').value = idahunAkademik;
                        document.getElementById('update-tahun_akademik').value = tahunakademikData.tahun_akademik;
                        document.getElementById('update-kode_tahun_akademik').value = tahunakademikData.kode_tahun;
        
                        // Menampilkan modal update
                        const modalUpdate = new bootstrap.Modal(
                            document.getElementById('update-tahun-akademik')
                        );
                        modalUpdate.show();
                    });
                } else {
                    console.error("Id Tahun Akademik Tidak Ditemukan.")
                }
            });
        });
                
        // Untuk Listener Button Delete
        const deleteButtons = document.querySelectorAll(".btn-danger");
        deleteButtons.forEach(deleteButton => {
            deleteButton.addEventListener("click", () => {
                const idahunAkademik = deleteButton.getAttribute('tahunakademik-id');
                if(idahunAkademik) {
                    deleteTahunAkademik(idahunAkademik);
                } else {
                    console.error("Id Tahun Akademik Tidak Ditemukan.")
                };
            });
        });
        
        // Untuk Memunculkan Pagination Halamannya
        displayData(halamannow);
        updatePagination();
    })
    .catch(error => {
        console.log('error', error);
    });

    // Fungsi untuk Menampilkan Data
	function displayData(page) {
		const baris = CihuyQuerySelector("#tablebody tr");
		const mulaiindex = (page - 1) * itemPerPage;
		const akhirindex = mulaiindex + itemPerPage;

		for (let i = 0; i < baris.length; i++) {
			if (i >= mulaiindex && i < akhirindex) {
				baris[i].style.display = "table-row";
			} else {
				baris[i].style.display = "none";
			}
		}
	}

    // Fungsi untuk Update Pagination
    function updatePagination() {
        halamanSaatIni.textContent = `Halaman ${halamannow}`;
    }

    // Button Pagination (Sebelumnya)
    buttonPreviousPage.addEventListener("click", () => {
        if (halamannow > 1) {
            halamannow--;
            displayData(halamannow);
            updatePagination();
        }
    });

    // Button Pagination (Selanjutnya)
	buttonNextPage.addEventListener("click", () => {
		const totalPages = Math.ceil(
			tablebody.querySelectorAll("#tablebody tr").length / itemPerPage
		);
		if (halamannow < totalPages) {
			halamannow++;
			displayData(halamannow);
			updatePagination();
		}
	});
});

// Post Tahun akademik
function submitTahunAkademik() {
    const namaTahunAkademik = getValue('tahun_akademik');
    const kodeTahunAkademik = getValue('kode_tahun_akademik');

    const myData = {
        "tahun_akademik": namaTahunAkademik,
        "kode_tahun": parseInt(kodeTahunAkademik, 10)
    };

    console.log(myData);

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(myData),
    };

    fetch(UrlPostTahunAkademik, requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sukses!',
                    text: 'Tahun Akademik berhasil ditambahkan.',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    location.replace('tahun_akademik.html');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Tahun Akademik gagal ditambahkan.'
                })
            }
        })
        .catch(error => {
            console.error("Error saat melakukan POST Data : ", error);
        });
}

const submitButton = document.getElementById('tambahDataButton');
submitButton.addEventListener('click', (event) => {
    event.preventDefault();
    const namaTahunAkademik = getValue('tahun_akademik');
    const kodeTahunAkademik = getValue('kode_tahun_akademik');
    if (!namaTahunAkademik || !kodeTahunAkademik) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Semua field harus diisi!',
        });
        return;
    }
    Swal.fire({
        title: 'Tambah Tahun akademik?',
        text: 'Apakah anda yakin ingin tambah Tahun akademik?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            submitTahunAkademik();
        }
    });
});

// Get Tahun Akademik By Id
function getTahunAkademikById(idTahunAkademik, callback) {
    const apiUrlGetTahunAkademikById = UrlGetTahunAkademikById + `?id=${idTahunAkademik}`;

    CihuyDataAPI(apiUrlGetTahunAkademikById, token, (error, response) => {
        if (error) {
            console.error("Terjadi kesalahan saat mengambil data Tahun Akademik : ", error);
            callback(error, null);
        } else {
            const tahunakademikData = response.data;
            callback(null, tahunakademikData);
        }
    })
}

// Update Data Tahun Akademik
function updateTahunAkademik(idTahunAkademik) {
    // 1. Get the updated data from the form
    const updatedTahun = getValue('update-tahun_akademik');
    const updatedKodeTahun = getValue('update-kode_tahun_akademik');

    // 2. Create an object with the updated data
    const updatedData = {
        "tahun_akademik": updatedTahun,
        "kode_tahun": parseInt(updatedKodeTahun, 10)
    };

    // 3. Send a PUT request to update the data
    const requestOptions = {
        method: 'PUT',
        headers: header,
        body: JSON.stringify(updatedData)
    };

    fetch(UrlPutTahunAkademik + `?id=${idTahunAkademik}`, requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sukses!',
                    text: 'Tahun Akademik berhasil diperbarui.',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Tahun Akademik gagal diperbarui.'
                });
            }
        })
        .catch(error => {
            console.error("Error saat melakukan PUT Data : ", error);
        });
}

const updateButtons = document.getElementById('updateDataButton');
updateButtons.addEventListener('click', (event) => {
    event.preventDefault();

    // 1. Get the updated data from the form
    const updatedIdTahun = getValue('update-id_tahun');
    const updatedTahun = getValue('update-tahun_akademik');
    const updatedKodeTahun = getValue('update-kode_tahun_akademik');

    if (!updatedTahun || !updatedKodeTahun) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Semua field harus diisi!',
        });
        return;
    }

    // 3. Confirm the update with Swal
    Swal.fire({
        title: 'Edit Tahun Akademik?',
        text: 'Apakah anda yakin ingin mengubah TahunAkademik?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            updateTahunAkademik(updatedIdTahun);
        }
    });
});

// Delete Data Tahun akademik
function deleteTahunAkademik(idahunAkademik) {
    // Use Swal for confirmation
    Swal.fire({
        title: 'Hapus Tahun Akademik?',
        text: 'Apakah Anda yakin ingin menghapus Tahun Akademik ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            const requestOptions = {
                method: 'DELETE',
                headers: header,
            };

            fetch(UrlDeleteTahunAkademik + `?id=${idahunAkademik}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Sukses!',
                            text: 'Tahun akademik berhasil dihapus.',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            location.reload(); // Refresh the page after successful deletion
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Tahun akademik gagal dihapus.'
                        });
                    }
                })
                .catch(error => {
                    console.error("Error saat melakukan DELETE Data : ", error);
                });
        }
    });
}