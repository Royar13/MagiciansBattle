<?php

namespace AppBundle\Service;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class AuthenticationHandler implements AuthenticationSuccessHandlerInterface, AuthenticationFailureHandlerInterface {

    public function onAuthenticationSuccess(Request $request, TokenInterface $token) {
        $response = new JsonResponse();
        $response->setData(array("success" => true));
        return $response;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception) {
        $response = new JsonResponse();
        $response->setData(array("success" => false));
        return $response;
    }

}
