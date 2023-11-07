import {
 getAuth,
 createUserWithEmailAndPassword,
 signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"

const signIn_input = document.querySelector("#signin")
const signUp_input = document.querySelector("#signup")
const nome_input = document.querySelector("#nome")
const rel_input = document.querySelector("#rel")

signIn_input.addEventListener("click", (e) => {
 e.preventDefault()

 const email_input = document.querySelector("#name")
 const password_input = document.querySelector("#password")
 
 const auth = getAuth()

 signInWithEmailAndPassword(auth, email_input.value, password_input.value)
  .then((userCredential) => {

    //buscarUserPhp(userCredential.user.uid)
    window.location.pathname = "/drEtec/html/list.html"
  })
  .catch((error) => {
   const errorMessage = error.message

   alert(errorMessage)
  })
})

signUp_input.addEventListener("click", (e) => {
 e.preventDefault()

 const email_input = document.querySelector("#name")
 const password_input = document.querySelector("#password")

 const auth = getAuth()

 createUserWithEmailAndPassword(auth, email_input.value, password_input.value )
  .then((userCredential) => {
   // Signed in


   salvarUserPhp(userCredential.user.uid,userCredential.user.email,nome_input.value, rel_input.value)
   window.location.pathname = "/drEtec/drEtec/html/list.html"

  })
  .catch((error) => {
   const errorCode = error.code
   const errorMessage = error.message
   alert(errorMessage)
  })
})


function salvarUserPhp(uid,email,nome,nivel) {
  // URL da sua página PHP e parâmetros GET
  const url = '/drEtec/drEtec/upload/salvar.php';
  const parametros = `userid=${uid}&email=${email}&nome=${nome}&nivel=${nivel}`;

  // Construir a URL com os parâmetros
  const urlComParametros = `${url}?${parametros}`;

  // Criar uma nova instância de XMLHttpRequest
  const xhr = new XMLHttpRequest();

  // Configurar a requisição
  xhr.open('GET', urlComParametros, true);

  // Definir o que fazer com a resposta
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        // Manipular os dados da resposta (se necessário)
        console.log(xhr.responseText);
      } else {
        console.error('Erro na requisição:', xhr.statusText);
      }
    }
  };

  // Enviar a requisição
  xhr.send();
}
