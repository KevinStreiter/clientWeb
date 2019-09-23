<?php

namespace App\Factories;

class UserFactory
{
    function __invoke()
    {
        return new \App\Models\User();
    }
}