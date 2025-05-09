package config

import (
	"log"
	"os"
	"reflect"
	"strconv"
	"strings"
	"sync"

	"github.com/spf13/viper"
)

type Config struct {
	Env               string `mapstructure:"API_ENV" envvar:"API_ENV"`
	Port              int    `mapstructure:"API_PORT" envvar:"API_PORT"`
	DatabaseUrl       string `mapstructure:"API_DATABASE_URL" envvar:"API_DATABASE_URL"`
	AllowedOrigins    string `mapstructure:"API_ALLOWED_ORIGINS" envvar:"API_ALLOWED_ORIGINS"`
	AllowedHeaders    string `mapstructure:"API_ALLOWED_HEADERS" envvar:"API_ALLOWED_HEADERS"`
	CognitoPoolId     string `mapstructure:"API_COGNITO_POOL_ID" envvar:"API_COGNITO_POOL_ID"`
	RedisUrl          string `mapstructure:"API_REDIS_URL" envvar:"API_REDIS_URL"`
	RedisPassword     string `mapstructure:"API_REDIS_PASSWORD" envvar:"API_REDIS_PASSWORD"`
	RedisDB           int    `mapstructure:"API_REDIS_DB" envvar:"API_REDIS_DB"`
	S3Region          string `mapstructure:"API_S3_REGION" envvar:"API_S3_REGION"`
	S3AccessKeyId     string `mapstructure:"API_S3_ACCESS_KEY_ID" envvar:"API_S3_ACCESS_KEY_ID"`
	S3SecretAccessKey string `mapstructure:"API_S3_SECRET_ACCESS_KEY" envvar:"API_S3_SECRET_ACCESS_KEY"`
	S3BucketName      string `mapstructure:"API_S3_BUCKET_NAME" envvar:"API_S3_BUCKET_NAME"`
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
		tv, ok := t.Tag.Lookup("envvar")
		if !ok {
			// Fall back to mapstructure tag if no envvar tag is present
			tv, ok = t.Tag.Lookup("mapstructure")
			if !ok {
				continue
			}
		}
		switch v.Kind() {
		case reflect.Struct:
			BindEnvs(v.Interface(), append(parts, tv)...)
		default:
			// Bind the variable directly without joining paths
			viper.BindEnv(tv)
		}
	}
}

func LoadConfig(path ...string) *Config {
	one.Do(func() {
		appConfig := Config{}

		// First, try to load directly from OS environment variables
		// This is especially important for Windows PowerShell environments
		// where variables are set with $env:VARIABLE=VALUE
		loadFromOSEnvironment(&appConfig)

		// If some values are still missing, try to load from .env file
		configLoaded := false
		filePath := os.Getenv("CONFIG_FILE_PATH")

		// Set up Viper for config files
		viper.AutomaticEnv()
		BindEnvs(appConfig)

		if filePath != "" {
			viper.SetConfigFile(filePath)
			if err := viper.ReadInConfig(); err == nil {
				configLoaded = true
				log.Println("Using config file:", viper.ConfigFileUsed())
			}
		} else if len(path) > 0 {
			p := path[0]
			viper.SetConfigFile(p)
			if err := viper.ReadInConfig(); err == nil {
				configLoaded = true
				log.Println("Using config file:", viper.ConfigFileUsed())
			}
		} else {
			// Try to load from .env in current directory
			viper.AddConfigPath(".")
			viper.SetConfigName(".env")
			viper.SetConfigType("env")

			if err := viper.ReadInConfig(); err == nil {
				configLoaded = true
				log.Println("Using config file:", viper.ConfigFileUsed())
			}
		}

		// Fill in any missing values from viper
		if configLoaded {
			if err := viper.Unmarshal(&appConfig); err != nil {
				log.Println("Warning: Error unmarshalling config from file:", err)
			}
		} else {
			log.Println("No config file found, using environment variables only")
		}

		// Validate and set defaults for required configs
		validateConfig(&appConfig)

		// Log the final configuration (excluding sensitive fields)
		logConfig(&appConfig)

		conf = appConfig
	})
	return &conf
}

// loadFromOSEnvironment reads environment variables directly using os.Getenv
// This is especially important for Windows PowerShell environments
func loadFromOSEnvironment(config *Config) {
	configType := reflect.TypeOf(*config)
	configValue := reflect.ValueOf(config).Elem()

	for i := 0; i < configType.NumField(); i++ {
		field := configType.Field(i)
		fieldValue := configValue.Field(i)

		// Get the environment variable name from the tag
		envName, ok := field.Tag.Lookup("envvar")
		if !ok {
			// Fall back to mapstructure tag
			envName, ok = field.Tag.Lookup("mapstructure")
			if !ok {
				continue
			}
		}

		// Get the environment variable value
		envValue := os.Getenv(envName)
		if envValue == "" {
			continue // Skip if not set
		}

		// Set the field value based on its type
		switch fieldValue.Kind() {
		case reflect.String:
			fieldValue.SetString(envValue)
		case reflect.Int, reflect.Int64:
			if intVal, err := strconv.Atoi(envValue); err == nil {
				fieldValue.SetInt(int64(intVal))
			}
		case reflect.Bool:
			if boolVal, err := strconv.ParseBool(envValue); err == nil {
				fieldValue.SetBool(boolVal)
			}
		}
	}
}

// validateConfig ensures that critical configuration values are present
func validateConfig(config *Config) {
	if config.Env == "" {
		log.Println("Warning: API_ENV is not set, defaulting to development")
		config.Env = "development"
	}

	if config.Port == 0 {
		log.Println("Warning: API_PORT is not set, defaulting to 8080")
		config.Port = 8080
	}

	// Add more validations for required fields if needed
}

// logConfig logs the current configuration (excluding sensitive fields)
func logConfig(config *Config) {
	log.Printf("Configuration loaded with:")
	log.Printf("  API_ENV: %s", config.Env)
	log.Printf("  API_PORT: %d", config.Port)
	log.Printf("  API_DATABASE_URL: %s", maskSensitiveInfo(config.DatabaseUrl))
	log.Printf("  API_ALLOWED_ORIGINS: %s", config.AllowedOrigins)
	log.Printf("  API_ALLOWED_HEADERS: %s", config.AllowedHeaders)
	log.Printf("  API_COGNITO_POOL_ID: %s", config.CognitoPoolId)
	log.Printf("  API_S3_REGION: %s", config.S3Region)
	log.Printf("  API_S3_BUCKET_NAME: %s", config.S3BucketName)

	// Don't log sensitive information like S3 credentials
	if config.S3AccessKeyId != "" {
		log.Println("  API_S3_ACCESS_KEY_ID: [REDACTED]")
	}

	if config.S3SecretAccessKey != "" {
		log.Println("  API_S3_SECRET_ACCESS_KEY: [REDACTED]")
	}
}

// maskSensitiveInfo masks sensitive information in strings like database URLs
func maskSensitiveInfo(input string) string {
	if input == "" {
		return ""
	}

	// For database URLs, mask the password
	if strings.Contains(input, "://") {
		parts := strings.Split(input, "@")
		if len(parts) > 1 {
			credentials := strings.Split(parts[0], "://")
			if len(credentials) > 1 {
				userPass := strings.Split(credentials[1], ":")
				if len(userPass) > 1 {
					// Mask the password part
					return credentials[0] + "://" + userPass[0] + ":****@" + parts[1]
				}
			}
		}
	}

	return input
}
