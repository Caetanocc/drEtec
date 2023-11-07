<?php
    include ("conecta.php");

    $userid  = $_GET["userid"];

    // $cpf = $_POST["cpf"];
    // $dataNasc = $_POST["dataNasc"];

    $sqlins = "select email, userid, name, nivel from users";

    $resultado = mysqli_query ($conexao, $sqlins);

    $dados = mysqli_fetch_assoc($resultado);

    echo $dados('email');



?>