import {
 getAuth,
 onAuthStateChanged,
 signOut,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"

import {
 getDatabase,
 ref,
 set,
 onValue,
 remove,
 child,
 push,
 update,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js"

let userUid
let newPersonKey
let userData

const auth = getAuth()

// onAuthStateChanged Verifica se há um usuário conectado
onAuthStateChanged(auth, (user) => {
 if (user) {
  // Caso tenha um usuário, pego o id dele e busco os dados no realtime database do firebase
  userUid = user.uid

  getUserPhp(userUid)

  const db = getDatabase()
  const userRef = ref(db, "users/" + user.uid)

  // a função onValue roda toda vez que o banco de dados na referência do usuário atual se modifica (quando adiciona, edita ou exclui o usuário)
  onValue(userRef, (snapshot) => {
   // snapshot.val() retorna os valores do usuário no do banco de dados
   const data = snapshot.val()
   userData = data
   loadUsersData(data)
  })
 } else {
  // Caso não tiver um usuário conectado, ele vai para a página de login/cadastro
  window.location.pathname = "/"
 }
})

function getUserPhp(uid) {
  // URL da sua página PHP e parâmetros GET
  const url = '/drEtec/drEtec/upload/getuser.php';
  const parametros = `userid=${uid}`;

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

        alert(xhr.responseText);

        const perfil = document.querySelector("#perfil")
        perfil.innerHTML = `Perfil   ${xhr.responseText}`

      } else {
        console.error('Erro na requisição:', xhr.statusText);
      }
    }
  };

  // Enviar a requisição
  xhr.send();
}


const activeAddUserModal_btn = document.querySelector(".activeAddUserModal")
const addUserModal = document.querySelector(".addUserModal")
const closeUserModal_btn = document.querySelector("#closeAddUserModal")
const closeEditUserModal_btn = document.querySelector("#closeEditUserModal")
const editUserModal = document.querySelector(".editUserModal")
const createUser_btn = document.querySelector("#createUser")
const editUser_btn = document.querySelector("#editUser")
const table = document.querySelector("table")

const username_input = document.querySelector("#username")
const date_input = document.querySelector("#date")
const relation_input = document.querySelector("#relation")
const behaviour_input = document.querySelector("#behaviour")
const attitude_input = document.querySelector("#attitude")
const voice_input = document.querySelector("#voice")

const edit_username_input = document.querySelector("#user-username")
const edit_date_input = document.querySelector("#user-date")
const edit_relation_input = document.querySelector("#user-relation")
const edit_behaviour_input = document.querySelector("#user-behaviour")
const edit_attitude_input = document.querySelector("#user-attitude")
const edit_voice_input = document.querySelector("#user-voice")

const logout_btn = document.getElementById("logout")

// Toda vez que o usuário clica para abrir a modal de adicionar usuário, eu limpo os inputs
function openCreateUserModal() {
 addUserModal.classList.add("active")

 username_input.value = ""
 date_input.value = ""
 relation_input.value = "Outro"
 behaviour_input.value = 5
 attitude_input.value = 5
 voice_input.value = 5
}

// Fecho a modal de adicionar usuário
function closeCreateUserModal() {
 addUserModal.classList.remove("active")
}

// Toda vez que abre a modal de editar o usuário, pego os valores da tabela e atribuo aos inputs
function openEditUserModal(e) {
 editUserModal.classList.add("active")

 const person = document.querySelector(`#${e.srcElement.dataset.personid}`)

 edit_username_input.value = person.children[0].textContent
 edit_date_input.value = person.children[1].textContent
 edit_relation_input.value = person.children[2].textContent

 // Como os inputs de comportamento, atitude e tom de voz não estão diretamente na tabela, eu pego os valores direto do banco de dados, na variável userData criei no início e atribui na função onValue
 edit_behaviour_input.value = userData[e.srcElement.dataset.personid].behaviour
 edit_attitude_input.value = userData[e.srcElement.dataset.personid].attitude
 edit_voice_input.value = userData[e.srcElement.dataset.personid].voice

 // Adiciono o ID do usuário no botão de editar da modal
 editUser_btn.setAttribute("data-personId", e.srcElement.dataset.personid)
}

// Fecho a modal de editar usuário
function closeEditUserModal() {
 editUserModal.classList.remove("active")
}

// Carrego as informções dos usuários
function loadUsersData(usersData) {
 // limpo toda a tabela
 table.innerHTML = `    
  <tr class="table-header">
    <th>Nome</th>
    <th>Data Nasc</th>
    <th>Relacionamento</th>
    <th>Pontos</th>
    <th>Editar</th>
    <th>Excluir</th>
  </tr>`

 // para cada pessoa na lista de usuários no banco de dados:
 for (let personId in usersData) {
  const person = usersData[personId]

  // crio uma linha na tabela com o id do usuário
  const tr = document.createElement("tr")
  tr.classList.add("user-row")
  tr.setAttribute("id", personId)

  // crio o botão de editar, adicionando o id do usuário nele
  const tdRowEdit = document.createElement("td")
  const edit_btn = document.createElement("button")
  edit_btn.setAttribute("data-personId", personId)
  edit_btn.classList.add("user-btn")
  edit_btn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`
  edit_btn.addEventListener("click", (e) => {
   openEditUserModal(e)
  })

  // crio o botão de excluir, adicionando o id do usuário nele
  const tdRowDelete = document.createElement("td")
  const delete_btn = document.createElement("button")
  delete_btn.classList.add("user-btn")
  delete_btn.innerHTML = `<i class="fa-solid fa-trash"></i>`
  delete_btn.addEventListener("click", () => {
   deleteUser(personId)
  })

  // atribuo os valores na linha da tabela
  tr.innerHTML = `
    <td>${person.name}</td>
    <td>${person.date}</td>
    <td>${person.relation}</td>
    <td>${(
     (Number(person.behaviour) +
      Number(person.attitude) +
      Number(person.voice)) /
     3
    ).toFixed(2)}</td>
  `

  tdRowEdit.appendChild(edit_btn)
  tdRowDelete.appendChild(delete_btn)
  tr.append(tdRowEdit, tdRowDelete)
  // insiro a linha na tabela
  table.appendChild(tr)
 }
}

// Crio o usuário no banco de dados
function createUser() {
 const db = getDatabase()

 // crio uma chave para o usuário, que posteriormente será o id dele no html
 newPersonKey = push(child(ref(db), `users/${userUid}`)).key

 set(ref(db, `users/${userUid}/${newPersonKey}`), {
  name: username_input.value,
  date: date_input.value,
  relation: relation_input.value,
  behaviour: behaviour_input.value,
  attitude: attitude_input.value,
  voice: voice_input.value,
 })

 // fecho a modal
 closeCreateUserModal()
}

// excluo o usuário do banco de dados
function deleteUser(id) {
 const db = getDatabase()

 remove(ref(db, `/users/${userUid}/${id}`))
}

// edito o usuário no banco de dados
function updateDbPersonData(
 personId,
 name,
 date,
 relation,
 behaviourPoints,
 attitudePoints,
 voicePoints
) {
 const db = getDatabase()

 const personData = {
  name: name,
  date: date,
  relation: relation,
  behaviour: behaviourPoints,
  attitude: attitudePoints,
  voice: voicePoints,
 }

 return update(ref(db, `/users/${userUid}/${personId}`), personData)
}

// função que pegará os valores do input da modal de editar e passar pra função de editar usuário no banco de dados
function editUserData(e) {
 e.preventDefault()

 const person = document.querySelector(`#${e.target.dataset.personid}`)

 updateDbPersonData(
  person.getAttribute("id"),
  edit_username_input.value,
  edit_date_input.value,
  edit_relation_input.value,
  edit_behaviour_input.value,
  edit_attitude_input.value,
  edit_voice_input.value
 )

 // fecho a modal de editar
 closeEditUserModal()
}

closeUserModal_btn.addEventListener("click", closeCreateUserModal)
closeEditUserModal_btn.addEventListener("click", closeEditUserModal)
editUser_btn.addEventListener("click", (e) => editUserData(e))

activeAddUserModal_btn.addEventListener("click", openCreateUserModal)

createUser_btn.addEventListener("click", (e) => {
 e.preventDefault()

 createUser()
})

// função de logout da conta
logout_btn.addEventListener("click", () => {
 const auth = getAuth()
 signOut(auth)
  .then(() => {
   window.location.pathname = "/"
  })
  .catch((error) => {
   console.log(error)
   alert("Não conseguimos te desconectar, tente novamente!")
  })
})
