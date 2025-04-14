"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceiverSocketId = exports.initializeSocket = exports.io = void 0;
const socket_io_1 = require("socket.io");
const Notifications_1 = __importDefault(require("../models/Notifications"));
const userSocketMap = {};
const pendingGameRequests = {};
let playingArray = [];
let twoTruthsGames = [];
const initializeSocket = (server) => {
    exports.io = new socket_io_1.Server(server, {
        cors: {
            origin: ["http://localhost:3001"],
            methods: ["GET", "POST"],
        },
    });
    exports.io.on("connection", (socket) => {
        console.log("A user connected", socket.id);
        const userId = socket.handshake.query.userId;
        if (userId && userId !== "undefined") {
            userSocketMap[userId] = socket.id;
        }
        exports.io.emit("getOnlineUsers", Object.keys(userSocketMap));
        socket.on("markMessageRead", ({ messageId, senderId, readerId }) => {
            const senderSocketId = userSocketMap[senderId];
            if (senderSocketId) {
                exports.io.to(senderSocketId).emit("messageRead", {
                    messageId,
                    readerId
                });
            }
        });
        socket.on("sendMessage", ({ receiverId, message }) => {
            const receiverSocketId = userSocketMap[receiverId];
            if (receiverSocketId) {
                exports.io.to(receiverSocketId).emit("receiveMessage", {
                    senderId: userId,
                    receiverId: receiverId,
                    message,
                    createdAt: new Date().toISOString(),
                });
            }
        });
        // Handle user blocking
        socket.on("userBlocked", ({ blockedUserId, blockedByUserId }) => {
            console.log(blockedByUserId);
            const blockedUserSocketId = userSocketMap[blockedUserId];
            if (blockedUserSocketId) {
                exports.io.to(blockedUserSocketId).emit("userWasBlocked", { blockedUserId });
            }
        });
        // Handle user unblocking
        socket.on("userUnblocked", ({ unblockedUserId, unblockedByUserId }) => {
            const unblockedUserSocketId = userSocketMap[unblockedUserId];
            if (unblockedUserSocketId) {
                exports.io.to(unblockedUserSocketId).emit("userWasUnblocked", { unblockedByUserId });
            }
        });
        //Notification
        socket.on("notificationForLike", (_a) => __awaiter(void 0, [_a], void 0, function* ({ likedUserId, name }) {
            const receiverSocketId = userSocketMap[likedUserId];
            const notification = {
                userId: likedUserId,
                type: "like",
                message: `${name} liked your profile.`,
            };
            yield Notifications_1.default.create(notification);
            if (receiverSocketId) {
                exports.io.to(receiverSocketId).emit("OneUserLiked", { likedUserId, name });
            }
        }));
        socket.on("notifyForMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, receivedUserId }) {
            const receiverSocketId = userSocketMap[receivedUserId];
            const notification = {
                userId: receivedUserId,
                type: "message",
                message: `${name} sent a message:`,
            };
            yield Notifications_1.default.create(notification);
            if (receiverSocketId) {
                exports.io.to(receiverSocketId).emit("OneMessage", { receivedUserId, name });
            }
        }));
        socket.on("notifyForMatch", (_a) => __awaiter(void 0, [_a], void 0, function* ({ user1Id, user2Id }) {
            [user1Id, user2Id].forEach((userID) => __awaiter(void 0, void 0, void 0, function* () {
                const receiverSocketId = userSocketMap[userID];
                const notification = {
                    userID,
                    type: "match",
                    message: `"You have a new match!"`,
                };
                yield Notifications_1.default.create(notification);
                if (receiverSocketId) {
                    exports.io.to(receiverSocketId).emit("OneMatch", { userID });
                }
            }));
        }));
        socket.on("call-user", ({ to, offer, from }) => {
            const receiverSocketId = userSocketMap[to];
            if (receiverSocketId) {
                exports.io.to(receiverSocketId).emit("incoming-call", {
                    offer,
                    from
                });
            }
        });
        socket.on("call-accepted", ({ to, answer, from }) => {
            const receiverSocketId = userSocketMap[to];
            if (receiverSocketId) {
                exports.io.to(receiverSocketId).emit("call-accepted", {
                    answer,
                    from
                });
            }
        });
        socket.on("call-rejected", ({ to }) => {
            const receiverSocketId = userSocketMap[to];
            if (receiverSocketId) {
                exports.io.to(receiverSocketId).emit("call-rejected");
            }
        });
        socket.on("ice-candidate", ({ to, candidate }) => {
            const receiverSocketId = userSocketMap[to];
            if (receiverSocketId) {
                exports.io.to(receiverSocketId).emit("ice-candidate", {
                    candidate,
                    from: socket.handshake.query.userId
                });
            }
        });
        socket.on("end-call", ({ to }) => {
            const receiverSocketId = userSocketMap[to];
            if (receiverSocketId) {
                exports.io.to(receiverSocketId).emit("call-ended");
            }
        });
        // Tic-Tac-Toe
        socket.on("findByIds", (request) => {
            console.log("Game request received:", request);
            if (!userSocketMap[request.opponentId]) {
                socket.emit("matchError", { message: "Opponent is not online" });
                return;
            }
            const pendingRequest = pendingGameRequests[request.playerId];
            if (pendingRequest && pendingRequest.playerId === request.opponentId) {
                console.log("Match found between", request.playerId, "and", request.opponentId);
                if (request.gameType === "twoTruths" || pendingRequest.gameType === "twoTruths") {
                    const newGame = {
                        player1: {
                            id: pendingRequest.playerId,
                            name: pendingRequest.playerName,
                            statements: [],
                            lieIndex: null
                        },
                        player2: {
                            id: request.playerId,
                            name: request.playerName,
                            statements: [],
                            lieIndex: null
                        },
                        currentTurn: pendingRequest.playerId,
                        gameState: 'waiting',
                        round: 1,
                        scores: {
                            [pendingRequest.playerId]: 0,
                            [request.playerId]: 0
                        }
                    };
                    twoTruthsGames.push(newGame);
                    delete pendingGameRequests[request.playerId];
                    exports.io.emit("twoTruthsGameMatched", { allGames: twoTruthsGames });
                }
                else {
                    // Default to Tic-Tac-Toe
                    // Create player objects
                    const p1obj = {
                        p1id: pendingRequest.playerId,
                        p1name: pendingRequest.playerName,
                        p1value: "X",
                        p1move: [],
                    };
                    const p2obj = {
                        p2id: request.playerId,
                        p2name: request.playerName,
                        p2value: "O",
                        p2move: [],
                    };
                    const gameObj = {
                        p1: p1obj,
                        p2: p2obj,
                        sum: 0,
                        board: Array(9).fill(""),
                    };
                    playingArray.push(gameObj);
                    delete pendingGameRequests[request.playerId];
                    exports.io.emit("gameMatched", { allPlayers: playingArray });
                }
            }
            else {
                pendingGameRequests[request.opponentId] = request;
                console.log("Game request stored for", request.opponentId);
                const opponentSocketId = userSocketMap[request.opponentId];
                if (opponentSocketId) {
                    exports.io.to(opponentSocketId).emit("gameRequest", {
                        requesterId: request.playerId,
                        requesterName: request.playerName,
                        gameType: request.gameType
                    });
                }
            }
        });
        // Two Truths & A Lie game handlers
        socket.on("submitStatements", ({ playerId, statements, lieIndex }) => {
            const game = twoTruthsGames.find(game => game.player1.id === playerId || game.player2.id === playerId);
            if (game) {
                if (game.player1.id === playerId) {
                    game.player1.statements = statements;
                    game.player1.lieIndex = lieIndex;
                }
                else {
                    game.player2.statements = statements;
                    game.player2.lieIndex = lieIndex;
                }
                if (game.player1.statements.length > 0 && game.player2.statements.length > 0) {
                    game.gameState = 'statements_submitted';
                    game.currentTurn = game.player2.id;
                    game.gameState = 'guessing';
                }
                exports.io.emit("twoTruthsGameUpdated", { allGames: twoTruthsGames });
            }
        });
        socket.on("makeGuess", ({ playerId, guessIndex }) => {
            const game = twoTruthsGames.find(game => game.player1.id === playerId || game.player2.id === playerId);
            if (game && game.gameState === 'guessing') {
                let isCorrect = false;
                let lieIndex = -1;
                if (game.currentTurn === game.player1.id) {
                    isCorrect = guessIndex === game.player2.lieIndex;
                    lieIndex = game.player2.lieIndex;
                    if (isCorrect) {
                        game.scores[game.player1.id]++;
                    }
                    if (game.round === 1) {
                        game.round = 2;
                        game.gameState = 'waiting';
                        game.player1.statements = [];
                        game.player2.statements = [];
                        game.player1.lieIndex = null;
                        game.player2.lieIndex = null;
                    }
                    else {
                        game.gameState = 'completed';
                    }
                }
                else {
                    isCorrect = guessIndex === game.player1.lieIndex;
                    lieIndex = game.player1.lieIndex;
                    if (isCorrect) {
                        game.scores[game.player2.id]++;
                    }
                    game.currentTurn = game.player1.id;
                }
                exports.io.emit("guessResult", {
                    gameId: twoTruthsGames.indexOf(game),
                    playerId,
                    isCorrect,
                    lieIndex
                });
                exports.io.emit("twoTruthsGameUpdated", { allGames: twoTruthsGames });
            }
        });
        socket.on("resetTwoTruthsGame", ({ playerId }) => {
            twoTruthsGames = twoTruthsGames.filter(game => game.player1.id !== playerId && game.player2.id !== playerId);
            exports.io.emit("twoTruthsGameUpdated", { allGames: twoTruthsGames });
        });
        socket.on("playing", (e) => {
            const objToCheck = playingArray.find((obj) => obj.p1.p1id === e.playerId || obj.p2.p2id === e.playerId);
            if (objToCheck) {
                const index = parseInt(e.id.replace("btn", "")) - 1;
                if (objToCheck.board[index] === "") {
                    objToCheck.board[index] = e.value;
                    objToCheck.sum++;
                }
                const winConditions = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8],
                    [0, 3, 6], [1, 4, 7], [2, 5, 8],
                    [0, 4, 8], [2, 4, 6],
                ];
                let winner = null;
                for (const [a, b, c] of winConditions) {
                    if (objToCheck.board[a] &&
                        objToCheck.board[a] === objToCheck.board[b] &&
                        objToCheck.board[a] === objToCheck.board[c]) {
                        winner = objToCheck.board[a];
                        break;
                    }
                }
                if (winner) {
                    const winnerName = winner === "X" ? objToCheck.p1.p1name : objToCheck.p2.p2name;
                    exports.io.emit("gameOver", {
                        winner: winnerName,
                        reason: "win",
                    });
                    playingArray = playingArray.filter((obj) => obj !== objToCheck);
                }
                else if (objToCheck.sum === 9) {
                    exports.io.emit("gameOver", {
                        winner: null,
                        reason: "draw",
                    });
                    playingArray = playingArray.filter((obj) => obj !== objToCheck);
                }
                else {
                    exports.io.emit("playing", { allPlayers: playingArray });
                }
            }
        });
        socket.on("resetGame", (e) => {
            playingArray = playingArray.filter((obj) => obj.p1.p1id !== e.playerId && obj.p2.p2id !== e.playerId);
            exports.io.emit("playing", { allPlayers: playingArray });
        });
        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
            if (userId) {
                delete pendingGameRequests[userId];
                delete userSocketMap[userId];
            }
            exports.io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });
};
exports.initializeSocket = initializeSocket;
const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};
exports.getReceiverSocketId = getReceiverSocketId;
