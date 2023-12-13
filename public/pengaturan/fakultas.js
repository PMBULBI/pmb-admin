// Import library yang dibutuhkan
import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { UrlDeleteFakultas, UrlGetFakultas, UrlGetFakultasById } from "../controller/template.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { token } from "../controller/cookies.js";

// Untuk Get Token
var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

// Get Data Jalur Pendaftaran
CihuyDomReady(() => {
    const tablebody = CihuyId("tablebody");
    const buttonPreviousPage = CihuyId("prevPageBtn");
    const buttonNextPage = CihuyId("nextPageBtn");
    const halamanSaatIni = CihuyId("currentPage");
    const itemPerPage = 10;
    let halamannow = 1;

    // Untuk Get All Data Pendaftar
    fetch(UrlGetFakultas)
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
                            <p>${values.nama_fakultas}</p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <button type="button" class="btn btn-warning" style="color: white;" fakultas=${values.id_fakultas} >Edit</button>
                            <button type="button" class="btn btn-danger" fakultas=${values.id_fakultas}>Hapus</button>
                        </td>
                    </tr>`;
        });
        // Tampilkan data pegawai ke dalam tabel
        document.getElementById("tablebody").innerHTML = tableData;

        // Untuk Button edit
        const updateButtons = document.querySelectorAll(".btn-warning");
        updateButtons.forEach(updateButton => {
            updateButton.addEventListener('click', () => {
                const fakultasId = updateButton.getAttribute('fakultas');
                if (fakultasId) {
                    updateFakultas(fakultasId);
                } else {
                    console.error("Id Fakultas Tidak Ditemukan.")
                }
            });
        });

        // Untuk Button delete
        const deleteButtons = document.querySelectorAll(".btn-danger");
        deleteButtons.forEach(deleteButton => {
            deleteButton.addEventListener('click', () => {
                const fakultasId = deleteButton.getAttribute('fakultas');
                if (fakultasId) {
                    deleteFakultas(fakultasId);
                } else {
                    console.error("Id Fakultas Tidak Ditemukan.")
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

// Get Data Fakultas By Id
function getFakultasById(idFakultas, callback) {
    const apiUrlGetFakultasById = UrlGetFakultasById + `?id=${idFakultas}`;

    CihuyDataAPI(apiUrlGetFakultasById, token, (error, response) => {
         if (error) {
            console.error("Terjadi kesalahan saat mengambil data fakultas : ", error);
            callback(error, null);
         } else {
            const fakultasData = response.data;
            callback(null, fakultasData);
         }
    })
}

// Update Data Fakultas
// Buat fungsi updatenya beserta alertnya terlebih dahulu
function updateFakultas(idFakultas) {
    getFakultasById(idFakultas, (error, fakultasData) => {
        if (error) {
            console.error("Gagal mengamil data fakultas : ", error);
            return;
        }

        // Mengisi formulir update dengan data fakultas yang diperoleh
        document.getElementById("nama-fakultas-update").value = fakultasData.nama_fakultas;

        // Menampilkan modal update
        const modalUpdate = new bootstrap.Modal(
            document.getElementById('update-fakultas')
        );
        modalUpdate.show()
});
}

// Delete Data Fakultas
function deleteFakultas(fakultasId) {
    // Use Swal for confirmation
    Swal.fire({
        title: 'Hapus Fakultas?',
        text: 'Apakah Anda yakin ingin menghapus fakultas ini?',
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

            fetch(UrlDeleteFakultas + `?id=${fakultasId}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Sukses!',
                            text: 'Fakultas berhasil dihapus.',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            location.reload(); // Refresh the page after successful deletion
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Fakultas gagal dihapus.'
                        });
                    }
                })
                .catch(error => {
                    console.error("Error saat melakukan DELETE Data : ", error);
                });
        }
    });
}