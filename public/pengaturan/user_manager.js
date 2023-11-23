// Import library yang dibutuhkan
import { CihuyDataAPI, CihuyDeleteAPI, CihuyUpdateApi } from "https://c-craftjs.github.io/simpelbi/api.js";
import { UrlGetAdmin, UrlDeleteAdmin, UrlGetAdminById, UrlPutAdmin } from "../controller/template.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";

// Untuk Get Token
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
                            <button type="button" class="btn btn-warning" style="color: white;" user-manager-id=${values.id_admin} data-bs-toggle="modal" data-bs-target="#update-user">Edit</button>
                            <button type="button" class="btn btn-danger" user-manager-id=${values.id_admin}>Hapus</button>
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
    getUserManagerById(idUser, (error, userData) => {
        if (error) {
            console.error("Gagal mengambil data user manager : ", error);
            return;
        }

        // Mengisi formulir update dengan data user manager yang diperoleh
        document.getElementById("nama-update").value = userData.nama_admin;
        document.getElementById("username-update").value = userData.username;
        document.getElementById("email-update").value = userData.email;
        document.getElementById("no_hp-update").value = userData.no_hp;
        document.getElementById("password-update").value = userData.password;
        document.getElementById("aktif-update").value = userData.aktif;
        document.getElementById("level-update").value = userData.level;

        // Menampilkan modal update
        const modalUpdate = new bootstrap.Modal(
            document.getElementById("update-user")
        );
        modalUpdate.show();

        // Untuk Simpan Perubahan Ketika Update Data
        const updateButtonModal = document.getElementById("updateDataButton");
        updateButtonModal.addEventListener("click", function () {
            // Ambil value setiap elemen
            const namaUserBaru = document.getElementById("nama-update").value;
            const usernameBaru = document.getElementById("username-update").value;
            const emailBaru = document.getElementById("email-update").value;
            const noHpBaru = document.getElementById("no_hp-update").value;
            const passwordBaru = document.getElementById("password-update").value;
            const aktifBaru = document.getElementById("aktif-baru").value;
            const levelBaru = document.getElementById("level-update").value;

            const dataUserToUpdate = {
                nama_admin : namaUserBaru,
                username : usernameBaru,
                email : emailBaru,
                no_hp : noHpBaru,
                password : passwordBaru,
                aktif : aktifBaru,
                level : levelBaru,
            }

            // Hide modal ketika sudah selesai isi
            $("#update-user").modal("hide");

            // Tampilkan SweetAlert konfirmasi sebelum mengirim permintaan
            Swal.fire({
                title: "Update Data User Manager?",
                text: "Apakah Anda yakin ingin mengupdate data user ini?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Ya, Update",
                cancelButtonText: "Batal",
            }).then((result) => {
                if (result.isConfirmed) {
                // Kirim permintaan PUT/UPDATE ke server dengan gambar
                updateRequestData(idUser, dataUserToUpdate, modalUpdate);
                }
            });
        })
    })
}

// Fungsi untuk Melakukan Updatenya
function updateRequestData(idUser, dataUserToUpdate, modalUpdate) {
    const apiUrlUserUpdate = UrlPutAdmin + `?id=${idUser}`;

    CihuyUpdateApi(apiUrlUserUpdate, token, dataUserToUpdate, (error, responseText) => {
        if (error) {
            console.error("Terjadi kesalahan saat update user manager : ", error);
            // Tampilkan Alert Kesalahan
            Swal.fire({
                icon : "error",
                title : "Oops...",
                text : "Terjadi kesalahan saat update user manager.",
            });
        } else {
            console.log("Respon sukses:", responseText);
            // Menutup modal edit
            modalUpdate.hide();
            // Menampilkan pesan sukses
            Swal.fire({
              icon: "success",
              title: "Sukses!",
              text: "Data User berhasil diperbarui.",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              // Refresh halaman atau lakukan tindakan lain jika diperlukan
              window.location.reload();
            });
        }
    })
}