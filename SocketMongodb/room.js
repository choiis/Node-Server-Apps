/**
 * http://usejsdoc.org/
 */

var roomMap = {};

var getRoomList = function() {
	
	var roomList = [];
	
	Object.keys(roomMap).forEach(function(key) {
		var str = "";
		str += key;
		str += " : ";
		str += roomMap[key].length;
		str += "명";
		roomList.push(str);
	});
	
	return roomList;
};

var logic = function(io, socket) {
	
	// 방 제어
	socket.on('room', function(packet) {
		var direction = packet.direction;
		
		var packetToClient = {};
		
		if(direction === "makeRoom") {
			if(io.sockets.adapter.rooms[packet.roomname]) {
				packetToClient.direction = "roomStatus";
				packetToClient.msg = "roomExist";
				
				socket.emit('room' , packetToClient);
			} else {
				socket.join(packet.roomname);
				var nowRoom = io.sockets.adapter.rooms[packet.roomname];
				packetToClient.direction = "roomEnter";
				packetToClient.roomname = packet.roomname;

				socket.emit('room' , packetToClient);
				
				roomMap[packet.roomname] = [];
				roomMap[packet.roomname].push(packet.roomMember);
				
				var packetToClient2 = {
					direction : "roomList",
					list : getRoomList()
				};
				io.sockets.in(packet.roomname).emit('room', packetToClient2);
			}
		} else if (direction === "enterRoom") {
			if(io.sockets.adapter.rooms[packet.roomname]) {
				socket.join(packet.roomname);
				packetToClient.direction = "roomEnter";
				packetToClient.roomname = packet.roomname;
				console.log('enterRoom');
				console.dir(packetToClient);
				socket.emit('room' , packetToClient);
				
				roomMap[packet.roomname].push(packet.roomMember);
				
				var packetToClient3 = {
					direction : "roomList",
					list : getRoomList()
				};
				io.sockets.emit('room', packetToClient3);
				
				var msg = packet.roomMember + " 님이 입장하셨습니다";
				io.sockets.in(packet.roomname).emit('message', msg);
			} else {
				packetToClient.direction = "roomStatus";
				packetToClient.msg = "roomNotExist";
				
				socket.emit('room' , packetToClient);
			}
		} else if (direction === "leaveRoom") {
			socket.leave(packet.roomname);
			
			for(var i = roomMap[packet.roomname].length - 1; i >= 0; i--) {
			    if(roomMap[packet.roomname][i] === packet.roomMember) {
			    	roomMap[packet.roomname].splice(i, 1);
			    }
			}
			
			if(roomMap[packet.roomname].length === 0) {
				delete roomMap[packet.roomname];
			}
			
			var packetToClient4 = {
				direction : "roomList",
				list : getRoomList()
			};
			socket.emit('room' , packetToClient4);
			
			var msg2 = packet.roomMember + " 님이 나갔습니다";
			io.sockets.in(packet.roomname).emit('message', msg2);
		} else if (direction === "roomInfo") {
			var packetToClient5 = {
				direction : "roomList",
				list : getRoomList()
			};
			socket.emit('room' , packetToClient5);
		}
	});
	
	socket.on('chat', function(packet) {
		var msg = packet.nickname + ":" + packet.message;
		io.sockets.in(packet.roomname).emit('message', msg);
	});
};
module.exports.logic = logic;