<?php
require_once('components/DB.php');
$db = Db::getConnection();
$query = (string)$_GET['query'];
$search = array();

$result = $db->query("SELECT * FROM products WHERE  `title` LIKE '%" . $query . "%' LIMIT 0, 10");

$i = 0;

while ($row = $result->fetch()) {
    $search[$i]['id'] = $row['id'];
    $search[$i]['title'] = $row['title'];
    $search[$i]['price'] = $row['price'];
    $search[$i]['img'] = $row['img'];
    $i++;
}
echo json_encode($search);