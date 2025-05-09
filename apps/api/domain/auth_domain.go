package domain

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/capmoo/api/config"
)

type AuthDomain interface {
	ValidateAccessToken(accessToken string) (*UserInfo, error)
}

type AuthDomainImpl struct {
	config *config.Config
}

var _ AuthDomain = &AuthDomainImpl{}

func NewAuthDomain(config *config.Config) *AuthDomainImpl {
	return &AuthDomainImpl{
		config: config,
	}
}

type UserInfo struct {
	Sub           string `json:"sub"`
	Email         string `json:"email"`
	EmailVerified string `json:"email_verified"`
	Name          string `json:"name"`
	Username      string `json:"username"`
	Identities    string `json:"identities"`
}

type ErrorResponse struct {
	Error            string `json:"error"`
	ErrorDescription string `json:"error_description"`
}

func (a *AuthDomainImpl) ValidateAccessToken(accessToken string) (*UserInfo, error) {
	url := fmt.Sprintf("https://%s.auth.ap-southeast-1.amazoncognito.com/oauth2/userInfo", a.config.CognitoPoolId)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("can't validate access token when creating request: %w", err)
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))

	customTransport := &http.Transport{
		TLSClientConfig: &tls.Config{
			InsecureSkipVerify: true,
		},
	}
	client := &http.Client{
		Transport: customTransport,
		Timeout:   10 * time.Second,
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("can't validate access token when sending request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("can't validate access token when reading response body: %w", err)
	}

	if resp.StatusCode == http.StatusOK {
		var userInfo UserInfo
		if err := json.Unmarshal(body, &userInfo); err != nil {
			return nil, fmt.Errorf("can't validate access token when unmarshalling response body: %w", err)
		}
		return &userInfo, nil
	} else {
		var errResp ErrorResponse
		if err := json.Unmarshal(body, &errResp); err != nil {
			return nil, fmt.Errorf("can't validate access token when unmarshalling error response body: %w", err)
		}
		return nil, fmt.Errorf("can't validate access token: %s", errResp.ErrorDescription)
	}
}
