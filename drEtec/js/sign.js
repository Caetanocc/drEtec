import {
 getAuth,
 createUserWithEmailAndPassword,
 signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"

const signIn_input = document.querySelector("#signin")
const signUp_input = document.querySelector("#signup")

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

 createUserWithEmailAndPassword(auth, email_input.value, password_input.value)
  .then((userCredential) => {
   // Signed in


   salvarUserPhp(userCredential.user.uid,userCredential.user.email)
   window.location.pathname = "/drEtec/html/list.html"

  })
  .catch((error) => {
   const errorCode = error.code
   const errorMessage = error.message
   alert(errorMessage)
  })
})


function salvarUserPhp(uid,email) {

  // URL da sua página PHP e parâmetros GET
  const url = '/drEtec/upload/salvar.php';
  const parametros = `userid=${uid}&email=${email}`;

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
