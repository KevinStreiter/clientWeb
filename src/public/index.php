<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Slim\Views\PhpRenderer;

require '../../vendor/autoload.php';

$app = new \Slim\App;
$container = $app->getContainer();
$container['renderer'] = new PhpRenderer("./templates");


$app->get('/bubbles', function ($request, $response, $args) {
    return $this->renderer->render($response, "/home.html", $args);
});

$app->run();