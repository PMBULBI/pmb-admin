// Import library yang dibutuhkan
import { UrlGetPendaftar } from "../controller/template.js";
import { formatTwoDigits } from "../style/formatdate.js"

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
        const formattedTglDaftar = `${formatTwoDigits(tglDaftar.getDate())}-${formatTwoDigits(tglDaftar.getMonth() + 1)}-${tglDaftar.getFullYear()} (${tglDaftar.toLocaleTimeString()})`;

			// Manipulasi data pegawai dan masukkan ke dalam bentuk tabel
			tableData += `
                        <tr>
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
                            <p>${values.email_mhs}</p>
                            <p>${values.username_admin}</p>
                            <p>${values.password}</p>
                        </td>
                        <td>
                            <p>${values.asal_sekolah}</p>
                            <p>${values.kota_sekolah}</p>
                            <p>${values.provinsi_sekolah}</p>
                        </td>
                        <td>
                            <p>${formattedTglDaftar}</p>
                        </td>
                        <td>
                            <a href="#" class="btn btn-info" role="button" style="color: white;">Edit</a>
                            <a href="#" class="btn btn-danger" role="button">Hapus</a>
                        </td>
                    </tr>`;
		});
		// Tampilkan data pegawai ke dalam tabel
		document.getElementById("tablebody").innerHTML = tableData;
	})
	.catch(error => {
		console.log('error', error);
	});