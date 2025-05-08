package qid

import (
	"errors"
	"strings"
)

type QIDList []QID

func (q QIDList) String() string {
	res := []string{}
	for _, v := range q {
		res = append(res, v.String())
	}
	return strings.Join(res, "-")
}

func (q QIDList) MarshalJSON() ([]byte, error) {
	return []byte(`"` + q.String() + `"`), nil
}

func (q *QIDList) UnmarshalJSON(data []byte) error {
	s := string(data)
	if s == "null" {
		return nil
	}
	if !strings.HasPrefix(s, `"`) || !strings.HasSuffix(s, `"`) || len(s) < 2 {
		return errors.New("invalid QIDList, must be a string")
	}

	s = s[1 : len(s)-1]
	parts := strings.Split(s, "-")
	res := []QID{}
	for _, part := range parts {
		qid, err := FromString(part)
		if err != nil {
			return err
		}
		res = append(res, qid)
	}
	*q = res
	return nil
}

func (q *QIDList) UnmarshalText(data []byte) error {
	s := string(data)
	if s == "" {
		*q = nil
		return nil
	}

	parts := strings.Split(s, "-")
	res := []QID{}
	for _, part := range parts {
		qid, err := FromString(part)
		if err != nil {
			return err
		}
		res = append(res, qid)
	}
	*q = res

	return nil
}

func (q QIDList) MarshalText() ([]byte, error) {
	return []byte(q.String()), nil
}

func (q QIDList) IsZero() bool {
	return len(q) == 0
}

func (q QIDList) Len() int {
	return len(q)
}
