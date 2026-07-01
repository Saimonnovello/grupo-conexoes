async function carregarTotalRelatorios() {

    const { data, error } = await supabaseClient
        .from("relatorios")
        .select("id");

    if (error) {
        console.error(error);
        return;
    }

    document.getElementById("totalRelatorios").textContent = data.length;
}

carregarTotalRelatorios();

const tipoUsuario = localStorage.getItem("tipoUsuario");

if (tipoUsuario !== "admin") {
    document.getElementById("menuUsuarios").style.display = "none";
}

const temaBtn = document.querySelector(".tema-btn");

temaBtn.onclick = function(){

    document.body.classList.toggle("dark");

}

const tema = localStorage.getItem("tema");

if(tema==="dark"){

    document.body.classList.add("dark");

}

temaBtn.onclick=function(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("tema","dark");

    }else{

        localStorage.setItem("tema","light");

    }

}