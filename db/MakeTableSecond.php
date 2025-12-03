<?php
    $conn = mysqli_connect('localhost', 'root', '');
    if (!$conn) die('Could not connect: ' . mysqli_connect_error());
    if (!mysqli_select_db($conn, 'DBTeam008')) die('Can\'t use foo : ' . mysqli_error($conn));
    
    $sql = "create table userTable (uid int PRIMARY KEY, nickname varchar(20) not null, gender varchar(20) not null, setting varchar(40) not null, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";
    if (!mysqli_query($conn, $sql)) echo 'Error creating table: ' . mysqli_error($conn) . "\n";
    else echo 'Table data is created' . "\n";
    mysqli_close($conn);
?>