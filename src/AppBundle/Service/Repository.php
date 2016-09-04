<?php

namespace AppBundle\Service;

use Doctrine\ORM\EntityManager;

abstract class Repository {

    protected $em;
    protected $entityName;

    public function __construct(EntityManager $em, $entityName) {
        $this->em = $em;
        $this->entityName = $entityName;
    }

    public function add($entity) {
        $this->em->persist($entity);
        $this->em->flush();
    }

    public function remove($entity) {
        $this->em->remove($entity);
        $this->em->flush();
    }

    public function get($id) {
        return $this->em->find($this->entityName, $id);
    }

    protected function createQueryBuilder($alias) {
        return $this->em->createQueryBuilder()
                        ->select($alias)
                        ->from($this->entityName, $alias);
    }

}
