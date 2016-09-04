<?php

namespace AppBundle\Entity\Validation;

use AppBundle\Entity\Validation\ValidationResult;
use AppBundle\Entity\Validation\Rule;

class Validator {

    private $validationResult;
    private $useRules;
    private $useFieldNames;
    private $useMessages;

    public function __construct(ValidationResult $validationResult = null) {
        $this->reset();
        if ($validationResult === null) {
            $this->validationResult = new ValidationResult();
        } else {
            $this->validationResult = $validationResult;
        }
    }

    public function validate($propertyName, $value) {
        if (count($this->useRules) === 0)
            throw new Exception("Rule undefined");

        $passed = true;

        for ($i = 0; $i < count($this->useRules); $i++) {
            $rule = $this->useRules[$i];
            $fieldName = $this->useFieldNames[$i];
            $message = $this->useMessages[$i];
            if ($message !== null) {
                $rule->setMessage($message);
            } else if ($fieldName !== null) {
                $rule->setFieldName($fieldName);
            } else if ($rule->getFieldName() === null) {
                $rule->setFieldName(ucfirst($propertyName));
            }
            if (!$rule->validate($value)) {
                $passed = false;
                if ($rule->getMessage() !== null) {
                    $this->validationResult->addError($propertyName, $rule->getMessage());
                } else {
                    $this->validationResult->setInvalid();
                }
            }
        }


        $this->reset();
        return $passed;
    }

    public function rule(Rule $rule) {
        $index = count($this->useRules);
        $this->useRules[$index] = $rule;
        $this->useFieldNames[$index] = null;
        $this->useMessages[$index] = null;
        return $this;
    }

    public function withName($fieldName) {
        $index = count($this->useRules) - 1;
        if ($index < 0) {
            throw new Exception("No rule defined ('withName' must be used after defining the rule)");
        }
        $this->useFieldNames[$index] = $fieldName;
        return $this;
    }

    public function withMessage($message) {
        $index = count($this->useRules) - 1;
        if ($index < 0) {
            throw new Exception("No rule defined ('withMessage' must be used after defining the rule)");
        }
        $this->useMessages[$index] = $message;
        return $this;
    }

    public function getResult() {
        return $this->validationResult;
    }

    public function isValid() {
        return $this->validationResult->isValid();
    }

    private function reset() {
        $this->useRules = array();
        $this->useFieldNames = array();
        $this->useMessages = array();
    }

}
