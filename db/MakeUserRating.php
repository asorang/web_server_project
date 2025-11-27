<?php
$conn = mysqli_connect('localhost', 'root', '');
if (!$conn) die('Could not connect: ' . mysqli_connect_error());

if (!mysqli_select_db($conn, 'DBTeam008')) 
    die('Can\'t use DBTeam008: ' . mysqli_error($conn));

$sql = "CREATE TABLE IF NOT EXISTS UserRating (
    uid INT NOT NULL,
    score INT NOT NULL DEFAULT 1000,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (uid),
    FOREIGN KEY (uid) REFERENCES usertable(uid)
)";

if (!mysqli_query($conn, $sql)) 
    echo 'Error creating UserRating: ' . mysqli_error($conn) . "\n";
else 
    echo 'UserRating table created successfully' . "\n";

mysqli_close($conn);
?>
