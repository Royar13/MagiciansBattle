<?php

namespace AppBundle\Service;

use Doctrine\ORM\EntityManager;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class UserRepository extends Repository implements UserProviderInterface {

    public function __construct(EntityManager $em) {
        parent::__construct($em, "AppBundle\Entity\User\User");
    }

    public function getByEmail($email) {
        $query = $this->createQueryBuilder("u")
                ->where("u.email=:email")
                ->setParameter("email", $email)
                ->getQuery();
        return $query->getResult();
    }

    public function getByDisplayName($displayName) {
        $query = $this->createQueryBuilder("u")
                ->where("u.displayName=:displayName")
                ->setParameter("displayName", $displayName)
                ->getQuery();
        return $query->getResult();
    }

    public function loadUserByUsername($username) {
        $user = $this->getByEmail($username);

        if (count($user) === 1) {
            return $user[0];
        }

        throw new UsernameNotFoundException(sprintf('Username "%s" does not exist.', $username));
    }

    public function refreshUser(UserInterface $user) {
        return $this->loadUserByUsername($user->getUsername());
    }

    public function supportsClass($class) {
        return $class === "AppBundle\Entity\User\User";
    }

}
