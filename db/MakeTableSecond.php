<?php
    $conn = mysqli_connect('localhost', 'root', '');
    if (!$conn) die('Could not connect: ' . mysqli_connect_error());
    if (!mysqli_select_db($conn, 'DBSpinSpinGomuk')) die('Can\'t use foo : ' . mysqli_error($conn));
    
    $sql = "create table settingTable (uid int not null, nickname varchar(20) not null, gender int not null, score int not null, setting varchar(40) not null, primary key (uid))";
    if (!mysqli_query($conn, $sql)) echo 'Error creating table: ' . mysqli_error($conn) . "\n";
    else echo 'Table data is created' . "\n";
    mysqli_close($conn);
?>