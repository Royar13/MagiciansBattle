<?php

namespace AppBundle\Entity\Validation;

class LengthRule extends Rule {

    private $min;
    private $max;

    public function __construct($min, $max) {
        $this->min = $min;
        $this->max = $max;
        if ($this->min === null) {
            $this->message = "{name} can't be longer than {$this->max} characters";
        } else if ($this->max === null) {
            $this->message = "{name} has to be at least {$this->min} characters long";
        } else {
            $this->message = "{name} has to be between {$this->min} to {$this->max} characters long";
        }
    }

    public function validate($value) {
        $len = mb_strlen($value, mb_detect_encoding($value));
        return (($this->min === null || $len >= $this->min) && ($this->max === null || $len <= $this->max));
    }

}
