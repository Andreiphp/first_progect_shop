<?php
require_once('components/DB.php');
$db = Db::getConnection();
$products = array();
$page = $_GET['page'];
if (empty($_GET['sorting'])) {
    $result = $db->query("SELECT * FROM products ORDER BY id ASC LIMIT $page,6");
} else {
    switch ($_GET['sorting']) {
        case 'default':
            $result = $db->query("SELECT * FROM products ORDER BY id ASC LIMIT $page,6");
            break;
        case 'news':
            $result = $db->query("SELECT * FROM products ORDER BY id DESC LIMIT $page,6");
            break;
        case 'price_ask':
            $result = $db->query("SELECT * FROM products ORDER BY price ASC LIMIT $page,6");
            break;
        case 'price_desk':
            $result = $db->query("SELECT * FROM products ORDER BY price DESC LIMIT $page,6");
            break;
    }
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