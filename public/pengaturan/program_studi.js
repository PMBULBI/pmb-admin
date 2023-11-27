// Import library yang dibutuhkan
import { UrlGetProdi, UrlGetProdiById } from "../controller/template.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";

// Get Data Program Studi
CihuyDomReady(() => {
    const tablebody = CihuyId("tablebody");
    const buttonPreviousPage = CihuyId("prevPageBtn");
    const buttonNextPage = CihuyId("nextPageBtn");
    const halamanSaatIni = CihuyId("currentPage");
    const itemPerPage = 10;
    let halamannow = 1;

    // Untuk Get All Data Pendaftar
    fetch(UrlGetProdi)
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
                            <p>${values.program_studi}</p>
                        </td>
                        <td class="min-width">
                            <p>${values.kode_program_studi}</p>
                        </td>
                        <td class="min-width">
                            <p>${values.fakultas}</p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <button type="button" class="btn btn-warning" style="color: white;" prodi-id=${values.id} data-bs-toggle="modal" data-bs-target="#update-prodi">Edit</button>
                            <button type="button" class="btn btn-danger" prodi-id=${values.id}>Hapus</button>
                        </td>
                    </tr>`;
        });
        // Tampilkan data pegawai ke dalam tabel
        document.getElementById("tablebody").innerHTML = tableData;

        // Untuk Listener Button Edit
        const updateButtons = document.querySelectorAll(".btn-warning");
        updateButtons.forEach(updateButton => {
            updateButton.addEventListener("click", () => {
                const prodiId = updateButton.getAttribute('prodi-id');
                if (prodiId) {
                    updateProdi(prodiId);
                } else {
                    console.error("Id Prodi Tidak Ditemukan.")
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

// Get Data Prodi By Id
function getProdiById(idProdi, callback) {
    const apiUrlGetProdiById = UrlGetProdiById + `?id=${idProdi}`;

    CihuyDataAPI(apiUrlGetProdiById, token, (error, response) => {
        if (error) {
            console.error("Terjadi kesalahan saat mengambil data program studi : ", error);
            callback(error, null);
        } else {
            const prodiData = response.data;
            callback(null, prodiData);
        }
    })
}