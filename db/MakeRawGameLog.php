<?php
$conn = mysqli_connect('localhost', 'root', '');
if (!$conn) die('Could not connect: ' . mysqli_connect_error());

if (!mysqli_select_db($conn, 'DBTeam008')) 
    die('Can\'t use DB: ' . mysqli_error($conn));

$sql = "CREATE TABLE IF NOT EXISTS RawGameLog (
    game_id INT NOT NULL,
    turn SMALLINT NOT NULL,
    player_color ENUM('B','W') NOT NULL,
    x TINYINT NOT NULL,
    y TINYINT NOT NULL,
    PRIMARY KEY (game_id, turn)
)";

if (!mysqli_query($conn, $sql)) 
    echo 'Error creating RawGameLog: ' . mysqli_error($conn) . "\n";
else 
    echo 'RawGameLog table created successfully' . "\n";

mysqli_close($conn);
?>
