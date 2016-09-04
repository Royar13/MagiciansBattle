<?php

namespace AppBundle\Entity\Validation;

class Error {

    private $propertyName;
    private $message;

    public function __construct($propertyName, $message) {
        if ($propertyName === null) {
            $propertyName = "generalErrors";
        }
        $this->propertyName = $propertyName;
        $this->message = $message;
    }

    public function getPropertyName() {
        return $this->propertyName;
    }
    
    public function getMessage() {
        return $this->message;
    }


}
