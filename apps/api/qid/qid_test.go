package qid_test

import (
	"encoding/json"
	"testing"

	"github.com/capmoo/api/qid"
)

type QIDTestWithPointer struct {
	NullableID *qid.QID `json:"nullable_id"`
}

type QIDTestNoPointer struct {
	ID qid.QID `json:"id"`
}

func TestQIDUnmarshalJSON(t *testing.T) {
	t.Run("qid is valid", func(t *testing.T) {
		raw := []byte(`{"nullable_id":"D7jnG"}`)

		var result QIDTestWithPointer
		err := json.Unmarshal(raw, &result)
		if err != nil {
			t.Errorf("Error when unmarshal: %s", err)
			return
		}

		if result.NullableID == nil {
			t.Errorf("Expected nullableID to be not nil, got %v", result.NullableID)
			return
		}

		if *result.NullableID != 1 {
			t.Errorf("Expected 1, got %v", result.NullableID.Int())
			return
		}
	})

	t.Run("qid is empty in json", func(t *testing.T) {
		raw := []byte(`{"nullable_id":""}`)

		var result QIDTestWithPointer
		err := json.Unmarshal(raw, &result)
		if err == nil {
			t.Errorf("Expected error, got nil")
			return
		}

		if result.NullableID == nil {
			t.Errorf("Expected nullableID to be not nil, got %v", result.NullableID)
			return
		}

		if !result.NullableID.IsZero() {
			t.Errorf("Expected nullableID to be invalid (0), got %v", result.NullableID.Int())
			return
		}
	})

	t.Run("qid is null in json and is pointer", func(t *testing.T) {
		raw := []byte(`{"nullable_id":null}`)

		var result QIDTestWithPointer
		err := json.Unmarshal(raw, &result)
		if err != nil {
			t.Errorf("Error when unmarshal: %s", err)
			return
		}

		if result.NullableID != nil {
			t.Errorf("Expected nullableID to be nil, got %v", result.NullableID)
			return
		}
	})

	t.Run("qid is null in json and is not pointer", func(t *testing.T) {
		raw := []byte(`{"id":null}`)

		var result QIDTestNoPointer
		err := json.Unmarshal(raw, &result)
		if err != nil {
			t.Errorf("Error when unmarshal: %s", err)
			return
		}

		if !result.ID.IsZero() {
			t.Errorf("Expected 0, got %v", result.ID.Int())
			return
		}
	})

	t.Run("qid is invalid", func(t *testing.T) {
		raw := []byte(`{"id":"ภาษาไทย"}`)

		var result QIDTestNoPointer
		err := json.Unmarshal(raw, &result)
		if err == nil {
			t.Errorf("Expected error, got nil")
		}

		if !result.ID.IsZero() {
			t.Errorf("Expected 0, got %v", result.ID.Int())
		}
	})

	t.Run("qid is invalid when not match", func(t *testing.T) {
		raw := []byte(`{"id":"D7jnGWin"}`)

		var result QIDTestNoPointer
		err := json.Unmarshal(raw, &result)
		if err == nil {
			t.Errorf("Expected error, got nil")
		}

		if !result.ID.IsZero() {
			t.Errorf("Expected 0, got %v", result.ID.Int())
		}
	})
}

func TestQIDMarshalJSON(t *testing.T) {
	t.Run("qid is valid", func(t *testing.T) {
		qid := qid.QID(1)
		raw, err := json.Marshal(qid)
		if err != nil {
			t.Errorf("Error when marshal: %s", err)
			return
		}

		if string(raw) != `"D7jnG"` {
			t.Errorf("Expected 1, got %s", raw)
			return
		}
	})

	t.Run("qid is nil", func(t *testing.T) {
		var qid *qid.QID
		raw, err := json.Marshal(qid)
		if err != nil {
			t.Errorf("Error when marshal: %s", err)
			return
		}

		if string(raw) != `null` {
			t.Errorf("Expected null, got %s", raw)
			return
		}
	})
}

func TestQIDUnmarshalText(t *testing.T) {
	t.Run("qid is valid", func(t *testing.T) {
		raw := []byte(`D7jnG`)

		var result qid.QID
		err := result.UnmarshalText(raw)
		if err != nil {
			t.Errorf("Error when unmarshal: %s", err)
			return
		}

		if result != 1 {
			t.Errorf("Expected 1, got %v", result)
			return
		}
	})

	t.Run("qid is empty", func(t *testing.T) {
		raw := []byte(``)

		var result qid.QID
		err := result.UnmarshalText(raw)
		if err != nil {
			t.Errorf("Expected error, got nil")
			return
		}

		if !result.IsZero() {
			t.Errorf("Expected 0, got %v", result)
			return
		}
	})

	t.Run("qid is invalid", func(t *testing.T) {
		raw := []byte(`ภาษาไทย`)

		var result qid.QID
		err := result.UnmarshalText(raw)
		if err == nil {
			t.Errorf("Expected error, got nil")
		}

		if !result.IsZero() {
			t.Errorf("Expected 0, got %v", result)
		}
	})
}
