// Fungsi untuk memastikan bahwa angka selalu dua digit (dengan menambahkan 0 di depan jika diperlukan)
export function formatTwoDigits(number) {
    return (number < 10 ? '0' : '') + number;
}