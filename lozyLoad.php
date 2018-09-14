<?php
require_once('components/DB.php');
$db = Db::getConnection();
$page = $_POST['page'];

$result = $db->query("SELECT * FROM products ORDER BY id ASC LIMIT $page,1");

$products = array();
$i = 0;
while ($row = $result->fetch()) {
    $products[$i]['id'] = $row['id'];
    $products[$i]['title'] = $row['title'];
    $products[$i]['price'] = $row['price'];
    $products[$i]['img'] = $row['img'];
    $products[$i]['count'] = $row['count'];
    $i++;
}

echo json_encode($products);