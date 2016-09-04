<?php

namespace AppBundle\Entity\Validation;

abstract class Rule {

    protected $message;
    protected $fieldName;

    public abstract function validate($value);

    public function getMessage() {
        if ($this->message === null)
            return null;
        $replaceName = $this->fieldName;
        if ($this->fieldName === null) {
            $replaceName = "Field";
        }
        return str_replace("{name}", $replaceName, $this->message);
    }

    public function setMessage($message) {
        $this->message = $message;
    }

    public function getFieldName() {
        return $this->fieldName;
    }

    public function setFieldName($fieldName) {
        $this->fieldName = $fieldName;
    }

}
