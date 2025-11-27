<?php
$conn = mysqli_connect('localhost', 'root', '');
if (!$conn) die('Could not connect: ' . mysqli_connect_error());

if (!mysqli_select_db($conn, 'DBTeam008')) 
    die('Can\'t use DBTeam008: ' . mysqli_error($conn));

$sql = "CREATE TABLE IF NOT EXISTS PatternWeight (
    pattern_id INT NOT NULL,
    difficulty SMALLINT NOT NULL,
    weight FLOAT NOT NULL,
    pattern_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (pattern_id, difficulty)
)";

if (!mysqli_query($conn, $sql)) 
    echo 'Error creating PatternWeight: ' . mysqli_error($conn) . "\n";
else 
    echo 'PatternWeight table created successfully' . "\n";

mysqli_close($conn);
?>
