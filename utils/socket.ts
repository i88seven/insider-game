import { io, Socket } from 'socket.io-client';
import { gameContentStore } from '~/store';
import { Player, Role } from '~/store/type';

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

async function onDecideSubject(): Promise<void> {
  socket.on('decide-subject', (subject: string) => {
    gameContentStore.setSubject(subject);
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
};
