<?php
    require "DB.php";

    $userID = $_POST['userID'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $username = $_POST['username'];
    $userBirth = $_POST['userBirth'];
    $userGender = $_POST['userGender'];
    $userNick = $_POST['userNick'];
    $number = $_POST['phone'];




// 회원 중복 검사
    $check = $conn->prepare("SELECT id FROM loginTable WHERE id = ? ");
    if (!$check) {
        die("prepare 실패 원인: " . $conn->error);
    }
    $check->bind_param("s", $userID);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo "<script>
            alert('이미 사용 중인 아이디입니다.');
            history.back(); // 이전 페이지로 돌아가기
          </script>";
        exit;
    }

// 회원가입 SQL
    $stmt = $conn->prepare("
        INSERT INTO loginTable (id, password, birth, name, nickname, gender, phoneNumber)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("ssssssi", 
    $userID, 
     $password, 
    $userBirth, 
    $username,
    $userNick,
    $userGender,
    $number);
    //uid는 테이블 다시 해야함
    if ($stmt->execute()) {
        echo "회원가입 성공!";
    } else {
        echo "오류 발생: " . $conn->error;
    }

//두번째 데이터베이스에 정보 넣기
$score = 500;
$setting = "";





$stmt = $conn->prepare("SELECT uid FROM loginTable WHERE id = ?");
    if (!$stmt) {
        die("prepare 실패 원인: " . $conn->error);
    }
    $stmt->bind_param("s", $userID);
    $stmt->execute();
    $stmt->bind_result($uid);
    $stmt->fetch();

    $stmt->free_result();    // 결과 해제
    $stmt->close();

$stmt = $conn->prepare("
        INSERT INTO userTable (uid, nickname, gender, setting)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->bind_param("isss",
    $uid,
    $userNick,
    $userGender,
    $setting
    );
    //uid는 테이블 다시 해야함
    if ($stmt->execute()) {
        echo "<script>
        alert('회원가입이 되었습니다.');
        window.location.href = '../login.php'; // 확인 누르면 이동
      </script>";
    exit();
    } else {
        echo "오류 발생: " . $conn->error;
    }

?>