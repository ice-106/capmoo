package config

import (
	"log"
	"os"
	"reflect"
	"strings"
	"sync"

	"github.com/spf13/viper"
)

type Config struct {
	Env               string `mapstructure:"API_ENV"`
	Port              int    `mapstructure:"API_PORT"`
	DatabaseUrl       string `mapstructure:"API_DATABASE_URL"`
	AllowedOrigins    string `mapstructure:"API_ALLOWED_ORIGINS"`
	AllowedHeaders    string `mapstructure:"API_ALLOWED_HEADERS"`
	CognitoPoolId     string `mapstructure:"API_COGNITO_POOL_ID"`
	RedisUrl          string `mapstructure:"API_REDIS_URL"`
	RedisPassword     string `mapstructure:"API_REDIS_PASSWORD"`
	RedisDB           int    `mapstructure:"API_REDIS_DB"`
	S3Region          string `mapstructure:"API_S3_REGION"`
	S3AccessKeyId     string `mapstructure:"API_S3_ACCESS_KEY_ID"`
	S3SecretAccessKey string `mapstructure:"API_S3_SECRET_ACCESS_KEY"`
	S3BucketName      string `mapstructure:"API_S3_BUCKET_NAME"`
}

func (c *Config) IsProduction() bool {
	return c.Env == "production"
}

func (c *Config) IsDevelopment() bool {
	return c.Env == "development"
}

var (
	conf Config
	one  sync.Once
)

func BindEnvs(iface interface{}, parts ...string) {
	ifv := reflect.ValueOf(iface)
	ift := reflect.TypeOf(iface)
	for i := 0; i < ift.NumField(); i++ {
		v := ifv.Field(i)
		t := ift.Field(i)
		tv, ok := t.Tag.Lookup("mapstructure")
		if !ok {
			continue
		}
		switch v.Kind() {
		case reflect.Struct:
			BindEnvs(v.Interface(), append(parts, tv)...)
		default:
			viper.BindEnv(strings.Join(append(parts, tv), "."))
		}
	}
}

func LoadConfig(path ...string) *Config {
	one.Do(func() {
		appConfig := Config{}

		filePath := os.Getenv("CONFIG_FILE_PATH")
		if filePath != "" {
			viper.SetConfigFile(filePath)
		} else if len(path) > 0 {
			p := path[0]
			viper.SetConfigFile(p)
		} else {
			viper.AddConfigPath(".")
			viper.SetConfigName(".env")
		}
		viper.SetConfigType("env")

		BindEnvs(appConfig)

		viper.AutomaticEnv()

		if err := viper.ReadInConfig(); err != nil {
			log.Println("Warning: Could not read config file, using environment variables instead:", err)
		}

		if err := viper.Unmarshal(&appConfig); err != nil {
			log.Fatal("Error unmarshalling config:", err)
		}

		conf = appConfig
	})

	return &conf
}
