// Import library yang dibutuhkan
import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { UrlGetAgama, UrlGetAgamaById } from "../controller/template.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";

// Untuk Get Token
const token = CihuyGetCookie("login");

// Get Data Program Studi
CihuyDomReady(() => {
    const tablebody = CihuyId("tablebody");
    const buttonPreviousPage = CihuyId("prevPageBtn");
    const buttonNextPage = CihuyId("nextPageBtn");
    const halamanSaatIni = CihuyId("currentPage");
    const itemPerPage = 8;
    let halamannow = 1;

    // Untuk Get All Data Pendaftar
    fetch(UrlGetAgama)
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
                            <p>${values.agama}</p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <button type="button" class="btn btn-warning" style="color: white;" agama-id=${values.id} data-bs-toggle="modal" data-bs-target="#update-agama">Edit</button>
                            <button type="button" class="btn btn-danger" agama-id=${values.id}>Hapus</button>
                        </td>
                    </tr>`;
        });
        // Tampilkan data pegawai ke dalam tabel
        document.getElementById("tablebody").innerHTML = tableData;

        // Untuk Listener Button Edit
        const updateButtons = document.querySelectorAll(".btn-warning");
        updateButtons.forEach(updateButton => {
            updateButton.addEventListener("click", () => {
                const agamaId = updateButton.getAttribute('agama-id');
                if (agamaId) {
                    updateAgama(agamaId);
                } else {
                    console.error("Id Agama Tidak Ditemukan.")
                }
            });
        });

        // Untuk Listener Button delete
        const deleteButtons = document.querySelectorAll(".btn-danger");
        deleteButtons.forEach(deleteButton => {
            deleteButton.addEventListener("click", () => {
                const agamaId = deleteButton.getAttribute('agama-id');
                if (agamaId) {
                    deleteAgama(agamaId);
                } else {
                    console.error("Id Agama Tidak Ditemukan.")
                }
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

// Get Data Prodi By Id
function getAgamaById(idAgama, callback) {
    const apiUrlGetAgamaById = UrlGetAgamaById + `?id=${idAgama}`;

    CihuyDataAPI(apiUrlGetAgamaById, token, (error, response) => {
        if (error) {
            console.error("Terjadi kesalahan saat mengambil data program studi : ", error);
            callback(error, null);
        } else {
            const agamaData = response.data;
            callback(null, agamaData);
        }
    })
}

// Update Data Agama
// Buat fungsi updatenya beserta alertnya terlebih dahulu
function updateAgama(idAgama) {
    getAgamaById(idAgama, (error, agamaData) => {
        if (error) {
            console.error("Gagal mengambil data agama : ", error);
            return;
        }

        // Mengisi formulir update dengan data agama yang diperoleh
        document.getElementById('nama-agama-update').value = agamaData.agama;

        // Menampilkan modal update
        const modalUpdate = new bootstrap.Modal(
            document.getElementById('update-agama')
        );
        modalUpdate.show();
    })
}

// Delete Data Agama
function deleteAgama(agamaId) {
    // Use Swal for confirmation
    Swal.fire({
        title: 'Hapus Agama?',
        text: 'Apakah Anda yakin ingin menghapus agama ini?',
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

            fetch(UrlDeleteAgama + `?id=${agamaId}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Sukses!',
                            text: 'Agama berhasil dihapus.',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            location.reload(); // Refresh the page after successful deletion
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Agama gagal dihapus.'
                        });
                    }
                })
                .catch(error => {
                    console.error("Error saat melakukan DELETE Data : ", error);
                });
        }
    });
}