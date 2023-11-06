<?php
    include ("conecta.php");

    $email = $_GET["email"];
    $userid  = $_GET["userid"];

    // $cpf = $_POST["cpf"];
    // $dataNasc = $_POST["dataNasc"];

    $sqlins = "INSERT INTO users (email, userid ) VALUES ('$email', '$userid')";

    $resultado = mysqli_query ($conexao, $sqlins);




?>