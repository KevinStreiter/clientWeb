<?php
class db {
    private $host = 'localhost';
    private $user = 'kev';
    private $pass = 'MWXw9$Ppmjl51drrm7';
    private $dbname = 'mySlimDB';

    public function connect() {
        $mysql_connect_str = "mysql:host=$this->host;dbname=$this->dbname";
        $dbConnection = new PDO($mysql_connect_str, $this->user, $this->pass);
        $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $dbConnection;
    }
}
