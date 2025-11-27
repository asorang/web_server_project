<?php
    $conn = mysqli_connect('localhost', 'root', '');
        if (!$conn) die('Could not connect: ' . mysqli_connect_error());
        if (!mysqli_select_db($conn, 'DBTeam008')) die('Can\'t use foo : ' . mysqli_error($conn));
?>