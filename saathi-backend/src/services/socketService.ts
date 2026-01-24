import { Server as SocketIOServer, Socket } from 'socket.io';
import { firebaseAuth } from '@/config/firebase';
import { logger, StructuredLogger } from '@/utils/logger';

export class SocketService {
  private io: SocketIOServer | null = null;
  private connectedUsers = new Map<string, { socketId: string, userId: string, lastActivity: Date }>();

  initialize(io: SocketIOServer) {
    this.io = io;
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    if (!this.io) return;

    // Authentication middleware for Socket.IO
    this.io.use(async (socket: Socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
          return next(new Error('Authentication required'));
        }

        const decodedToken = await firebaseAuth.verifyIdToken(token);
        const userRecord = await firebaseAuth.getUser(decodedToken.uid);
        
        (socket as any).user = {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified
        };

        next();
      } catch (error) {
        logger.error('Socket authentication failed:', error);
        next(new Error('Authentication failed'));
      }
    });

    this.io.on('connection', (socket: Socket) => {
      const user = (socket as any).user;
      
      if (user) {
        this.connectedUsers.set(user.uid, {
          socketId: socket.id,
          userId: user.uid,
          lastActivity: new Date()
        });

        StructuredLogger.logUserAction(user.uid, 'socket_connected', {
          socketId: socket.id
        });

        logger.info(`User ${user.uid} connected via Socket.IO`);
      }

      // Handle chat events
      socket.on('join_chat_session', (sessionId: string) => {
        socket.join(`chat_${sessionId}`);
        StructuredLogger.logUserAction(user?.uid, 'joined_chat_session', { sessionId });
      });

      socket.on('leave_chat_session', (sessionId: string) => {
        socket.leave(`chat_${sessionId}`);
        StructuredLogger.logUserAction(user?.uid, 'left_chat_session', { sessionId });
      });

      // Handle voice session events
      socket.on('join_voice_session', (sessionId: string) => {
        socket.join(`voice_${sessionId}`);
        StructuredLogger.logUserAction(user?.uid, 'joined_voice_session', { sessionId });
      });

      socket.on('voice_chunk', (data: { sessionId: string, audioChunk: Buffer }) => {
        // Broadcast to voice processing service
        socket.to(`voice_${data.sessionId}`).emit('voice_chunk_received', data);
      });

      // Handle mood tracking events
      socket.on('mood_update', (moodData: any) => {
        this.broadcastToTherapists('mood_update', {
          userId: user?.uid,
          moodData,
          timestamp: new Date()
        });
        StructuredLogger.logMoodEntry(user?.uid, moodData);
      });

      // Handle crisis events
      socket.on('crisis_alert', (crisisData: any) => {
        this.handleCrisisAlert(user?.uid, crisisData, socket);
      });

      // Handle typing indicators
      socket.on('typing_start', (sessionId: string) => {
        socket.to(`chat_${sessionId}`).emit('user_typing', {
          userId: user?.uid,
          displayName: user?.displayName
        });
      });

      socket.on('typing_stop', (sessionId: string) => {
        socket.to(`chat_${sessionId}`).emit('user_stopped_typing', {
          userId: user?.uid
        });
      });

      // Handle presence updates
      socket.on('update_presence', (status: 'online' | 'away' | 'busy') => {
        if (user) {
          const userConnection = this.connectedUsers.get(user.uid);
          if (userConnection) {
            userConnection.lastActivity = new Date();
          }
          
          this.broadcastPresenceUpdate(user.uid, status);
        }
      });

      // Handle disconnect
      socket.on('disconnect', (reason) => {
        if (user) {
          this.connectedUsers.delete(user.uid);
          this.broadcastPresenceUpdate(user.uid, 'offline');
          
          StructuredLogger.logUserAction(user.uid, 'socket_disconnected', {
            reason,
            socketId: socket.id
          });
          
          logger.info(`User ${user.uid} disconnected: ${reason}`);
        }
      });

      // Handle errors
      socket.on('error', (error) => {
        logger.error('Socket error:', error);
        if (user) {
          StructuredLogger.logError(error, {
            userId: user.uid,
            socketId: socket.id,
            type: 'socket_error'
          });
        }
      });
    });
  }

  // Send message to specific user
  sendToUser(userId: string, event: string, data: any) {
    const userConnection = this.connectedUsers.get(userId);
    if (userConnection && this.io) {
      this.io.to(userConnection.socketId).emit(event, data);
      return true;
    }
    return false;
  }

  // Send message to chat session
  sendToChatSession(sessionId: string, event: string, data: any) {
    if (this.io) {
      this.io.to(`chat_${sessionId}`).emit(event, data);
    }
  }

  // Send message to voice session
  sendToVoiceSession(sessionId: string, event: string, data: any) {
    if (this.io) {
      this.io.to(`voice_${sessionId}`).emit(event, data);
    }
  }

  // Broadcast to all connected users
  broadcast(event: string, data: any) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  // Broadcast to therapists only
  broadcastToTherapists(event: string, data: any) {
    if (this.io) {
      // This would need to be implemented based on user roles
      // For now, we'll use a therapist room
      this.io.to('therapists').emit(event, data);
    }
  }

  // Handle crisis alerts
  private async handleCrisisAlert(userId: string, crisisData: any, socket: Socket) {
    try {
      StructuredLogger.logCrisisEvent(userId, crisisData.severity, crisisData);
      
      // Send immediate response to user
      socket.emit('crisis_response', {
        message: 'Help is on the way. Please stay safe.',
        resources: {
          suicide: '988',
          crisis: '1-800-273-8255',
          emergency: '911'
        },
        timestamp: new Date()
      });

      // Alert therapists and support staff
      this.broadcastToTherapists('crisis_alert', {
        userId,
        severity: crisisData.severity,
        location: crisisData.location,
        message: crisisData.message,
        timestamp: new Date(),
        priority: 'URGENT'
      });

      // Alert admins for critical situations
      if (crisisData.severity === 'critical') {
        this.io?.to('admins').emit('critical_crisis_alert', {
          userId,
          crisisData,
          timestamp: new Date()
        });
      }

      logger.warn(`Crisis alert from user ${userId}:`, crisisData);
    } catch (error) {
      logger.error('Error handling crisis alert:', error);
      socket.emit('crisis_error', {
        message: 'Unable to process crisis alert. Please call emergency services immediately.',
        emergency: '911'
      });
    }
  }

  // Broadcast presence updates
  private broadcastPresenceUpdate(userId: string, status: string) {
    if (this.io) {
      this.io.emit('presence_update', {
        userId,
        status,
        timestamp: new Date()
      });
    }
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Get user's connection status
  isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // Get all connected users
  getConnectedUsers(): Array<{ userId: string, socketId: string, lastActivity: Date }> {
    return Array.from(this.connectedUsers.values());
  }

  // Send notification to user
  sendNotification(userId: string, notification: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    data?: any;
  }) {
    return this.sendToUser(userId, 'notification', {
      ...notification,
      timestamp: new Date()
    });
  }

  // Send typing indicator
  sendTypingIndicator(sessionId: string, userId: string, isTyping: boolean) {
    if (this.io) {
      this.io.to(`chat_${sessionId}`).emit('typing_indicator', {
        userId,
        isTyping,
        timestamp: new Date()
      });
    }
  }

  // Send mood update notification
  sendMoodUpdateNotification(userId: string, moodData: any) {
    this.sendNotification(userId, {
      title: 'Mood Recorded',
      message: `Your ${moodData.mood} mood has been recorded and analyzed.`,
      type: 'info',
      data: { moodData }
    });
  }

  // Send progress update
  sendProgressUpdate(userId: string, progressData: any) {
    this.sendNotification(userId, {
      title: 'Progress Update',
      message: 'Your wellness progress has been updated.',
      type: 'success',
      data: { progressData }
    });
  }

  // Send wellness reminder
  sendWellnessReminder(userId: string, reminder: any) {
    this.sendNotification(userId, {
      title: 'Wellness Reminder',
      message: reminder.message,
      type: 'info',
      data: { reminder }
    });
  }

  // Clean up inactive connections
  cleanupInactiveConnections(maxInactiveMinutes: number = 60) {
    const cutoffTime = new Date(Date.now() - maxInactiveMinutes * 60 * 1000);
    
    for (const [userId, connection] of this.connectedUsers.entries()) {
      if (connection.lastActivity < cutoffTime) {
        this.connectedUsers.delete(userId);
        logger.info(`Cleaned up inactive connection for user ${userId}`);
      }
    }
  }
}

// Export singleton instance
export const socketService = new SocketService();

export default socketService;