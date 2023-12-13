// Import library yang dibutuhkan
import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { UrlDeleteAdminLevel, UrlGetAdminLevel, UrlGetAdminLevelById } from "../controller/template.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";

// Untuk Get Token
var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

// Get Data User Manager
// Membuat Fungsi Pagination dan Tabel
CihuyDomReady(() => {
    const tablebody = CihuyId("tablebody");
    const buttonPreviousPage = CihuyId("prevPageBtn");
    const buttonNextPage = CihuyId("nextPageBtn");
    const halamanSaatIni = CihuyId("currentPage");
    const itemPerPage = 10;
    let halamannow = 1;

    // Untuk Get All Data Pendaftar
    fetch(UrlGetAdminLevel)
    .then((result) => {
        return result.json();
    })
    .then((data) => {
        let tableData = "";
        data.data.map((values) => {
            // Manipulasi data dan masukkan ke dalam bentuk tabel
            tableData += `
                        <tr style="text-align: center; vertical-align: middle">
                        <td>
                        <div class="min-width">
                            <p>${values.id_level}</p>
                        </div>
                        </td>
                        <td class="min-width">
                            <p>${values.nama_level}</p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <button type="button" class="btn btn-warning" style="color: white;" user-manager-id=${values.id_level} data-bs-toggle="modal" data-bs-target="#update-user">Edit</button>
                            <button type="button" class="btn btn-danger" user-manager-id=${values.id_level}>Hapus</button>
                        </td>
                    </tr>`;
        });
        // Tampilkan data pegawai ke dalam tabel
        document.getElementById("tablebody").innerHTML = tableData;

        // Untuk Listener Button Edit
        const updateButtons = document.querySelectorAll(".btn-warning");
        updateButtons.forEach(updateButton => {
            updateButton.addEventListener("click", () => {
                const groupManagerId = updateButton.getAttribute('user-manager-id');
                if (groupManagerId) {
                    updateGroupManager(groupManagerId);
                } else {
                    console.error("Id Group Manager Tidak Ditemukan")
                }
            });
        });

        // Untuk Listener Button Delete
        const deleteButtons = document.querySelectorAll(".btn-danger");
        deleteButtons.forEach(deleteButton => {
            deleteButton.addEventListener("click", () => {
                const groupManagerId = deleteButton.getAttribute('user-manager-id');
                if (groupManagerId) {
                    deleteGroupManager(groupManagerId);
                } else {
                    console.error("Id Group Manager Tidak Ditemukan")
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

// Get Data Group Manager By Id
function getGroupManagerById(idGroupManager, callback) {
    const apiUrlGetGroupManagerById = UrlGetAdminLevelById + `?id=${idGroupManager}`;

    CihuyDataAPI(apiUrlGetGroupManagerById, token, (error, response) => {
        if (error) {
            console.error("Terjadi kesalahan saat mengambil data group manager : ", error);
            callback(error, null);
        } else {
            const groupManagerData = response.data;
            callback(null, groupManagerData);
        }
    })
}

// Update Data Group Manager
// Buat fungsi updatenya beserta alertnya terlebih dahulu
function updateGroupManager(idGroupManager) {
    getGroupManagerById(idGroupManager, (error, groupManagerData) => {
        if (error) {
            console.error("Gagal mengambil data group manager : ", error);
            return;
        }

        // Mengisi formulir update dengan data prodi yang diperoleh
        document.getElementById('nama-level-update').value = groupManagerData.nama_level;

        // Menampilkan modal update
        const modalUpdate = new bootstrap.Modal(
            document.getElementById('update-group-manager')
        );
        modalUpdate.show()
    })
}

// Delete Data Group Manager
// Buat Fungsi Deletenya terlebih dahulu dengan Alertnya
function deleteGroupManager(groupManagerId) {
    // Use Swal for confirmation
    Swal.fire({
        title: 'Hapus Group Manager?',
        text: 'Apakah Anda yakin ingin menghapus group manager ini?',
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
  
            fetch(UrlDeleteAdminLevel + `?id=${groupManagerId}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Sukses!',
                            text: 'Group manager berhasil dihapus.',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            location.reload(); // Refresh the page after successful deletion
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Group manager gagal dihapus.'
                        });
                    }
                })
                .catch(error => {
                    console.error("Error saat melakukan DELETE Data : ", error);
                });
        }
    });
  }