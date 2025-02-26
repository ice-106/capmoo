package config

import (
	"log"
	"os"
	"sync"
	"time"

	"github.com/spf13/viper"
)

var (
	conf    AppConfig
	one     sync.Once
	version string
)

type AppConfig struct {
	Env               string `mapstructure:"env"`
	Version           string
	Port              int            `mapstructure:"port"`
	Prefork           bool           `mapstructure:"prefork"`
	LecacySiteBaseURL string         `mapstructure:"legacy_site_base_url"`
	Database          DatabaseConfig `mapstructure:"database"`
	RedisConfig       RedisConfig    `mapstructure:"redis"`
	Cors              CorsConfig     `mapstructure:"cors"`
	Auth              AuthConfig     `mapstructure:"auth"`
	Swagger           SwaggerConfig  `mapstructure:"swagger"`
}

type CorsConfig struct {
	AllowOrigins string `mapstructure:"allow_origins"`
	AllowHeaders string `mapstructure:"allow_headers"`
}

type DatabaseConfig struct {
	Url string `mapstructure:"url"`
}

type RedisConfig struct {
	Url      string `mapstructure:"url"`
	Password string `mapstructure:"password"`
	DB       int    `mapstructure:"db"`
}

type AuthConfig struct {
	RefreshTokenTTL time.Duration `mapstructure:"refresh_ttl"`
	AccessTokenTTL  time.Duration `mapstructure:"access_ttl"`
	Secret          string        `mapstructure:"secret"`
	Aud             string        `mapstructure:"aud"`
	Iss             string        `mapstructure:"iss"`
}

type SwaggerConfig struct {
	HostUrl string `mapstructure:"host_url"`
}

func (c *AppConfig) IsProduction() bool {
	return c.Env == "production"
}

func (c *AppConfig) IsDevelopment() bool {
	return c.Env == "development"
}

func Load(path ...string) *AppConfig {
	one.Do(func() {
		appConfig := AppConfig{}

		filePath := os.Getenv("CONFIG_FILE_PATH")

		if filePath != "" {
			viper.SetConfigFile(filePath)
		} else if len(path) > 0 {
			p := path[0]
			viper.SetConfigFile(p)
		} else {
			viper.AddConfigPath("./config")
			viper.SetConfigName("config")
		}

		viper.SetConfigType("yaml")

		if err := viper.ReadInConfig(); err != nil {
			log.Fatal("error occurs while reading the config. ", err)
		}

		if err := viper.Unmarshal(&appConfig); err != nil {
			log.Fatal("error occurs while unmarshalling the config. ", err)
		}
		appConfig.Version = version
		conf = appConfig
	})
	return &conf
}

func SetVersion(v string) {
	version = v
}
