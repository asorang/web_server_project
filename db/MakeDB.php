<?php
    // DB 연결
    $conn = mysqli_connect('localhost', 'root', '');
    if (!$conn) die('Could not connect: ' . mysqli_connect_error());

    $dbName = 'DBTeam008';
    $sql = "CREATE DATABASE $dbName";

    if (!mysqli_query($conn, $sql)) {
        echo 'Error creating database: ' . mysqli_error($conn) . "\n";
    } else {
        echo "Database $dbName is created\n";

        // 복원 설정
        $dbUser = 'root';
        $dbPass = ''; // 비번 있으면 입력
        $backupFile = './backup.sql'; // 복원할 파일
        $mysqlPath = 'C:\\xampp\\mysql\\bin\\mysql.exe';

        // 복원 명령어 실행
        $command = "\"$mysqlPath\" -u $dbUser " . ($dbPass ? "-p$dbPass " : "") . "$dbName < \"$backupFile\"";
        system($command, $result);

        if ($result === 0)
            echo "데이터베이스 복원 완료됨\n";
        else
            echo "복원 실패함. 반환값: $result\n";
    }
?>
