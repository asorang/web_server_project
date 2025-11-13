<?php
    $conn = mysqli_connect('localhost', 'root', ''); // 마지막 매개변수는 비밀번호이나 현재 없음.
    if (!$conn) die('Could not connect: ' . mysqli_connect_error());
    
    $sql = "create database DBSpinSpinGomuk"; // 자신의 학번으로 할 것!!
    if (!mysqli_query($conn, $sql)) echo 'Error creating database: ' . mysqli_error($conn) . "\n";
    else echo 'Database is created' . "\n";
?>