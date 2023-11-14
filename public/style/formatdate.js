// Fungsi untuk memastikan bahwa angka selalu dua digit (dengan menambahkan 0 di depan jika diperlukan)
export function formatTwoDigits(number) {
    return (number < 10 ? '0' : '') + number;
}

export function formatTanggalWaktu(date) {
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    const formattedDate = new Date(date).toLocaleDateString('id-ID', options);

    const timeOptions = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    const formattedTime = new Date(date).toLocaleTimeString(timeOptions);

    return `${formattedDate} || ${formattedTime}`;
}