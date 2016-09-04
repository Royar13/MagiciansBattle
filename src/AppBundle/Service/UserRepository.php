<?php

namespace AppBundle\Service;

use Doctrine\ORM\EntityManager;

class UserRepository extends Repository {

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

}
