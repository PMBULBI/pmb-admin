// Import library yang dibutuhkan
import { CihuyDataAPI, CihuyDeleteAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { UrlGetAdmin, UrlDeleteAdmin, UrlGetAdminById } from "../controller/template.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
const token = CihuyGetCookie("login");

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
    fetch(UrlGetAdmin)
    .then((result) => {
        return result.json();
    })
    .then((data) => {
        let tableData = "";
        data.data.map((values, index) => {
            // Manipulasi data dan masukkan ke dalam bentuk tabel
            tableData += `
                        <tr style="text-align: center; vertical-align: middle">
                        <td>
                        <div class="min-width">
                            <p>${index + 1}</p>
                        </div>
                        </td>
                        <td class="min-width">
                            <p>${values.nama_admin}</p>
                        </td>
                        <td class="min-width">
                            <p>${values.username}</p>
                        </td>
                        <td class="min-width">
                            <p>${values.email}</p>
                        </td>
                        <td class="min-width">
                            <p>${values.no_hp}</p>
                        </td>
                        <td class="min-width">
                            <p>${values.password}</p>
                        </td>
                        <td class="min-width">
                            <p>${values.aktif}</p>
                        </td>
                        <td class="min-width">
                            <p>${values.level}</p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <button type="button" class="btn btn-warning" style="color: white;" user-manager-id=${values.id_jalur} data-bs-toggle="modal" data-bs-target="#update-user">Edit</button>
                            <button type="button" class="btn btn-danger" user-manager-id=${values.id_jalur}>Hapus</button>
                        </td>
                    </tr>`;
        });
        // Tampilkan data pegawai ke dalam tabel
        document.getElementById("tablebody").innerHTML = tableData;

        // Untuk Listener Button Delete
        const removeButtons = document.querySelectorAll(".btn-danger");
        removeButtons.forEach(removeButton => {
            removeButton.addEventListener("click", () => {
                const userId = removeButton.getAttribute('user-manager-id');
                if (userId) {
                    deleteUserManager(userId);
                } else {
                    console.error("Id User Manager Tidak Ditemukan.");
                }
            });
        });

        // Untuk Listener Button Edit
        const updateButtons = document.querySelectorAll(".btn-warning");
        updateButtons.forEach(updateButton => {
            updateButton.addEventListener("click", () => {
                const userId = updateButton.getAttribute('user-manager-id');
                if (userId) {
                    updateUserManager(userId);
                } else {
                    console.error("Id User Manager Tidak Ditemukan.")
                }
            })
        })

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

// Delete Data User Manager
// Buat Fungsi Deletenya terlebih dahulu dengan Alertnya
function deleteUserManager(idUser) {
    Swal.fire({
        title: "Apakah Anda yakin ingin menghapus User Manager?",
        text: "Penghapusan user manager akan permanen.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Tidak, Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          const apiUrlGetUserById = UrlGetAdminById + `?id=${idUser}`;
    
          // Lakukan permintaan GET untuk mengambil admin berdasarkan ID admin
          CihuyDataAPI(apiUrlGetUserById, token, (error, response) => {
            if (error) {
              console.error("Terjadi kesalahan saat mengambil user :", error);
            } else {
              const userData = response.data;
              if (userData) {
                // Dapatkan ID admin dari data yang diterima
                const userId = userData.id_admin;
    
                // Buat URL untuk menghapus admin berdasarkan ID admin yang telah ditemukan
                const apiUrlAdminDelete = UrlDeleteAdmin + `?id=${userId}`;
    
                // Lakukan permintaan DELETE untuk menghapus admin
                CihuyDeleteAPI(
                  apiUrlAdminDelete,
                  token,
                  (deleteError, deleteData) => {
                    if (deleteError) {
                      console.error(
                        "Terjadi kesalahan saat menghapus user :",
                        deleteError
                      );
                      Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Terjadi kesalahan saat menghapus user!",
                      });
                    } else {
                      console.log("Admin berhasil dihapus:", deleteData);
                      Swal.fire({
                        icon: "success",
                        title: "Sukses!",
                        text: "User Manager berhasil dihapus.",
                        showConfirmButton: false,
                        timer: 1500,
                      }).then(() => {
                        window.location.reload();
                      });
                    }
                  }
                );
              } else {
                console.error("Data user tidak ditemukan.");
              }
            }
          });
        } else {
          Swal.fire("Dibatalkan", "Penghapusan user dibatalkan.", "info");
        }
      });
}

// Get Data User Manager By Id
function getUserManagerById(idUser, callback) {
    const apiUrlGetUserManagerById = UrlGetAdminById + `?id=${idUser}`;

    CihuyDataAPI(apiUrlGetUserManagerById, token, (error, response) => {
        if (error) {
            console.error("Terjadi kesalahan saat mengambil data user manager : ", error);
            callback(error, null);
        } else {
            const userData = response.data;
            callback(null, userData);
        }
    });
}

// Update Data User Manager
// Buat fungsi updatenya beserta alertnya terlebih dahulu
function updateUserManager(idUser) {
    get
}