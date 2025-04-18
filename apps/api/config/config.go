package config

import (
	"log"
	"os"
	"sync"

	"github.com/spf13/viper"
)

type Config struct {
	Env            string `mapstructure:"ENV"`
	Port           int    `mapstructure:"PORT"`
	DatabaseUrl    string `mapstructure:"DATABASE_URL"`
	AllowedOrigins string `mapstructure:"ALLOWED_ORIGINS"`
	AllowedHeaders string `mapstructure:"ALLOWED_HEADERS"`
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

		if err := viper.ReadInConfig(); err != nil {
			log.Fatal("error occurs while reading the config. ", err)
		}

		if err := viper.Unmarshal(&appConfig); err != nil {
			log.Fatal("error occurs while unmarshalling the config. ", err)
		}
		conf = appConfig
	})
	return &conf
}
