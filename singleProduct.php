<?php
require_once('components/DB.php');
$db = Db::getConnection();
$id_product = $_GET['id_product'];
        $productByCat = array();
        $result = $db->query("SELECT id, title, img, price, discription, minidiscription, composition   FROM products WHERE id = $id_product");
        $i =0;
        while ($row=$result->fetch()){
            $productByCat['id'] = $row['id'];
            $productByCat['title'] = $row['title'];
            $productByCat['img'] = $row['img'];
            $productByCat['price'] = $row['price'];
            $productByCat['discription'] = $row['discription'];
            $productByCat['minidiscription'] = $row['minidiscription'];
            $productByCat['composition '] = $row['composition '];
            $i++;
}
echo json_encode($productByCat);
