<?php
require_once('components/DB.php');
$db = Db::getConnection();
$mail = htmlspecialchars(strip_tags(trim($_POST['mail'])));
$check = array();
    $result = $db->query("SELECT id, mail FROM users WHERE mail = '$mail'");
$i = 0;
while ($row = $result->fetch()) {
    $check[$i]['id'] = $row['id'];
    $check[$i]['mail'] = $row['mail'];
    $i++;
}
echo json_encode($check);
