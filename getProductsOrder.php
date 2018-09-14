<?php
require_once('components/DB.php');
$db = Db::getConnection();
$id = $_POST['id'];
$result = $db->prepare("SELECT products FROM orders WHERE id = ? ORDER BY id");
$result->execute(array($id));
$name = $result->fetchColumn();
echo ($name);
