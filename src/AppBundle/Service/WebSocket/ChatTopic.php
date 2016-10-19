<?php

namespace AppBundle\Service\WebSocket;

use Gos\Bundle\WebSocketBundle\Client\ClientManipulatorInterface;
use Gos\Bundle\WebSocketBundle\Router\WampRequest;
use Gos\Bundle\WebSocketBundle\Topic\TopicInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Wamp\Topic;

class ChatTopic implements TopicInterface {

    protected $clientManipulator;

    /**
     * @param ClientManipulatorInterface $clientManipulator
     */
    public function __construct(ClientManipulatorInterface $clientManipulator) {
        $this->clientManipulator = $clientManipulator;
    }

    /**
     * This will receive any Subscription requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param Topic $topic
     * @param WampRequest $request
     * @return void
     */
    public function onSubscribe(ConnectionInterface $connection, Topic $topic, WampRequest $request) {
        //this will broadcast the message to ALL subscribers of this topic.
        //$topic->broadcast(['msg' => $connection->resourceId . " has joined " . $topic->getId()]);
        $user1 = $this->clientManipulator->findByUsername($topic, "royar13@gmail.com");
        var_dump($this->clientManipulator->getAll($topic));
        echo "MAYBE??";
        if (false !== $user1) {
            echo "yay YAY YAYA YAYAYAY!";
            $topic->broadcast('message', array(), array($user1['connection']->WAMP->sessionId));
        }
    }

    /**
     * This will receive any UnSubscription requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param Topic $topic
     * @param WampRequest $request
     * @return void
     */
    public function onUnSubscribe(ConnectionInterface $connection, Topic $topic, WampRequest $request) {
        //this will broadcast the message to ALL subscribers of this topic.
        $topic->broadcast(['msg' => $connection->resourceId . " has left " . $topic->getId()]);
    }

    /**
     * This will receive any Publish requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param Topic $topic
     * @param WampRequest $request
     * @param $event
     * @param array $exclude
     * @param array $eligible
     * @return mixed|void
     */
    public function onPublish(ConnectionInterface $connection, Topic $topic, WampRequest $request, $event, array $exclude, array $eligible) {
        /*
          $topic->getId() will contain the FULL requested uri, so you can proceed based on that

          if ($topic->getId() === 'acme/channel/shout')
          //shout something to all subs.
         */

        $topic->broadcast([
            'msg' => $event,
        ]);
    }

    /**
     * Like RPC is will use to prefix the channel
     * @return string
     */
    public function getName() {
        return 'chat.topic';
    }

}
