# Mind snake V3

It is a competitive snake game.

## Snake

At the start of a match, the snake has length of 5 and with speed of 6. Once the fruit is eaten by the snake, it grows by 1. Every 60 seconds the snake speed increases by 2, until it get to speed of 18 at with point speed will not increase any more. The snake has 3 abilities:

- Speed up - will speed up the snake by 5 for 5 seconds. Snake can use this ability 3 times.
- Slow down - will slow down the snake by 5 for 5 seconds. Snake can use this ability 2 times.
- Untouchable - makes the snake illusive for 5 seconds. In this period the snake can pass through objects and vice versa (this does not include map borders and fruit). The snake can use this ability only 1 time.

## Comet

At a random time interval, with a random position and a random angle, a comet will spawn outside the screen. It will fly over the map area leaving a trail. If the snake's head touches the trail it will die.

## Single player

Every user is able to play alone, score that users achieve at the end of the match is public and is displayed on loader board as well as on users profile.

## Multiplayer

2 players are in a duel on the same map. Winner is the player who survives longer. A player can invite someone to duel with or they can go into a match making queue.
