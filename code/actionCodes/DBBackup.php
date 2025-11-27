<?php
    // 백업 관련 설정
    $dbUser = 'root';
    $dbPass = ''; // 비번 있으면 입력
    $dbName = 'DBTeam008';

    // mysqldump 경로 (XAMPP 기본)
    $mysqldumpPath = 'C:\\xampp\\mysql\\bin\\mysqldump.exe';

    // 백업 파일 저장 위치
    $backupDir = '../../db/';
    if (!is_dir($backupDir)) mkdir($backupDir, 0777, true);

    $backupFile = $backupDir . '\\backup.sql'; // 고정 파일명

    // 백업 실행
    $command = "\"$mysqldumpPath\" -u $dbUser " . ($dbPass ? "-p$dbPass " : "") . "$dbName > \"$backupFile\"";
    system($command, $result);

    if ($result === 0)
        echo "자동 백업 완료됨";
    else
        echo "백업 실패함";
?>
