<?php
    $conn = mysqli_connect('localhost', 'root', '');
    if (!$conn) die('Could not connect: ' . mysqli_connect_error());
    if (!mysqli_select_db($conn, 'DBTeam008')) die('Can\'t use foo : ' . mysqli_error($conn));
    
    $sql = "create table LoginTable (id varchar(20) not null, password varchar(255) not null, birth int not null, name varchar(20) not null, nickname varchar(20) not null, gender varchar(20) not null, phoneNumber int not null, uid int AUTO_INCREMENT PRIMARY KEY)";
    if (!mysqli_query($conn, $sql)) echo 'Error creating table: ' . mysqli_error($conn) . "\n";
    else echo 'Table data is created' . "\n";
    mysqli_close($conn);
?>