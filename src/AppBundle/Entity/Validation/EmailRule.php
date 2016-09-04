<?php

namespace AppBundle\Entity\Validation;

class EmailRule extends Rule {

    public function __construct() {
        $this->message = "{name} is invalid";
        $this->fieldName = "Email address";
    }

    public function validate($value) {
        return filter_var($value, FILTER_VALIDATE_EMAIL) !== false;
    }

}
