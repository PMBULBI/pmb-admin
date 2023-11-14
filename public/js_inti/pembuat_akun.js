// Import library yang dibutuhkan
import { UrlGetPendaftar } from "../controller/template.js";
import { formatTanggalWaktu } from "../style/formatdate.js"
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";

CihuyDomReady(() => {
    const tablebody = CihuyId("tablebody");
    const buttonPreviousPage = CihuyId("prevPageBtn");
    const buttonNextPage = CihuyId("nextPageBtn");
    const halamanSaatIni = CihuyId("currentPage");
    const itemPerPage = 10;
    let halamannow = 1;

    // Untuk Get All Data Pendaftar
    fetch(UrlGetPendaftar)
    .then((result) => {
        return result.json();
    })
    .then((data) => {
        let tableData = "";
        data.data.map((values, index) => {
        // Ubah format tanggal
        const tglDaftar = new Date(values.tgl_daftar_mhs);
        const formattedTglDaftar = formatTanggalWaktu(tglDaftar);

            // Manipulasi data pegawai dan masukkan ke dalam bentuk tabel
            tableData += `
                        <tr style="text-align: center; vertical-align: middle">
                        <td>
                        <div class="min-width">
                            <p>${index + 1}</p>
                        </div>
                        </td>
                        <td class="min-width">
                            <p>${values.nama_mhs}</p>
                        </td>
                        <td class="min-width">
                            <p>${values.hp_mhs}</p>
                        </td>
                        <td>
                            <p><b><font color="teal">${values.email_mhs}</font></b></p>
                            <p><b><font color="teal">${values.password}</font></b></p>
                        </td>
                        <td>
                            <p>${values.asal_sekolah}</p>
                            <p>${values.kota_sekolah}</p>
                            <p>${values.provinsi_sekolah}</p>
                        </td>
                        <td>
                            <p>${formattedTglDaftar}</p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <a href="#" class="btn btn-warning" role="button" style="color: white;">Detail</a>
                            <a href="#" class="btn btn-info" role="button" style="color: white;">Edit</a>
                            <a href="#" class="btn btn-danger" role="button">Hapus</a>
                        </td>
                    </tr>`;
        });
        // Tampilkan data pegawai ke dalam tabel
        document.getElementById("tablebody").innerHTML = tableData;

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

