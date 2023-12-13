// Import library yang dibutuhkan
import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { UrlGetFakultas, UrlGetProdi, UrlGetProdiById, UrlPostProdi } from "../controller/template.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { getValue } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.0.5/croot.js";
import { get } from "https://jscroot.github.io/api/croot.js";
import { token } from "../controller/cookies.js";

var header = new Headers();
header.append("login", token);
header.append("Content-Type", "application/json");

// Get Data Program Studi
CihuyDomReady(() => {
    const tablebody = CihuyId("tablebody");
    const buttonPreviousPage = CihuyId("prevPageBtn");
    const buttonNextPage = CihuyId("nextPageBtn");
    const halamanSaatIni = CihuyId("currentPage");
    const itemPerPage = 8;
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
                            <button type="button" class="btn btn-warning" style="color: white;" prodi-id=${values.kode_program_studi} data-bs-toggle="modal" data-bs-target="#update-prodi">Edit</button>
                            <button type="button" class="btn btn-danger" prodi-id=${values.kode_program_studi}>Hapus</button>
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

// Post Program Studi
function submitProdi() {
    const namaProdi = getValue('nama_prodi');
    const kodeProdi = getValue('kode_prodi');
    const fakultasElement = document.getElementById('pilih-fakultas');
    const fakultas = fakultasElement.options[fakultasElement.selectedIndex].value;

    const myData = {
        "program_studi": namaProdi,
        "kode_program_studi": kodeProdi,
        "fakultas": fakultas
    };

    console.log(myData);

    const requestOptions = {
        method: 'POST',
        headers: header,
        body: JSON.stringify(myData)
    };

    fetch(UrlPostProdi, requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sukses!',
                    text: 'Program studi berhasil ditambahkan.',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    location.replace('program_studi.html');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Program studi gagal ditambahkan.'
                })
            }
        })
        .catch(error => {
            console.error("Error saat melakukan POST Data : ", error);
        });
}

const submitButton = document.getElementById('tambahDataButton');
submitButton.addEventListener('click', (event) => {
    event.preventDefault();
    const namaProdi = getValue('nama_prodi');
    const kodeProdi = getValue('kode_prodi');
    const fakultas = getValue('pilih-fakultas');
    if (!namaProdi || !kodeProdi || !fakultas) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Semua field harus diisi!',
        });
        return;
    }
    Swal.fire({
        title: 'Tambah Program Studi?',
        text: 'Apakah anda yakin ingin tambah program studi?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            submitProdi();
        }
    });
});


// Untuk dropdown fakultas
function fetchDataFakultas() {
    get(UrlGetFakultas, populateDropdownFakultas);
}
function populateDropdownFakultas(data) {
    const selectDropdown = document.getElementById('pilih-fakultas')
    selectDropdown.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Pilih Fakultas';
    selectDropdown.appendChild(defaultOption);

    data.data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id_fakultas;
        option.text = item.nama_fakultas;
        selectDropdown.appendChild(option);
    })
}
fetchDataFakultas();

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

// Update Data Program Studi
// Dropdown Fakultas di modal update
function fetchDataFakultasUpdate() {
    get(UrlGetFakultas, populateDropdownFakultasUpdate);
}
function populateDropdownFakultasUpdate(data) {
    const selectDropdown = document.getElementById('update-fakultas')
    selectDropdown.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Pilih Fakultas';
    selectDropdown.appendChild(defaultOption);

    data.data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id_fakultas;
        option.text = item.nama_fakultas;
        selectDropdown.appendChild(option);
    })
}
fetchDataFakultasUpdate();

// Buat fungsi updatenya beserta alertnya terlebih dahulu
function updateProdi(idProdi) {
    getProdiById(idProdi, (error, prodiData) => {
        if (error) {
            console.error("Gagal mengambil data prodi : ", error);
            return;
        }

        // Mengisi formulir update dengan data prodi yang diperoleh
        document.getElementById('update-nama_prodi').value = prodiData.program_studi;
        document.getElementById('update-kode_prodi').value = prodiData.kode_program_studi;
        document.getElementById('update-fakultas').value = prodiData.fakultas;

        // Menampilkan modal update
        const modalUpdate = new bootstrap.Modal(
            document.getElementById('update-prodi')
        );
        modalUpdate.show();
    })
}