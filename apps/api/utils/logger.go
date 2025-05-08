package logger

import (
	"os"

	"github.com/capmoo/api/errorutil"
	prettyconsole "github.com/thessem/zap-prettyconsole"

	"github.com/joomcode/errorx"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// Logger type
type Logger struct {
	*zap.Logger
}

// RequestInfo .
type RequestInfo struct {
	Action        string
	TraceID       string
	ParentID      string
	SpanID        string
	RemoteAddress string
	Tag           string
	Msg           string
}

type Config struct {
	Environment string
}

var logger *zap.Logger = zap.NewExample()

func encodeLevel() zapcore.LevelEncoder {
	return func(l zapcore.Level, enc zapcore.PrimitiveArrayEncoder) {
		switch l {
		case zapcore.DebugLevel:
			enc.AppendString("DEBUG")
		case zapcore.InfoLevel:
			enc.AppendString("INFO")
		case zapcore.WarnLevel:
			enc.AppendString("WARNING")
		case zapcore.ErrorLevel:
			enc.AppendString("ERROR")
		case zapcore.DPanicLevel:
			enc.AppendString("CRITICAL")
		case zapcore.PanicLevel:
			enc.AppendString("ALERT")
		case zapcore.FatalLevel:
			enc.AppendString("EMERGENCY")
		}
	}
}

func InitLogger(cf *Config) error {
	ec := zap.NewProductionEncoderConfig()
	ec.LevelKey = "severity"
	ec.EncodeTime = zapcore.ISO8601TimeEncoder
	ec.EncodeLevel = encodeLevel()

	var cfg zap.Config
	if cf.Environment == "production" {
		cfg = zap.NewProductionConfig()
		cfg.OutputPaths = []string{"stdout"}
		cfg.EncoderConfig = ec
	} else if cf.Environment == "development" {
		cfg = prettyconsole.NewConfig()
		cfg.Level = zap.NewAtomicLevelAt(zap.DebugLevel)
		cfg.OutputPaths = []string{"stdout"}
	} else if cf.Environment == "test" {
		cfg = zap.NewDevelopmentConfig()
		cfg.OutputPaths = []string{}
		cfg.EncoderConfig = ec
	} else { // local
		cfg = zap.NewDevelopmentConfig()
		cfg.OutputPaths = []string{"stdout"}
		cfg.EncoderConfig = ec
	}

	l, err := cfg.Build()
	if err != nil {
		return errorutil.WithStack(err)
	}

	hostname, _ := os.Hostname()
	if hostname == "" {
		hostname = "unknown"
	}

	logger = l.With(zap.String("hostname", hostname))
	return nil
}

func NewLoggerWithRequestInfo(ri *RequestInfo) Logger {
	return Logger{
		logger.With(
			zap.String("trace_id", ri.TraceID),
			zap.String("parent_id", ri.ParentID),
			zap.String("span_id", ri.SpanID),
			zap.String("remote_address", ri.RemoteAddress),
			zap.String("node_id", ""),
		),
	}
}

func NewRequestLogger(reqID string, apiPath string) Logger {
	return Logger{
		logger.With(
			zap.String("request_id", reqID),
			zap.String("api_path", apiPath),
		),
	}
}

func Panic(msg string, fields ...zapcore.Field) {
	logger.WithOptions(zap.AddCallerSkip(1)).Panic(msg, fields...)
}

func Error(msg string, fields ...zapcore.Field) {
	logger.WithOptions(zap.AddCallerSkip(1)).Error(msg, fields...)
}

func Warn(msg string, fields ...zapcore.Field) {
	logger.WithOptions(zap.AddCallerSkip(1)).Warn(msg, fields...)
}

func Info(msg string, fields ...zapcore.Field) {
	logger.WithOptions(zap.AddCallerSkip(1)).Info(msg, fields...)
}

func Debug(msg string, fields ...zapcore.Field) {
	logger.WithOptions(zap.AddCallerSkip(1)).Debug(msg, fields...)
}

func With(fields ...zapcore.Field) *zap.Logger {
	return logger.With(fields...)
}

func Sync() error {
	if err := errorx.EnsureStackTrace(logger.Sync()); err != nil {
		return err
	}
	return nil
}
