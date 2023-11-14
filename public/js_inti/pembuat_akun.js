// Import library yang dibutuhkan
import { UrlGetPendaftar } from "../controller/template.js";

// Untuk Get All Data Pendaftar
fetch(UrlGetPendaftar)
	.then((result) => {
		return result.json();
	})
	.then((data) => {
		let tableData = "";
		data.data.map((values, index) => {
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
                            <p>${values.tgl_daftar_mhs}</p>
                        </td>
                    </tr>`;
		});
		// Tampilkan data pegawai ke dalam tabel
		document.getElementById("tablebody").innerHTML = tableData;
	})
	.catch(error => {
		console.log('error', error);
	});