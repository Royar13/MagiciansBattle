<?php

namespace AppBundle\Entity\User;

use AppBundle\Service\UserRepository;
use AppBundle\Entity\Validation\ValidationResult;
use AppBundle\Entity\User\User;
use AppBundle\Entity\Validation\Validator;
use AppBundle\Entity\Validation\EmailRule;
use AppBundle\Entity\Validation\LengthRule;
use AppBundle\Entity\Validation\PasswordConfirmRule;
use AppBundle\Entity\Validation\DisplayNameRule;

class UserService {

    private $userRepository;

    public function __construct($em) {
        $this->userRepository = new UserRepository($em);
    }

    public function createUser(User $user, $passwordConfirm, ValidationResult $validationResult = null) {
        $validator = new Validator($validationResult);
        $validator->rule(new EmailRule())->validate("email", $user->getEmail());
        $validator->rule(new LengthRule(3, 18))->withName("The display name")->rule(new DisplayNameRule())->validate("displayName", $user->getDisplayName());
        $validator->rule(new LengthRule(6, 30))->validate("password", $user->getPlainPassword());
        $validator->rule(new PasswordConfirmRule($user->getPlainPassword()))->validate("passwordConfirm", $passwordConfirm);

        $res = $validator->getResult();
        $this->validateEmailIsntTaken($user->getEmail(), $res);
        $this->validateDisplayNameIsntTaken($user->getDisplayName(), $res);

        if ($res->isValid()) {
            $user->eraseCredentials();
            $this->userRepository->add($user);
        }
    }

    public function validateEmailIsntTaken($email, ValidationResult $validationResult) {
        $userList = $this->userRepository->getByEmail($email);
        if (count($userList) !== 0) {
            $validationResult->addError("email", "This email address is already taken");
        }
    }

    public function validateDisplayNameIsntTaken($displayName, ValidationResult $validationResult) {
        $userList = $this->userRepository->getByDisplayName($displayName);
        if (count($userList) !== 0) {
            $validationResult->addError("displayName", "This display name is already taken");
        }
    }

}
