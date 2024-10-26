package handlers

import (
	"encoding/json"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/usecase"
	"net/http"
)

type ScoutHandler struct {
	scoutUsecase usecase.IScoutListUsecase
}

func NewScoutHandler(usecase usecase.IScoutListUsecase) *ScoutHandler {
	return &ScoutHandler{
		scoutUsecase: usecase,
	}
}

type createScoutRequest struct {
	User_UUID      string `json:"user_uuid"`
	Community_UUID string `json:"community_uuid"`
}

type changeStatusRequest struct {
	User_UUID string `json:"user_uuid"`
	Status    uint   `json:"status"`
}

func (h *ScoutHandler) GetScout(w http.ResponseWriter, r *http.Request) {
	userUUIDStr := r.URL.Query().Get("user_uuid")
	userUUID, err := uuid.Parse(userUUIDStr)
	if err != nil {
		http.Error(w, "Invalid UUID format", http.StatusBadRequest)
		return
	}

	scouts, err := h.scoutUsecase.Get(r.Context(), userUUID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(scouts)
}

func (h *ScoutHandler) CreateScout(w http.ResponseWriter, r *http.Request) {
	var req createScoutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	userUUID, err := uuid.Parse(req.User_UUID)
	if err != nil {
		http.Error(w, "Invalid user UUID format", http.StatusBadRequest)
		return
	}

	communityUUID, err := uuid.Parse(req.Community_UUID)
	if err != nil {
		http.Error(w, "Invalid community UUID format", http.StatusBadRequest)
		return
	}

	scoutDetail := &models.ScoutDetailList{
		User_UUID:      userUUID,
		Status:         0, // 最初は未読(0)で登録
		Community_UUID: communityUUID,
	}

	if err := h.scoutUsecase.Create(r.Context(), scoutDetail); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *ScoutHandler) ChangeStatus(w http.ResponseWriter, r *http.Request) {
	var req changeStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	userUUID, err := uuid.Parse(req.User_UUID)
	if err != nil {
		http.Error(w, "Invalid UUID format", http.StatusBadRequest)
		return
	}

	if err := h.scoutUsecase.ChangeStatus(r.Context(), userUUID, req.Status); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
