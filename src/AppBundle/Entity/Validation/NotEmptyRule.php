<?php

namespace AppBundle\Entity\Validation;

class NotEmptyRule extends Rule {

    public function __construct() {
        $this->message = "{name} is required";
    }

    public function validate($value) {

        if (is_string($value)) {
            $value = trim($value);
        }
        return !empty($value);
    }

}
