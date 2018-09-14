<?php

class Db
{

    public static function getConnection()  // соединение с базой
    {
        $paramsPath = require_once('/db_params.php');
        $dsn = "mysql:host={$paramsPath['host']};dbname={$paramsPath['dbname']}";
        $db = new PDO($dsn, $paramsPath['user'], $paramsPath['password']);
        $db->exec("set names utf8");
        return $db;
    }

}