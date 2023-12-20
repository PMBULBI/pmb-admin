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

// Get Data Program Studi
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
                            <button hidden type="button" class="btn btn-warning" style="color: white;" tahunakademik-id=${values.id_tahun_akademik} data-bs-toggle="modal" data-bs-target="#update-tahunakademik">Edit</button>
                            <button type="button" class="btn btn-danger" tahunakademik-id=${values.id_tahun_akademik}>Hapus</button>
                        </td>
                    </tr>`;
        });
        // Tampilkan data pegawai ke dalam tabel
        document.getElementById("tablebody").innerHTML = tableData;

        // Untuk Listener Button Edit
        const updateButtons = document.querySelectorAll(".btn-warning");
        updateButtons.forEach(updateButton => {
            updateButton.addEventListener("click", () => {
                const idahunAkademik = updateButton.getAttribute('tahunakademik-id');
                if (idahunAkademik) {
                    updateTahunAkademik(idahunAkademik);
                } else {
                    console.error("Id Tahun Akademik Tidak Ditemukan.")
                };
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

// Post Program Studi
function submitTahunAkademik() {
    const namaTahunAkademik = getValue('tahun_akademik');
    const kodeTahunAkademik = getValue('kode_tahun_akademik');

    const myData = {
        "tahun_akademik": namaTahunAkademik,
        "kode_tahun": kodeTahunAkademik
    };

    console.log(myData);

    const requestOptions = {
        method: 'POST',
        headers: header,
        body: JSON.stringify(myData)
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
        title: 'Tambah Program Studi?',
        text: 'Apakah anda yakin ingin tambah program studi?',
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

// Get Data Tahun Akademik By Id
function getTahunAkademikById(idTahunAkademik, callback) {
    const apiUrlGetTahunAkademikById = UrlGetTahunAkademikById + `?id=${idTahunAkademik}`;

    CihuyDataAPI(apiUrlGetTahunAkademikById, token, (error, response) => {
        if (error) {
            console.error("Terjadi kesalahan saat mengambil data program studi : ", error);
            callback(error, null);
        } else {
            const tahunakademikData = response.data;
            callback(null, tahunakademikData);
        }
    })
}

// Update Data Program Studi
// Buat fungsi updatenya beserta alertnya terlebih dahulu
function updateTahunAkademik(idahunAkademik) {
    getTahunAkademikById(idahunAkademik, (error, tahunakademikData) => {
        if (error) {
            console.error("Gagal mengambil data Tahun Akademik : ", error);
            return;
        }

        // Mengisi formulir update dengan data Thn Akademik yang diperoleh
        document.getElementById('update-tahun_akademik').value = tahunakademikData.tahun_akademik;
        document.getElementById('update-kode_tahun_akademik').value = tahunakademikData.kode_tahun_akademik;

        // Menampilkan modal update
        const modalUpdate = new bootstrap.Modal(
            document.getElementById('update-tahun_akademik')
        );
        modalUpdate.show();
    })
}

// Delete Data Program Studi
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
                            text: 'Program studi berhasil dihapus.',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            location.reload(); // Refresh the page after successful deletion
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Program studi gagal dihapus.'
                        });
                    }
                })
                .catch(error => {
                    console.error("Error saat melakukan DELETE Data : ", error);
                });
        }
    });
}