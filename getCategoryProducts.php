<?php
require_once('components/DB.php');
$db = Db::getConnection();
$products = array();

if(isset($_GET['cat_links']) && isset($_GET['page'])){
    $cat_links = $_GET['cat_links'];
    $page = $_GET['page'];
    $result = $db->query("SELECT * FROM products WHERE cat_links = '$cat_links' ORDER BY id ASC LIMIT $page,6");
}

$i = 0;
while ($row = $result->fetch()) {
    $products[$i]['id'] = $row['id'];
    $products[$i]['title'] = $row['title'];
    $products[$i]['price'] = $row['price'];
    $products[$i]['img'] = $row['img'];
    $i++;

}
echo json_encode($products);

