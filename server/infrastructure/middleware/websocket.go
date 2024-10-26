package middleware

import (
	"github.com/gorilla/websocket"
	"github.com/jphacks/os_2403/domain/models"
	"strconv"
	"sync"
)

type WebSocketService struct {
	clients map[string]map[*websocket.Conn]bool
	mu      sync.RWMutex
}

func NewWebSocketService() *WebSocketService {
	return &WebSocketService{
		clients: make(map[string]map[*websocket.Conn]bool),
	}
}

func (s *WebSocketService) AddClient(roomID string, conn *websocket.Conn) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.clients[roomID]; !exists {
		s.clients[roomID] = make(map[*websocket.Conn]bool)
	}
	s.clients[roomID][conn] = true
}

func (s *WebSocketService) RemoveClient(roomID string, conn *websocket.Conn) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.clients[roomID]; exists {
		delete(s.clients[roomID], conn)
		if len(s.clients[roomID]) == 0 {
			delete(s.clients, roomID)
		}
	}
}

func (s *WebSocketService) BroadcastToRoom(roomID int, message *models.Message) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	roomIDStr := strconv.Itoa(roomID) // intをstringに変換

	if clients, exists := s.clients[roomIDStr]; exists {
		for client := range clients {
			err := client.WriteJSON(message)
			if err != nil {
				client.Close()
				delete(clients, client)
			}
		}
	}
}
