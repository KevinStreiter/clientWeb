<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Slim\Views\PhpRenderer as PhpRenderer;

require '../vendor/autoload.php';
require '../config/db.php';

$app = new \Slim\App();
$container = $app->getContainer();

$container['renderer'] = new PhpRenderer("./templates");

$app->get('/bubbles', function ($request, $response, $args) {
    return $this->renderer->render($response, "/home.html", $args);
});

$app->get('/login', function ($request, $response, $args) {

    try {
        $db = new db();
        $connection = $db->connect();


    }catch (PDOException $e) {
        die("Database connection failed: " . $e->getMessage());
    }
    return $this->renderer->render($response, "/login.html", $args);

});

$app->post('/login', function ($request, $response, $args) {
    $data = $request->getParsedBody();
    print_r($data);
});
/*
// Register routes
require __DIR__ . '/routes.php';
*/
$app->run();