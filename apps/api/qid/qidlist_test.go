package qid_test

import (
	"encoding/json"
	"testing"

	"github.com/capmoo/api/qid"
)

func TestQIDListString(t *testing.T) {
	t.Run("valid QIDList", func(t *testing.T) {
		qidList := qid.QIDList{1, 2, 3}
		expected := "D7jnG-6qnS2-RwDqQ"
		if result := qidList.String(); result != expected {
			t.Errorf("Expected %s, got %s", expected, result)
		}
	})

	t.Run("empty QIDList", func(t *testing.T) {
		var qidList qid.QIDList
		if result := qidList.String(); result != "" {
			t.Errorf("Expected empty string, got %s", result)
		}
	})
}

func TestQIDListMarshalJSON(t *testing.T) {
	t.Run("valid QIDList JSON", func(t *testing.T) {
		qidList := qid.QIDList{1, 2}
		raw, err := qidList.MarshalJSON()
		if err != nil {
			t.Errorf("Error when marshalling: %s", err)
			return
		}
		expected := `"D7jnG-6qnS2"`
		if string(raw) != expected {
			t.Errorf("Expected %s, got %s", expected, string(raw))
		}
	})

	t.Run("empty QIDList JSON", func(t *testing.T) {
		var qidList qid.QIDList
		raw, err := qidList.MarshalJSON()
		if err != nil {
			t.Errorf("Error when marshalling: %s", err)
			return
		}
		if string(raw) != `""` {
			t.Errorf("Expected empty JSON string, got %s", raw)
		}
	})
}

type QIDListTest struct {
	List qid.QIDList `json:"list"`
}

func TestQIDListUnmarshalJSON(t *testing.T) {
	t.Run("qid list is valid", func(t *testing.T) {
		raw := []byte(`{"list":"D7jnG-6qnS2"}`)

		var result QIDListTest
		err := json.Unmarshal(raw, &result)
		if err != nil {
			t.Errorf("Error when unmarshal: %s", err)
			return
		}

		if len(result.List) != 2 {
			t.Errorf("Expected list length 2, got %d", len(result.List))
			return
		}

		expectedQIDs := []string{"D7jnG", "6qnS2"}
		for i, qid := range result.List {
			if qid.String() != expectedQIDs[i] {
				t.Errorf("Expected %s, got %s", expectedQIDs[i], qid.String())
			}
		}
	})

	t.Run("qid list is empty", func(t *testing.T) {
		raw := []byte(`{"list":""}`)

		var result QIDListTest
		err := json.Unmarshal(raw, &result)
		if err == nil {
			t.Errorf("Expected error, got nil")
			return
		}
	})

	t.Run("qid list is null", func(t *testing.T) {
		raw := []byte(`{"list":null}`)

		var result QIDListTest
		err := json.Unmarshal(raw, &result)
		if err != nil {
			t.Errorf("Error when unmarshal: %s", err)
			return
		}

		if result.List != nil {
			t.Errorf("Expected list to be nil, got %v", result.List)
		}
	})

	t.Run("qid list with invalid format", func(t *testing.T) {
		raw := []byte(`{"list":12345}`)

		var result QIDListTest
		err := json.Unmarshal(raw, &result)
		if err == nil {
			t.Errorf("Expected error for invalid format, got nil")
		}
	})

	t.Run("qid list with invalid qid in list", func(t *testing.T) {
		raw := []byte(`{"list":"D7jnG-invalid"}`)

		var result QIDListTest
		err := json.Unmarshal(raw, &result)
		if err == nil {
			t.Errorf("Expected error for invalid qid, got nil")
		}
	})
}

func TestQIDListMarshalText(t *testing.T) {
	t.Run("valid QIDList text", func(t *testing.T) {
		qidList := qid.QIDList{1, 2}
		raw, err := qidList.MarshalText()
		if err != nil {
			t.Errorf("Error when marshalling: %s", err)
			return
		}
		expected := "D7jnG-6qnS2"
		if string(raw) != expected {
			t.Errorf("Expected %s, got %s", expected, string(raw))
		}
	})
}

func TestQIDListUnmarshalText(t *testing.T) {
	t.Run("valid QIDList text", func(t *testing.T) {
		raw := []byte("D7jnG-6qnS2")
		var qidList qid.QIDList
		err := qidList.UnmarshalText(raw)
		if err != nil {
			t.Errorf("Error when unmarshalling: %s", err)
			return
		}
		if len(qidList) != 2 || qidList[0] != 1 || qidList[1] != 2 {
			t.Errorf("Expected [1, 2], got %v", qidList)
		}
	})

	t.Run("empty QIDList text", func(t *testing.T) {
		raw := []byte("")
		var qidList qid.QIDList
		err := qidList.UnmarshalText(raw)
		if err != nil {
			t.Errorf("Error when unmarshalling: %s", err)
			return
		}
		if len(qidList) != 0 {
			t.Errorf("Expected empty QIDList, got %v", qidList)
		}
	})

	t.Run("invalid QIDList text", func(t *testing.T) {
		raw := []byte("invalid-QID")
		var qidList qid.QIDList
		err := qidList.UnmarshalText(raw)
		if err == nil {
			t.Error("Expected error, got nil")
		}
	})
}

func TestQIDListIsZero(t *testing.T) {
	t.Run("non-empty QIDList", func(t *testing.T) {
		qidList := qid.QIDList{1}
		if qidList.IsZero() {
			t.Error("Expected non-zero QIDList, got zero")
		}
	})

	t.Run("empty QIDList", func(t *testing.T) {
		var qidList qid.QIDList
		if !qidList.IsZero() {
			t.Error("Expected zero QIDList, got non-zero")
		}
	})
}

func TestQIDListLen(t *testing.T) {
	qidList := qid.QIDList{1, 2, 3}
	if length := qidList.Len(); length != 3 {
		t.Errorf("Expected length 3, got %d", length)
	}

	var emptyList qid.QIDList
	if length := emptyList.Len(); length != 0 {
		t.Errorf("Expected length 0, got %d", length)
	}
}
