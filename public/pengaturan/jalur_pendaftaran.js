// Import library yang dibutuhkan
import { UrlGetJalur, UrlDeleteJalur, UrlGetJalurById } from "../controller/template.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { token } from "../controller/cookies.js";

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
    fetch(UrlGetJalur)
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
                            <p>${values.jalur}</p>
                        </td>
                        <td class="min-width">
                            <p>${values.nama_jalur}</p>
                        </td>
                        <td class="min-width">
                            <p>${values.keterangan_jalur}</p>
                        </td>
                        <td class="min-width">
                            <p>${values.status}</p>

                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <button type="button" class="btn btn-warning" style="color: white;" jalur-pendaftaran=${values.id_jalur} >Edit</button>
                            <button type="button" class="btn btn-danger" jalur-pendaftaran=${values.id_jalur}>Hapus</button>
                        </td>
                    </tr>`;
        });
        // Tampilkan data pegawai ke dalam tabel
        document.getElementById("tablebody").innerHTML = tableData;

        // Untuk Listener Button Delete
        const removeButtons = document.querySelectorAll(".btn-danger");
        removeButtons.forEach(removeButton => {
            removeButton.addEventListener("click", () => {
                const jalurId = removeButton.getAttribute('jalur-pendaftaran');
                if (jalurId) {
                    deleteJalurPendaftaran(jalurId);
                } else {
                    console.error("Id Jalur Pendaftaran Tidak Ditemukan.");
                }
            });
        });

        // Untuk Listener Button Edit
        const updateButtons = document.querySelectorAll(".btn-warning");
        updateButtons.forEach(updateButton => {
            updateButton.addEventListener("click", () => {
                const userId = updateButton.getAttribute('jalur-pendaftaran');
                if (userId) {
                    updateUserManager(userId);
                } else {
                    console.error("Id Jalur Pendaftaran Tidak Ditemukan.")
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

// Delete Data Jalur Pendaftaran
// Buat Fungsi Deletenya terlebih dahulu dengan Alertnya
function deleteJalurPendaftaran(idJalur) {
  Swal.fire({
      title: "Apakah Anda yakin ingin menghapus Jalur Pendaftaran?",
      text: "Penghapusan Jalur Pendaftaran akan permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Tidak, Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        const apiUrlGetJalurById = UrlGetJalurById + `?id=${idJalur}`;
  
        // Lakukan permintaan GET untuk mengambil admin berdasarkan ID admin
        CihuyDataAPI(apiUrlGetJalurById, token, (error, response) => {
          if (error) {
            console.error("Terjadi kesalahan saat mengambil data jalur pendaftaran :", error);
          } else {
            const jalurData = response.data;
            if (jalurData) {
              // Dapatkan ID admin dari data yang diterima
              const jalurId = jalurData.id_admin;
  
              // Buat URL untuk menghapus admin berdasarkan ID admin yang telah ditemukan
              const apiUrlDeleteJalur = UrlDeleteJalur + `?id=${jalurId}`;
  
              // Lakukan permintaan DELETE untuk menghapus admin
              CihuyDeleteAPI(
                apiUrlDeleteJalur,
                token,
                (deleteError, deleteData) => {
                  if (deleteError) {
                    console.error(
                      "Terjadi kesalahan saat menghapus data jalur pendaftaran :",
                      deleteError
                    );
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Terjadi kesalahan saat menghapus data jalur pendaftaran!",
                    });
                  } else {
                    console.log("Admin berhasil dihapus:", deleteData);
                    Swal.fire({
                      icon: "success",
                      title: "Sukses!",
                      text: "Jalur pendaftaran berhasil dihapus.",
                      showConfirmButton: false,
                      timer: 1500,
                    }).then(() => {
                      window.location.reload();
                    });
                  }
                }
              );
            } else {
              console.error("Jalur pendaftaran tidak ditemukan.");
            }
          }
        });
      } else {
        Swal.fire("Dibatalkan", "Penghapusan jalur pendaftaran dibatalkan.", "info");
      }
    });
}