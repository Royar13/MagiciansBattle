<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\User\User;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Entity\User\UserService;
use AppBundle\Entity\Validation\ValidationResult;

class UserController extends Controller {

    private $userService;

    private function getUserService() {
        if ($this->userService === null) {
            $this->userService = new UserService($this->getDoctrine()->getManager());
        }
        return $this->userService;
    }

    /**
     * @Route("/api/account/register", name="user_registration")
     */
    public function registerAction(Request $request) {

        $user = new User();
        $user->setEmail($request->request->get("email"));
        $user->setDisplayname($request->request->get("displayName"));
        $user->setPlainPassword($request->request->get("password"));
        $password = $this->get('security.password_encoder')
                ->encodePassword($user, $user->getPlainPassword());
        $user->setPassword($password);
        $validationResult = new ValidationResult();
        $this->getUserService()->createUser($user, $request->request->get("passwordConfirm"), $validationResult);

        $response = new JsonResponse();
        $response->setData($validationResult->getOutput());
        return $response;
    }

}
