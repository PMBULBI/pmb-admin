// Import library yang dibutuhkan
import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { UrlGetPendaftar } from "../controller/template.js";
import { formatTanggalWaktu } from "../style/formatdate.js"
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";

// Untuk Get Token
const token = CihuyGetCookie("login");

CihuyDomReady(() => {
    const tablebody = CihuyId("tablebody");
    const buttonPreviousPage = CihuyId("prevPageBtn");
    const buttonNextPage = CihuyId("nextPageBtn");
    const halamanSaatIni = CihuyId("currentPage");
    const itemPerPage = 10;
    let halamannow = 1;

    // Untuk Get All Data Pendaftar
    CihuyDataAPI(UrlGetPendaftar, token, function (error, data) {
        if (error) {
            tablebody.innerHTML = `<tr><td colspan="5">Terjadi kesalahan: ${error.message}</td></tr>`;
        } else {
            if (data.success) {
                let tableData = "";
                data.data.map((values, index) => {
                // Ubah format tanggal
                const tglDaftar = new Date(values.tgl_daftar_mhs);
                const formattedTglDaftar = formatTanggalWaktu(tglDaftar);
                let spanVa = '<span class="status-btn danger-btn">Belum Ada Tagihan</span>';
                let spanBio = '<span class="status-btn danger-btn">Belum Isi Biodata</span>';
                if (values.status_va){
                    spanVa = '<span class="status-btn danger-btn">UDAH ADA COKKKK VA</span>';
                    spanBio = '<span class="status-btn danger-btn">UDAH ISI BIODATA </span>';
                }
                // Manipulasi data pegawai dan masukkan ke dalam bentuk tabel
                tableData += `
                            <tr style="text-align: center; vertical-align: middle">
                            <td>
                            <div class="min-width">
                                <p>${index + 1}</p>
                            </div>
                            </td>
                            <td class="min-width">
                                <p>Jalur Reguler</p>
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
                            </td>
                            <td>
                                <p>2019</p>
                            </td>
                            <td>
                                <p>${formattedTglDaftar}</p>
                            </td>
                            <td style="text-align: center; vertical-align: middle">
                            ${spanVa}
                            </td>
                            <td style="text-align: center; vertical-align: middle">
                            ${spanBio}
                            </td>
                        </tr>`;
                });
                // Tampilkan data pegawai ke dalam tabel
                document.getElementById("tablebody").innerHTML = tableData;

                // // Untuk Button Detail
                // const detailButton = document.querySelectorAll(".btn-warning");
                // detailButton.forEach(button => {
                //     button.addEventListener('click', (event) => {
                //         const id = event.target.getAttribute('data-pembuat-akun');
                //         window.location.href = `inti/detail-pembuat-akun.html?id=${id}`;
                //     });
                // });

                // Untuk Memunculkan Pagination Halamannya
                displayData(halamannow);
                updatePagination();
            } else {
                // Tampilkan pesan kesalahan jika permintaan tidak berhasil
                tablebody.innerHTML = `<tr><td colspan="5">${data.status}</td></tr>`;
            }
        }
    })

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

