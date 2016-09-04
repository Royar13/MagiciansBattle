<?php

namespace AppBundle\Entity\Validation;

class ValidationResult {

    private $errors = array();
    private $validity = true;

    public function addError($propertyName, $message) {
        $this->errors[] = new Error($propertyName, $message);
        $this->validity = false;
    }

    public function addErrors($errorsArr) {
        foreach ($errorsArr as $error) {
            $this->errors[] = $error;
        }
        $this->validity = false;
    }

    public function addGeneralError($message) {
        $this->addError(null, $message);
    }

    public function getErrors() {
        $arr = array();
        foreach ($this->errors as $error) {
            $arr[$error->getPropertyName()][] = $error->getMessage();
        }
        return $arr;
    }

    public function getOutput() {
        $arr["success"] = $this->isValid();
        if (!$arr["success"]) {
            $arr["errors"] = $this->getErrors();
        }
        return $arr;
    }

    public function setInvalid() {
        $this->validity = false;
    }

    public function isValid() {
        return $this->validity;
    }

}
