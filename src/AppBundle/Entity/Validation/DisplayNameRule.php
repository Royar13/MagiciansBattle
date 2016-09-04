<?php

namespace AppBundle\Entity\Validation;

class DisplayNameRule extends Rule {

    public function __construct() {
        $this->message = "{name} has some invalid characters";
        $this->fieldName = "The display name";
    }

    public function validate($value) {
        return preg_match("/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/", $value) === 1;
    }

}
