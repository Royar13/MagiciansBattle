<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\User;

class UserController extends Controller {

    /**
     * @Route("/api/account/register", name="user_registration")
     */
    public function registerAction(Request $request) {
        $user = new User();
        $user->setUsername($request->query->get("email"));
        $user->setDisplayname($request->query->get("displayName"));
        $user->setPlainPassword($request->query->get("password"));
        $password = $this->get('security.password_encoder')
                ->encodePassword($user, $user->getPlainPassword());
        $user->setPassword($password);

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();
    }

}
