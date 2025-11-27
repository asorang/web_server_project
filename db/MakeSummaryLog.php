<?php
$conn = mysqli_connect('localhost', 'root', '');
if (!$conn) die('Could not connect: ' . mysqli_connect_error());

if (!mysqli_select_db($conn, 'DBTeam008')) 
    die('Can\'t use DBTeam008: ' . mysqli_error($conn));

$sql = "CREATE TABLE IF NOT EXISTS SummaryLog (
    game_id INT NOT NULL,
    turn SMALLINT NOT NULL,
    eval_category ENUM('good', 'normal', 'miss', 'missed_win') NOT NULL,
    advantage_score SMALLINT NOT NULL,
    PRIMARY KEY (game_id, turn)
)";

if (!mysqli_query($conn, $sql)) 
    echo 'Error creating table: ' . mysqli_error($conn) . "\n";
else 
    echo 'SummaryLog table created successfully' . "\n";

mysqli_close($conn);
?>
