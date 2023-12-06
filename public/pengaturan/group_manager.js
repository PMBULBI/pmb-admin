// Import library yang dibutuhkan
import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { UrlGetAdminLevel, UrlGetAdminLevelById } from "../controller/template.js";
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