<?php

namespace AppBundle\Controller;

use AppBundle\Entity\User\User;
use AppBundle\Entity\User\UserService;
use AppBundle\Entity\Validation\ValidationResult;
use Doctrine\Common\Annotations\AnnotationReader;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;

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

    /**
     * @Route("/api/account/login", name="user_login")
     */
    public function loginAction(Request $request) {
        $authenticationUtils = $this->get('security.authentication_utils');
    }

    /**
     * @Route("/api/account/fetchUser", name="fetch_user")
     */
    public function fetchUserAction() {
        $output = array();
        if ($this->isGranted('ROLE_USER')) {
            $output["success"] = true;
            $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
            $normalizer = new ObjectNormalizer($classMetadataFactory);
            $serializer = new Serializer(array($normalizer));
            $output["user"] = $serializer->normalize($this->getUser(), null, array('groups' => array('group1')));
        } else {
            $output["success"] = false;
        }
        $response = new JsonResponse();
        $response->setData($output);
        return $response;
    }

}
