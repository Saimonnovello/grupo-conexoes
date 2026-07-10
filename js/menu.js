const botao = document.querySelector(".menu-mobile");
const sidebar = document.querySelector(".sidebar");

if (botao && sidebar) {

    botao.addEventListener("click", () => {

        sidebar.classList.toggle("ativo");

    });

}