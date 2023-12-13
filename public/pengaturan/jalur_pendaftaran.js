// Import library yang dibutuhkan
import { CihuyDataAPI, CihuyDeleteAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { UrlGetJalur, UrlDeleteJalur, UrlGetJalurById } from "../controller/template.js";
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
                const jalurId = updateButton.getAttribute('jalur-pendaftaran');
                if (jalurId) {
                    updateJalurPendaftaran(jalurId);
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

// Get Data Jalur Pendaftaran By Id
function getJalurPendaftaranById(idJalur, callback) {
  const apiUrlGetJalurPendaftaranById = UrlGetJalurById + `?id=${idJalur}`;

  CihuyDataAPI(apiUrlGetJalurPendaftaranById, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan saat mengambil data jalur pendaftaran : ", error);
      callback(error, null);
    } else {
      const jalurData = response.data;
      callback(null, jalurData);
    }
  })
}

// Update Data Jalur Pendaftaran
// Buat fungsi updatenya beserta alertnya terlebih dahulu
function updateJalurPendaftaran(idJalur) {
  getJalurPendaftaranById(idJalur, (error, jalurData) => {
    if (error) {
      console.error("Gagal mengambil data jalur pendaftaran : ", error);
      return;
    }

    // Mengisi formulir update dengan data jalur yang diperoleh
    document.getElementById("jalur-update").value = jalurData.jalur;
    document.getElementById("nama_jalur-update").value = jalurData.nama_jalur;
    document.getElementById("keterangan-update").value = jalurData.keterangan_jalur;
    document.getElementById("status-update").value = jalurData.status;

    // Menampilkan modal update
    const modalUpdate = new bootstrap.Modal(
      document.getElementById('update-jalur')
    );
    modalUpdate.show()
  })
}

// Delete Data Jalur Pendaftaran
// Buat Fungsi Deletenya terlebih dahulu dengan Alertnya
function deleteJalurPendaftaran(jalurId) {
  // Use Swal for confirmation
  Swal.fire({
      title: 'Hapus Jalur Pendaftaran?',
      text: 'Apakah Anda yakin ingin menghapus jalur pendaftaran ini?',
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

          fetch(UrlDeleteJalur + `?id=${jalurId}`, requestOptions)
              .then(response => response.json())
              .then(data => {
                  if (data.success) {
                      Swal.fire({
                          icon: 'success',
                          title: 'Sukses!',
                          text: 'Jalur pendaftaran berhasil dihapus.',
                          showConfirmButton: false,
                          timer: 1500
                      }).then(() => {
                          location.reload(); // Refresh the page after successful deletion
                      });
                  } else {
                      Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Jalur pendaftaran gagal dihapus.'
                      });
                  }
              })
              .catch(error => {
                  console.error("Error saat melakukan DELETE Data : ", error);
              });
      }
  });
}