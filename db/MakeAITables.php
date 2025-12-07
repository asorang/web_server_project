<?php
$conn = mysqli_connect('localhost', 'root', '');
if (!$conn) die('Could not connect: ' . mysqli_connect_error());

if (!mysqli_select_db($conn, 'DBTeam008')) 
    die('Can\'t use DBTeam008: ' . mysqli_error($conn));

// ----------------------------
// RawGameLog 테이블
// ----------------------------
$sql = "CREATE TABLE IF NOT EXISTS RawGameLog (
    game_id VARCHAR(30),
    turn SMALLINT NOT NULL,
    user_id1 INT NOT NULL,
    user_id2 INT NOT NULL,
    user1_color ENUM('B','W') NOT NULL,
    user2_color ENUM('B','W') NOT NULL,
    x TINYINT NOT NULL,
    y TINYINT NOT NULL,
    color ENUM('B','W') NOT NULL,
    user1_score SMALLINT DEFAULT 0,
    user2_score SMALLINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    game_if ENUM('normal','resign','draw') DEFAULT 'normal',
    winner ENUM('B','W','') DEFAULT '',
    PRIMARY KEY (game_id, turn),
    FOREIGN KEY (user_id1) REFERENCES usertable(uid),
    FOREIGN KEY (user_id2) REFERENCES usertable(uid)
)";

if (!mysqli_query($conn, $sql)) 
    echo 'Error creating RawGameLog: ' . mysqli_error($conn) . "\n";
else 
    echo 'RawGameLog table created successfully' . "\n";


// ----------------------------
// SummaryLog 테이블
// ----------------------------
$sql = "CREATE TABLE IF NOT EXISTS SummaryLog (
    game_id VARCHAR(30) PRIMARY KEY,
    user_id1 INT NOT NULL,
    user_id2 INT NOT NULL,
    user1_color ENUM('B','W') NOT NULL,
    user2_color ENUM('B','W') NOT NULL,
    winner ENUM('B','W') DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id1) REFERENCES usertable(uid),
    FOREIGN KEY (user_id2) REFERENCES usertable(uid)
)";
if (!mysqli_query($conn, $sql)) 
    echo 'Error creating SummaryLog: ' . mysqli_error($conn) . "\n";
else 
    echo 'SummaryLog table created successfully' . "\n";

// ----------------------------
// UserRating 테이블
// ----------------------------
$sql = "CREATE TABLE IF NOT EXISTS UserRating (
    uid INT NOT NULL,
    score INT NOT NULL DEFAULT 500,
    games_played INT NOT NULL DEFAULT 0,
    win_rate FLOAT DEFAULT 0,
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
