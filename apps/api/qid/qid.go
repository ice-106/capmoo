package qid

import (
	"errors"
	"strconv"
	"strings"

	"github.com/sqids/sqids-go"
)

// qid is a package that provides a ID from integer. Based on the sqids-go package.

// alphabet is the base57, shuffled is needed to make it harder to reverse engineer the ID
const alphabet = "4VMdpDSzxejnkrFB3cRGuahE7ZtWwbs8Q5KN9qXmyLfU2PYiCJH6vTAgo"

func init() {
	instance, err := sqids.New(
		sqids.Options{
			Alphabet:  alphabet,
			MinLength: 5,
		},
	)
	if err != nil {
		panic(err)
	}

	encoder.Sqids = instance
}

var encoder qidEncoder

type qidEncoder struct {
	*sqids.Sqids
	devMode bool
}

type QID uint64

func SetDevMode(devMode bool) {
	encoder.devMode = devMode
}

func FromString(s string) (QID, error) {
	if encoder.devMode && strings.HasPrefix(s, "dev-") {
		s = s[4:]
		data, err := strconv.Atoi(s)

		return QID(data), err
	}
	ints := encoder.Decode(s)
	if len(ints) != 1 {
		return 0, errors.New("invalid QID")
	}

	// We need to check if the string is matched when re-encoded
	// see: https://sqids.org/faq#valid-ids
	newString, err := encoder.Encode(ints)
	if err != nil {
		return 0, err
	}
	if newString != s {
		return 0, errors.New("invalid QID, string can be decoded but not matched")
	}

	return QID(ints[0]), nil
}

func (q QID) String() string {
	return FromInt(uint64(q))
}

func (q QID) IsZero() bool {
	return q == 0
}

func (q QID) MarshalJSON() ([]byte, error) {
	return []byte(`"` + q.String() + `"`), nil
}

func (q *QID) UnmarshalJSON(data []byte) error {
	s := string(data)
	if s == "null" {
		return nil
	}
	if !strings.HasPrefix(s, `"`) || !strings.HasSuffix(s, `"`) || len(s) < 2 {
		return errors.New("invalid QID, must be a string")
	}

	s = s[1 : len(s)-1]

	qid, err := FromString(s)
	if err != nil {
		return err
	}
	*q = qid
	return nil
}

func (q QID) MarshalText() ([]byte, error) {
	return []byte(q.String()), nil
}

func (q *QID) UnmarshalText(data []byte) error {
	s := string(data)
	if s == "" {
		*q = 0
		return nil
	}

	qid, err := FromString(s)
	if err != nil {
		return err
	}
	*q = qid
	return nil
}

func (q QID) Int() int {
	return int(q)
}

func (q QID) Uint() uint {
	return uint(q)
}

type integer interface {
	int8 | int16 | int32 | int64 | int | uint8 | uint16 | uint32 | uint64
}

func FromInt[T integer](i T) string {
	res, _ := encoder.Encode([]uint64{uint64(i)})
	return res
}
