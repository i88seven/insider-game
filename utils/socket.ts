import { io, Socket } from 'socket.io-client';
import { gameContentStore } from '~/store';
import { Player, Role } from '~/store/type';
import { DateTime } from 'luxon';

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

function decideSubject(): void {
  socket.emit('decide-subject', gameContentStore.storedRoomId, gameContentStore.storedSubject);
}

function onDecideSubject(): void {
  socket.on('decide-subject', (subject: string) => {
    gameContentStore.setSubject(subject);
  });
}

function startGame(): void {
  socket.emit(
    'start-game',
    gameContentStore.storedRoomId,
    gameContentStore.storedDiscussionTimeLimit
  );
}

async function onStartGame(routeAction: any): Promise<void> {
  socket.on('start-game', (discussionTimeLimit: string) => {
    gameContentStore.setDiscussionTimeLimit(DateTime.fromISO(discussionTimeLimit));
    routeAction();
  });
}

function correct(): void {
  socket.emit(
    'correct',
    gameContentStore.storedRoomId,
    gameContentStore.storedSubject,
    gameContentStore.storedSearchTimeLimit
  );
}

async function onCorrect(routeAction: any): Promise<void> {
  socket.on('correct', (subject: string, searchTimeLimit: string) => {
    gameContentStore.setSubject(subject);
    gameContentStore.setSearchTimeLimit(DateTime.fromISO(searchTimeLimit));
    routeAction();
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
};
