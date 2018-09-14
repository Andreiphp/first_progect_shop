<?php
require_once('components/DB.php');
$db = Db::getConnection();
$products = array();
if(empty($_GET['cat'])){

    $result = $db->query("SELECT * FROM products ");
}else{
    $countt = $_GET['cat'];
    $result = $db->query("SELECT * FROM products WHERE cat_links = '$countt'");
}

$count = $result->rowCount();
echo json_encode($count);