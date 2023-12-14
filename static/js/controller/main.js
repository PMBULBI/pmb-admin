import { setInner } from "https://jscroot.github.io/element/croot.js";
import { getWithHeader } from "https://jscroot.github.io/api/croot.js";
// import { getCookie, setCookieWithExpireHour } from "https://jscroot.github.io/cookie/croot.js";
// import { getHash } from "https://jscroot.github.io/url/croot.js";


const main = async () => {

    let token = await getCookie("login");

    await getWithHeader("https://komarbe.ulbi.ac.id/admin/token", "LOGIN", token, dataAdmin);



}


const dataAdmin = (res) => {
    if (!res.success){
        window.location.replace("../");
    }
    setInner("namaadmin", res.data.nama_admin);
    setInner("hpadmin", res.data.no_hp);
    setInner("emailadmin", res.data.email);
}


main();