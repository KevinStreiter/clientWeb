<?php

namespace App\Controllers;

use Cake\Database\Connection;
use Slim\Views\PhpRenderer as PhpRenderer;

class UserController
{
    protected $container;

    function __construct($container) {
        $this->container = $container;
    }

    function __invoke($request, $response, $args) {
        $renderer = $this->container->get(PhpRenderer::class);
        $connection = $this->container->get(Connection::class);;
        $user = $this->container->get('user');
        $username = $request->getParam('username');
        $plainPassword = $request->getParam('password');
        $submitForm = $request->getParam('submit');
        if ($submitForm == "SignIn") {
            $userEntry = $this->getUser($username, $connection);
            if($this->isPasswordValid($plainPassword, $userEntry['Password'])) {
                return $renderer->render($response, "/home.html", $args);
            }
            else {
                $message = "Invalid Password or Username, please try again";
                echo "<script type='text/javascript'>alert('$message');</script>";
                return  $renderer->render($response, "/login.html", $args);
            }

        } elseif ($submitForm == "SignUp") {
            $encryptedPassword = $this->encryptPassword($plainPassword);
            $this->initializeUser($username, $encryptedPassword, $user);
            $this->insertUser($user, $connection);
            return  $renderer->render($response, "/login.html", $args);
        }
    }

    function initializeUser($name, $password, $user) {
        $user->setUsername($name);
        $user->setPassword($password);
    }

    function getUser($username, $connection) {
        $query = $connection->newQuery();
        $query = $query->select('Username, Password')->from('Users')->andWhere(['Username' => $username]);
        $row = $query->execute()->fetch('assoc') ?: [];
        return $row;
    }

    function insertUser($user,$connection) {
        $data = ['Username' => $user->getUsername(), 'Password' => $user->getPassword()];
        if (!empty($this->getUser($user->getUsername(), $connection))) {
            $message = $user->getUsername() . " already exists";
        }
        elseif ($data['Username'] !== '' and $data['Password'] !== '') {
            $connection->insert('Users', $data);
            $message = $user->getUsername() . " has been registered";
        }
        else {
            $message = "Please fill in the mandatory blanks";
        }
        echo "<script type='text/javascript'>alert('$message');</script>";
    }

    function encryptPassword ($plainPassword) {
        if($plainPassword !== '') {
            return password_hash($plainPassword, PASSWORD_BCRYPT, array('cost'=>12));
        }
        else {
            return '';
        }

    }

    function isPasswordValid ($plainPassword, $encryptedPassword) {
        return password_verify($plainPassword,$encryptedPassword);
    }


}
