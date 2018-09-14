<?php
require_once('components/DB.php');
$db = Db::getConnection();
$name = htmlspecialchars(strip_tags(trim($_POST['name'])));
$lastname = htmlspecialchars(strip_tags(trim($_POST['lastname'])));
$address = htmlspecialchars(strip_tags(trim($_POST['address'])));
$mail = htmlspecialchars(strip_tags(trim($_POST['mail'])));
$password = htmlspecialchars(strip_tags(trim(md5($_POST['password']))));
$update = $_POST['update'];
$select = $_POST['select'];
$id = $_POST['user_id'];

if ($select) {
    $sql = "SELECT name, lastname, mail, address  FROM users WHERE id = :id";
    $result = $db->prepare($sql);
    $result->bindParam(':id', $id, PDO::PARAM_INT);
    $result->execute();
    $user = $result->fetch();
    echo json_encode($user);
} else {
    if ($update) {
        $sql = "UPDATE users SET  name = :name, lastname = :lastname, address = :address, mail = :mail  WHERE id = :id";
        $result = $db->prepare($sql);
        $result->bindParam(':name', $name, PDO::PARAM_STR);
        $result->bindParam(':lastname', $lastname, PDO::PARAM_STR);
        $result->bindParam(':address', $address, PDO::PARAM_STR);
        $result->bindParam(':mail', $mail, PDO::PARAM_STR);
        $result->bindParam(':id', $id, PDO::PARAM_INT);
        $result->execute();
        echo $update;

    } else {
        $sql = "INSERT INTO users (name,lastname,address,mail,password) VALUES(:name,:lastname,:address,:mail,:password)";
        $result = $db->prepare($sql);
        $result->bindParam(':name', $name, PDO::PARAM_STR);
        $result->bindParam(':lastname', $lastname, PDO::PARAM_STR);
        $result->bindParam(':address', $address, PDO::PARAM_STR);
        $result->bindParam(':mail', $mail, PDO::PARAM_STR);
        $result->bindParam(':password', $password, PDO::PARAM_STR);
        $result->execute();
    }
}




