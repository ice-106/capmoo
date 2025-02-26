package logger

import (
	"context"
	"log/slog"
	"os"

	"github.com/capmoo/api/internal/api"
	"github.com/capmoo/api/internal/config"
	"github.com/capmoo/api/internal/middleware"
	"github.com/capmoo/api/pkg/logger/plog"
)

// SetupMinimalLogger sets up a minimal logger when config is not available yet
func SetupMinimalLogger() {
	handler := slog.NewJSONHandler(os.Stdout, nil)
	slog.SetDefault(slog.New(handler))
}

func InitLogger(cfg *config.AppConfig) {
	var handler slog.Handler
	if cfg.IsDevelopment() {
		// Setting up pretty logger
		handler = plog.NewHandler(nil)
	} else {
		handler = slog.NewJSONHandler(os.Stdout, nil)
	}

	handler = NewLoggerHandler(handler)
	slog.SetDefault(slog.New(handler))
}

var _ slog.Handler = &LoggerHandler{}

// LoggerHandler is a proxy for slog.Handler.
// It is used to capture the values from the context and pass them to the logger.
type LoggerHandler struct {
	handler slog.Handler
}

func NewLoggerHandler(handler slog.Handler) *LoggerHandler {
	return &LoggerHandler{
		handler: handler,
	}
}

// Enabled implements slog.Handler.
func (l *LoggerHandler) Enabled(ctx context.Context, level slog.Level) bool {
	return l.handler.Enabled(ctx, level)
}

// Handle implements slog.Handler.
func (l *LoggerHandler) Handle(ctx context.Context, record slog.Record) error {
	requestID := ctx.Value(middleware.RequestIDKey)
	if requestID != nil {
		record.AddAttrs(slog.Any("requestID", requestID))
	}

	userID := ctx.Value(api.UserIDKey)
	if userID != nil {
		record.AddAttrs(slog.Any("requesterUserID", userID))
	}
	return l.handler.Handle(ctx, record)
}

// WithAttrs implements slog.Handler.
func (l *LoggerHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	return &LoggerHandler{
		handler: l.handler.WithAttrs(attrs),
	}
}

// WithGroup implements slog.Handler.
func (l *LoggerHandler) WithGroup(name string) slog.Handler {
	return &LoggerHandler{
		handler: l.handler.WithGroup(name),
	}
}
