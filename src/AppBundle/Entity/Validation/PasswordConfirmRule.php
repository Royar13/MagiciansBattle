<?php

namespace AppBundle\Entity\Validation;

class PasswordConfirmRule extends Rule {

    private $password;

    public function __construct($password) {
        $this->message = "{name} doesn't match the password";
        $this->fieldName = "Password confirmation";
        $this->password = $password;
    }

    public function validate($value) {
        return $this->password === $value;
    }

}
