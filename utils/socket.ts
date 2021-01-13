import { io, Socket } from 'socket.io-client';
import { gameContentStore } from '~/store';
import { Player, Role } from '~/store/type';
import { DateTime } from 'luxon';

type GameRoutes = 'main' | 'role-action' | 'count-down' | 'vote' | 'game-result' | 'failure-result';

let socket: Socket;

function initSocket(): void {
  socket = io(process.env.API_URL || '', {
    transports: ['websocket', 'polling', 'flashsocket'],
  });
}

function joinRoom(): void {
  socket.emit(
    'join-room',
    gameContentStore.storedRoomId,
    gameContentStore.myId,
    gameContentStore.me?.name || ''
  );
}

function onJoinRoom(): void {
  socket.on('join-room', (player: Player) => {
    gameContentStore.addPlayer({
      id: player.id,
      name: player.name,
    });
    socket.emit('broadcast-players', gameContentStore.storedRoomId, gameContentStore.storedPlayers);
  });
}

function onBloadcastPlayers(): void {
  socket.on('broadcast-players', (players: Player[]) => {
    gameContentStore.setPlayers(players);
  });
}

function decideRoles(): void {
  socket.emit('decide-roles', gameContentStore.storedRoomId, gameContentStore.storedRoles);
}

async function onDecideRoles(routeAction: any): Promise<void> {
  socket.on('decide-roles', (roles: { [key: string]: Role }) => {
    gameContentStore.setRoles(roles);
    routeAction();
  });
}

function decideSubject(subject: string): void {
  if (gameContentStore.isHost) {
    gameContentStore.setSubject(subject);
  }
  socket.emit('decide-subject', gameContentStore.storedRoomId, subject, gameContentStore.isHost);
}

function onDecideSubject(): void {
  socket.on('decide-subject', (subject: string, fromHost: boolean) => {
    if (!fromHost && !gameContentStore.isHost) {
      return;
    }
    if (gameContentStore.isHost) {
      decideSubject(subject);
    }
    gameContentStore.setSubject(subject);
  });
}

function startGame(): void {
  if (gameContentStore.isHost) {
    gameContentStore.generateDiscussionTimeLimit();
  }
  socket.emit(
    'start-game',
    gameContentStore.storedRoomId,
    gameContentStore.storedDiscussionTimeLimit,
    gameContentStore.isHost
  );
}

async function onStartGame(routeAction: any): Promise<void> {
  socket.on('start-game', (discussionTimeLimit: string, fromHost: boolean) => {
    if (!fromHost && !gameContentStore.isHost) {
      return;
    }
    if (gameContentStore.isHost) {
      startGame();
    } else {
      gameContentStore.setDiscussionTimeLimit(DateTime.fromISO(discussionTimeLimit));
    }
    routeAction();
  });
}

function correct(): void {
  if (gameContentStore.isHost) {
    gameContentStore.generateSearchTimeLimit();
  }
  socket.emit(
    'correct',
    gameContentStore.storedRoomId,
    gameContentStore.storedSubject,
    gameContentStore.storedSearchTimeLimit,
    gameContentStore.isHost
  );
}

async function onCorrect(routeAction: any): Promise<void> {
  socket.on('correct', (subject: string, searchTimeLimit: string, fromHost: boolean) => {
    if (!fromHost && !gameContentStore.isHost) {
      return;
    }
    if (gameContentStore.isHost) {
      correct();
    } else {
      gameContentStore.setSearchTimeLimit(DateTime.fromISO(searchTimeLimit));
    }
    gameContentStore.setSubject(subject);
    routeAction();
  });
}

function vote(toId: string): void {
  socket.emit('vote', gameContentStore.storedRoomId, gameContentStore.storedMyId, toId);
}

function onVote(routeAction: any): void {
  socket.on('vote', (fromId: string, toId: string) => {
    gameContentStore.setVote({ fromId, toId });
    socket.emit('vote-result', gameContentStore.storedRoomId, gameContentStore.votes);
    if (gameContentStore.votesLength === gameContentStore.players.length) {
      routeAction();
    }
  });
}

function voteResult(): void {
  socket.emit('vote-result', gameContentStore.storedRoomId, gameContentStore.votes);
}

function onVoteResult(routeAction: any): void {
  socket.on('vote-result', (votes: { [key: string]: string }) => {
    gameContentStore.setVotes(votes);
    if (gameContentStore.votesLength === gameContentStore.players.length) {
      routeAction();
    }
  });
}

function nextGame(memberChange: boolean): void {
  socket.emit(
    'next-game',
    gameContentStore.storedRoomId,
    memberChange,
    gameContentStore.storedRoles
  );
}

async function onNextGame(routeAction: any): Promise<void> {
  socket.on('next-game', (memberChange: boolean, roles: { [key: string]: Role }) => {
    gameContentStore.initGameContent();
    if (!memberChange) {
      gameContentStore.setRoles(roles);
    }
    routeAction(memberChange);
  });
}

interface ReloadResponse {
  route: GameRoutes;
  players: Player[];
  roles: { [key: string]: Role };
  subject: string;
  discussionTimeLimit: string;
  searchTimeLimit: string;
  votes: { [key: string]: string };
}

function reload(): void {
  socket.emit('reload', gameContentStore.storedRoomId, gameContentStore.myId);
}

function onReload(): void {
  if (!socket) {
    return;
  }
  socket.on('reload', (fromId: string) => {
    const gameRoute = getGameRoute(location.pathname);
    function getGameRoute(pathname: string): GameRoutes {
      const route = pathname.substring(1);
      if (
        'main' === route ||
        'role-action' === route ||
        'count-down' === route ||
        'vote' === route ||
        'game-result' === route ||
        'failure-result' === route
      ) {
        return route;
      }
      return 'main';
    }
    const states: ReloadResponse = {
      route: gameRoute,
      players: gameContentStore.storedPlayers,
      roles: gameContentStore.storedRoles,
      subject: gameContentStore.storedSubject,
      discussionTimeLimit: gameContentStore.storedDiscussionTimeLimit
        ? gameContentStore.storedDiscussionTimeLimit.toString()
        : '',
      searchTimeLimit: gameContentStore.storedSearchTimeLimit
        ? gameContentStore.storedSearchTimeLimit.toString()
        : '',
      votes: gameContentStore.storedVotes,
    };
    socket.emit('reload-response', gameContentStore.storedRoomId, fromId, states);
  });
}

function onReloadResponse(routeAction: any): void {
  if (!socket) {
    return;
  }
  socket.on('reload-response', (toId: string, response: ReloadResponse) => {
    if (gameContentStore.myId !== toId) {
      return;
    }
    const route = response.route;
    gameContentStore.initGameContent();
    gameContentStore.setPlayers(response.players);
    if (route !== 'main') {
      gameContentStore.setRoles(response.roles);
      gameContentStore.setSubject(response.subject);
    }
    if (route === 'count-down') {
      gameContentStore.setDiscussionTimeLimit(DateTime.fromISO(response.discussionTimeLimit));
    }
    if (route === 'vote') {
      gameContentStore.setSearchTimeLimit(DateTime.fromISO(response.searchTimeLimit));
    }
    if (route === 'game-result') {
      gameContentStore.setVotes(response.votes);
    }
    routeAction(route);
  });
}

export {
  initSocket,
  joinRoom,
  onJoinRoom,
  onBloadcastPlayers,
  decideRoles,
  onDecideRoles,
  decideSubject,
  onDecideSubject,
  startGame,
  onStartGame,
  correct,
  onCorrect,
  vote,
  onVote,
  voteResult,
  onVoteResult,
  nextGame,
  onNextGame,
  reload,
  onReload,
  onReloadResponse,
};
