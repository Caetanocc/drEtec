<?php
    include ("conecta.php");

    $email   = $_GET["email"];
    $userid  = $_GET["userid"];
    $nome    = $_GET["nome"];
    $nivel   = $_GET["nivel"];
    

    // $cpf = $_POST["cpf"];
    // $dataNasc = $_POST["dataNasc"];

    $sqlins = "INSERT INTO users (email, userid, name, nivel ) 
             VALUES ('$email', '$userid', '$nome', '$nivel')";

    $resultado = mysqli_query ($conexao, $sqlins);




?>